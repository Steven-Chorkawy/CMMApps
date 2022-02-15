import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/sites";
import "@pnp/sp/lists";
import "@pnp/sp/security/list";
import "@pnp/sp/site-users/web";
import "@pnp/sp/fields";
import "@pnp/sp/files";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/content-types";
import IMemberListItem from "../ClaringtonInterfaces/IMemberListItem";
import { MyLists } from "./MyLists";
import { ListItemAccessor } from "@microsoft/sp-listview-extensibility";
import ICommitteeFileItem from "../ClaringtonInterfaces/ICommitteeFileItem";
import { IItemAddResult, IItemUpdateResult } from "@pnp/sp/items";
import { IContentTypeInfo } from "@pnp/sp/content-types";
import { IFolderAddResult } from "@pnp/sp/folders";
import { ICommitteeMemberHistoryListItem, ICommitteeMemberHistory_NewListItem } from "../ClaringtonInterfaces/ICommitteeMemberHistory";

//#region Constants
export const FORM_DATA_INDEX = "formDataIndex";
//#endregion

//#region Formatters
/**
 * Format Fluent UI DatePicker.
 * @param date Date input from Fluent UI DatePicker
 * @returns Month/Day/Year as a string.
 */
export const OnFormatDate = (date?: Date): string => {
    return !date ? '' : (date.getMonth() + 1) + '/' + date.getDate() + '/' + (date.getFullYear());
};

/**
 * Format a path to a document set that will be created.
 * @param libraryTitle Title of Library
 * @param title Title of new Folder/Document Set to be created.
 * @returns Path to Document set as string.
 */
export const FormatDocumentSetPath = async (libraryTitle: string, title: string): Promise<string> => {
    let library = await sp.web.lists.getByTitle(libraryTitle).select('Title', 'RootFolder/ServerRelativeUrl').expand('RootFolder').get();
    return `${library.RootFolder.ServerRelativeUrl}/${title}`;
};

export const CheckForExistingDocumentSetByServerRelativePath = async (serverRelativePath: string): Promise<boolean> => {
    return await (await sp.web.getFolderByServerRelativePath(serverRelativePath).select('Exists').get()).Exists;
};

/**
 * Calculate a term end date.
 * Term End Date = start date + Term Length.
 */
export const CalculateTermEndDate = (startDate: Date, termLength: number): Date => {
    return new Date(startDate.getFullYear() + termLength, startDate.getMonth(), startDate.getDate());
};

/**
 * Calculate a committee members personal contact information retention period.
 * Personal Contact Information retention period = last committee term end date + 5 years.
 * @param memberId ID of the member that we are trying to calculate for.
 * @returns The date the members personal contact info should be deleted.
 */
export const CalculateMemberInfoRetention = async (memberId: number): Promise<{ date, committee }> => {
    let output: Date = undefined;
    let committeeName: string = undefined;
    const RETENTION_PERIOD = 5; // Retention is 5 years + last Term End Date.
    let memberHistory = await sp.web.lists.getByTitle(MyLists.CommitteeMemberHistory).items
        .filter(`SPFX_CommitteeMemberDisplayNameId eq ${memberId}`)
        .orderBy('OData__EndDate', false).get();

    if (memberHistory && memberHistory.length > 0) {
        let tmpDate = new Date(memberHistory[0].OData__EndDate);
        output = new Date(tmpDate.getFullYear() + RETENTION_PERIOD, tmpDate.getMonth(), tmpDate.getDate());
        committeeName = memberHistory[0].CommitteeName;
    }

    return { date: output, committee: committeeName };
};

