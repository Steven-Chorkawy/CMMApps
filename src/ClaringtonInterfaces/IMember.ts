export default interface IMember {
    Title: string;
    FirstName: string;      // ! Required.
    MiddleName?: string;
    LastName: string;       // ! Required.
    DisplayName?: string;
    Salutation?: string;
    WorkAddress?: string;
    Birthday: string;       // This is a Date and Time in SharePoint. 
    CellPhone1?: string;
    WorkPhone?: string;
    WorkCity?: string;
    WorkCountry?: string;   // Default to Canada in SharePoint.
    EMail?: string;
    Email2?: string;
    HomePhone?: string;
    PostalCode?: string;
    Province?: string;      // This is a Choice column in SharePoint.
}