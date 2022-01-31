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



export const CreateNewMember = async (member: IMemberListItem): Promise<any> => {
    console.log('CreateNewMember');
    member.Title = `${member.FirstName}, ${member.LastName}`;

    // add an item to the list
    let iar = await sp.web.lists.getByTitle(MyLists.Members).items.add(member);

    console.log('iar');
    console.log(iar);

    return iar;
};