export const CalculateTotalYearsServed = (committeeTerms: ICommitteeMemberHistoryListItem[]): number => {
    /**
     * Steps to confirm Total Years Served.
     * 1.   Start date must be less than today.  If is not ignore this term as it is invalid.
     * 2.   End date must be greater than or equal to day.  If it is not use today's date.
     * 3.   
     */
    debugger;
    let totalYears: number = 0;
    let termTotal: number = 0;

    for (let termIndex = 0; termIndex < committeeTerms.length; termIndex++) {
        // reset this counter. 
        termTotal = 0;

        const term = committeeTerms[termIndex];
        let startDate = new Date(term.StartDate),
            endDate = new Date(term.OData__EndDate),
            today = new Date();

        console.log(term);
        if (startDate > today) {
            debugger;
            console.log('Something went wrong!');
            continue; // Continue onto the next iteration. 
        }

        // End date is currently in the future so we will use today's date to calculate the total terms served. 
        if (endDate >= today) {
            endDate = today;
        }

        termTotal = endDate.getFullYear() - startDate.getFullYear();
        
        // Add to the running total.
        totalYears += termTotal;
    }

    return totalYears;
};
//#endregion

//#region Create
export const CreateNewMember = async (member: IMemberListItem): Promise<IItemAddResult> => {
    member.Title = `${member.LastName}, ${member.FirstName}`;
    // add an item to the list
    let iar = await sp.web.lists.getByTitle(MyLists.Members).items.add(member);
    return iar;
};

/**
 * Create a document set for an existing member in a committee library.
 * @param member ID of the member to add to a committee.
 * @param committee Committee to add member to.
 * TODO: What type should the committee param be?
 */
export const CreateNewCommitteeMember = async (memberId: number, committee: any): Promise<void> => {
    if (!committee) {
        throw "No Committee provided.";
    }

    let member = await sp.web.lists.getByTitle(MyLists.Members).items.getById(memberId).get();
    const PATH_TO_DOC_SET = await FormatDocumentSetPath(committee.CommitteeName, member.Title);

    // Step 1: Create the document set.
    let docSet = await (await CreateDocumentSet({ LibraryTitle: committee.CommitteeName, Title: member.Title })).item.get();

    // Step 2: Update Metadata.
    sp.web.lists.getByTitle(committee.CommitteeName).items.getById(docSet.ID).update({
        OData__EndDate: committee._EndDate,
        StartDate: committee.StartDate,
        Position: committee.Position,
        OData__Status: committee._Status,
        SPFX_CommitteeMemberDisplayNameId: memberId
    });

    // Step 3: Upload Attachments. 
    if (committee.Files) {
        committee.Files.map(file => {
            file.downloadFileContent().then(fileContent => {
                sp.web.getFolderByServerRelativeUrl(PATH_TO_DOC_SET).files.add(file.fileName, fileContent, true);
            });
        });
    }

    // Step 4: Update Committee Member List Item to include this new committee.
    // TODO: How do I manage this relationship? 

    // Step 5: Create a committee member history list item record.
    CreateCommitteeMemberHistoryItem({
        CommitteeName: committee.CommitteeName,
        OData__EndDate: committee._EndDate,
        StartDate: committee.StartDate,
        FirstName: member.FirstName,
        LastName: member.LastName,
        SPFX_CommitteeMemberDisplayNameId: memberId,
        MemberID: memberId,
        Title: `${member.FirstName} ${member.LastName}`
    });
};

export const CreateDocumentSet = async (input): Promise<IItemUpdateResult> => {
    let newFolderResult: IFolderAddResult;
    let FOLDER_NAME = await FormatDocumentSetPath(input.LibraryTitle, input.Title);
    let libraryDocumentSetContentTypeId;

    try {
        libraryDocumentSetContentTypeId = await GetLibraryContentTypes(input.LibraryTitle);
        if (!libraryDocumentSetContentTypeId) {
            throw "Error! Cannot get content type for library.";
        }

        // Because sp.web.folders.add overwrites existing folder I have to do a manual check.
        if (await CheckForExistingDocumentSetByServerRelativePath(FOLDER_NAME)) {
            throw `Error! Cannot Create new Document Set. Duplicate Name detected. "${FOLDER_NAME}"`;
        }

        newFolderResult = await sp.web.folders.add(FOLDER_NAME);
    } catch (error) {
        console.error(error);
        throw error;
    }

    let newFolderProperties = await sp.web.getFolderByServerRelativeUrl(newFolderResult.data.ServerRelativeUrl).listItemAllFields.get();
    return await sp.web.lists.getByTitle(input.LibraryTitle).items.getById(newFolderProperties.ID).update({
        ContentTypeId: libraryDocumentSetContentTypeId
    });
};

