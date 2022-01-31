export default interface IMemberListItem {
    Title: string;
    FirstName: string;      // ! Required.
    MiddleName?: string;
    LastName: string;       // ! Required.
    DisplayName?: string;
    Salutation?: string;

    EMail?: string;
    Email2?: string;
    CellPhone1?: string;
    WorkPhone?: string;
    HomePhone?: string;

    WorkAddress?: string;
    Birthday: string;       // This is a Date and Time in SharePoint. 
    WorkCity?: string;
    WorkCountry?: string;   // Default to Canada in SharePoint.
    PostalCode?: string;
    Province?: string;      // This is a Choice column in SharePoint.
}