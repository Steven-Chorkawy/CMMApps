export interface IMyTempLookup {
    Id: number;
    Title: string;
}

/**
 * Committee Member History list item record.
 */
export interface ICommitteeMemberHistoryListItem extends ICommitteeMemberHistory_NewListItem {
    ID: number;
    Id: number;
    DisplayName: string;
}

/**
 * A new Committee Member History list item record.
 */
export interface ICommitteeMemberHistory_NewListItem {
    CommitteeName: string;
    OData__EndDate: string;
    StartDate: string;
    FirstName: string;
    LastName: string;
    SPFX_CommitteeMemberDisplayNameId: number;
    MemberID: number;
    Title: string;
}

