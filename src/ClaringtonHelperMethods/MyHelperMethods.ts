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


export const GetChoiceColumn = async (listTitle: string, columnName: string): Promise<string[]> => {
    let choiceColumn: any = await sp.web.lists.getByTitle(listTitle).fields.getByTitle(columnName).select('Choices').get();
    return choiceColumn.Choices;
};

export const CreateNewMember = async (member: IMemberListItem): Promise<any> => {
    console.log('CreateNewMember');
    member.Title = `${member.FirstName}, ${member.LastName}`;
    // add an item to the list
    let iar = await sp.web.lists.getByTitle(MyLists.Members).items.add(member);
    return iar;
};

export const GetListOfActiveCommittees = async (): Promise<any> => {
    // TODO: Remove hard coded content type id.
    return await sp.web.lists.getByTitle(MyLists.CommitteeFiles).items.filter("OData__Status eq 'Active' and ContentTypeId eq '0x0120D52000BD403A8C219D9A40B835B291EFC822540092D9BC58A61C004084D3AAF8347D14E3'").getAll();
};