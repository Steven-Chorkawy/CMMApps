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
 * Calculate a term end date.
 * Term End Date = start date + Term Length.
 */
export const CalculateTermEndDate = (startDate: Date, termLength: number): Date => {
    return new Date(startDate.getFullYear() + termLength, startDate.getMonth(), startDate.getDate());
};

//#endregion

//#region Create
export const CreateNewMember = async (member: IMemberListItem): Promise<any> => {
    console.log('CreateNewMember');
    member.Title = `${member.FirstName}, ${member.LastName}`;
    // add an item to the list
    let iar = await sp.web.lists.getByTitle(MyLists.Members).items.add(member);
    return iar;
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

export const GetMembers = async (): Promise<IMemberListItem[]> => await sp.web.lists.getByTitle(MyLists.Members).items.getAll();


/**
 * TODO: Finish this method. 
 * @returns A list of Committees a member has sat on. 
 */
export const GetMembersCommittees = async (): Promise<any> => {
    return;
}
//#endregion