export const CreateCommitteeMemberHistoryItem = async (committeeMemberHistoryItem: ICommitteeMemberHistory_NewListItem) => {
    await sp.web.lists.getByTitle(MyLists.CommitteeMemberHistory).items.add({ ...committeeMemberHistoryItem });

    let committeeMemberContactInfoRetention = await CalculateMemberInfoRetention(committeeMemberHistoryItem.SPFX_CommitteeMemberDisplayNameId);

    await sp.web.lists.getByTitle(MyLists.Members).items.getById(committeeMemberHistoryItem.SPFX_CommitteeMemberDisplayNameId).update({
        RetentionDate: committeeMemberContactInfoRetention.date,
        RetentionDateCommittee: committeeMemberContactInfoRetention.committee
    });
};

export const RenewCommitteeMember = async (values: any): Promise<any> => {
    console.log('RenewCommitteeMember');
    console.log(values);
    return;
};
//#endregion

//#region Read
export const GetChoiceColumn = async (listTitle: string, columnName: string): Promise<string[]> => {
    try {
        let choiceColumn: any = await sp.web.lists.getByTitle(listTitle).fields.getByTitle(columnName).select('Choices').get();
        return choiceColumn.Choices;
    } catch (error) {
        console.log('Something went wrong in GetChoiceColumn!');
        console.error(error);
        return [];
    }
};

/**
 * Get committee data from the CommitteeFiles library.
 * @param committeeName Name of the Committee Document Set.
 * @returns CommitteeFiles Document Set metadata. 
 */
export const GetCommitteeByName = async (committeeName: string): Promise<ICommitteeFileItem> => {
    try {
        let output = await sp.web.lists.getByTitle(MyLists.CommitteeFiles).items.filter(`Title eq '${committeeName}'`).get();

        if (output && output.length === 1) {
            return output[0];
        }
        else {
            throw `Multiple '${committeeName}' found!`;
        }
    } catch (error) {
        console.log('Something went wrong in GetChoiceColumn!');
        console.error(error);
        return undefined;
    }
};

export const GetListOfActiveCommittees = async (): Promise<any> => {
    // TODO: Remove hard coded content type id.
    return await sp.web.lists.getByTitle(MyLists.CommitteeFiles).items.filter("OData__Status eq 'Active' and ContentTypeId eq '0x0120D52000BD403A8C219D9A40B835B291EFC822540092D9BC58A61C004084D3AAF8347D14E3'").getAll();
};


export const GetLibraryContentTypes = async (libraryTitle: string): Promise<string> => {
    let library = await sp.web.lists.getByTitle(libraryTitle);
    return (await library.contentTypes()).find((f: IContentTypeInfo) => f.Group === "Custom Content Types" && f.StringId.includes('0x0120')).StringId;
};

export const GetMembers = async (): Promise<IMemberListItem[]> => await sp.web.lists.getByTitle(MyLists.Members).items.getAll();

export const GetMember = async (id: number): Promise<any> => await sp.web.lists.getByTitle(MyLists.Members).items.getById(id).get();

/**
 * Get a members term history.
 * @param id MemberID field from the Committee Member History list.
 * @returns ICommitteeMemberHistoryListItem[]
 */
export const GetMembersTermHistory = async (id: number): Promise<ICommitteeMemberHistoryListItem[]> => await sp.web.lists.getByTitle(MyLists.CommitteeMemberHistory).items.filter(`MemberID eq ${id}`).get();

/**
 * TODO: Finish this method. 
 * @returns A list of Committees a member has sat on. 
 */
export const GetMembersCommittees = async (): Promise<any> => {
    return;
};
//#endregion