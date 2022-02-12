import { Panel, PanelType, Pivot, Dropdown, Separator, PivotItem, Label, Text, ITextProps, Stack, ActionButton, DefaultButton, Breadcrumb, IBreadcrumbItem, Shimmer } from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GetMember, GetMembersTermHistory } from '../ClaringtonHelperMethods/MyHelperMethods';
import { ICommitteeMemberHistoryListItem } from '../ClaringtonInterfaces/ICommitteeMemberHistory';
import AddCommitteeMemberForm from './AddCommitteeMemberForm';
import { MyShimmer } from './MyShimmer';
import NewMemberForm from './NewMemberForm';

//#region 
export interface IMemberDetailsComponentProps {
    memberId: number;
    context: WebPartContext;
}

export interface IMemberDetailsComponentState {
    member: any;
    allTermHistories: ICommitteeMemberHistoryListItem[];    // A list of all the members terms.  All terms from all committees.
    termHistories: ICommitteeMemberHistoryListItem[];       // A list of the members most recent term of each committee.  Only one term per committee.
}

export interface ICommitteeMemberBreadCrumbProps {
    committeeName: string; // Name of a library. 
    memberId: number;
    memberName: string;
    context: WebPartContext;
}
//#endregion

export class CommitteeMemberBreadCrumb extends React.Component<ICommitteeMemberBreadCrumbProps, any> {
    constructor(props) {
        super(props);
    }

    public render(): React.ReactElement<any> {
        const ID_FILTER = `?=FilterValue72&FilterField1=Member_x0020_Display_x0020_Name_x003a_ID&FilterValue1=${this.props.memberId}`;
        const LIBRARY_URL = `${this.props.context.pageContext.web.absoluteUrl}/${this.props.committeeName}`;


        const itemsWithHref: IBreadcrumbItem[] = [
            // Normally each breadcrumb would have a unique href, but to make the navigation less disruptive
            // in the example, it uses the breadcrumb page as the href for all the items
            {
                text: this.props.committeeName, key: 'CommitteeLibrary', href: `${LIBRARY_URL}`,
                // onRender: e => { console.log('IBreadcrumbItem'); console.log(e); return <div>hello world!</div>; }
            },
            { text: `${this.props.memberName}`, key: 'Member', href: `${LIBRARY_URL}${ID_FILTER}`, isCurrentItem: true },
        ];




        return <div>
            <Breadcrumb
                items={itemsWithHref}
                maxDisplayedItems={2}
                ariaLabel="Breadcrumb with items rendered as buttons"
                overflowAriaLabel="More links"
            />
        </div >;
    }
}

export default class MemberDetailsComponent extends React.Component<IMemberDetailsComponentProps, IMemberDetailsComponentState> {
    constructor(props) {
        super(props);

        this.state = {
            member: undefined,
            termHistories: undefined,
            allTermHistories: undefined
        };

        if (this.props.memberId) {
            GetMember(this.props.memberId).then(value => {
                console.log('GetMember');
                console.log(value);
                this.setState({ member: value });
            });

            GetMembersTermHistory(this.props.memberId).then(values => {
                console.log('GetMembersTermHistory results');
                console.log(values);
                this.setState({
                    allTermHistories: values,
                    termHistories: values.filter((value, index, self) => index === self.sort((a, b) => {
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        let bb: any = new Date(b.StartDate), aa: any = new Date(b.StartDate);
                        return bb - aa;
                    }).findIndex((t) => (t.CommitteeName === value.CommitteeName)))
                });
            });
        }
    }

    private _detailDisplay = (prop, label) => {
        return <div> <span>{label}: {this.state.member[prop] && this.state.member[prop]}</span></div>;
    }

    public render(): React.ReactElement<any> {
        return this.state.member ?
            <div>
                <Text variant={'xLarge'}>{this.state.member.Salutation} {this.state.member.Title}</Text>
                <Pivot aria-label="Basic Pivot Example">
                    <PivotItem
                        headerText="Overview"
                        headerButtonProps={{
                            'data-order': 1,
                            'data-title': 'Overview',
                        }}
                    >
                        <div>
                            <h3>Contact Information</h3>
                            <Stack horizontal={true} wrap={true}>
                                <Stack.Item grow={6}>
                                    {this._detailDisplay('EMail', 'Email')}
                                    {this._detailDisplay('EMail2', 'Email')}
                                    {this._detailDisplay('CellPhone1', 'Cell Phone')}
                                    {this._detailDisplay('HomePhone', 'Home Phone')}
                                    {this._detailDisplay('WorkPhone', 'Work Phone')}
                                </Stack.Item>
                                <Stack.Item grow={6}>
                                    {this._detailDisplay('Address', 'Address')}
                                    {this._detailDisplay('PostalCode', 'Postal Code')}
                                    {this._detailDisplay('City', 'City')}
                                </Stack.Item>
                            </Stack>
                        </div>

                        <div>
                            <h3>Committees</h3>
                            {
                                this.state.termHistories ?
                                    <div>
                                        {this.state.termHistories.map(term => {
                                            return <div>
                                                <CommitteeMemberBreadCrumb
                                                    committeeName={term.CommitteeName}
                                                    memberId={term.MemberID}
                                                    memberName={`${term.LastName}, ${term.FirstName}`}
                                                    context={this.props.context} />
                                            </div>;
                                        })}
                                    </div> :
                                    <MyShimmer />
                            }
                        </div>
                    </PivotItem>
                    <PivotItem headerText="Recent">
                        <span>Pivot #2</span>
                    </PivotItem>
                    <PivotItem headerText="Shared with me">
                        <span>Pivot #3</span>
                    </PivotItem>
                </Pivot>
            </div> :
            <div>
                <MyShimmer />
                <MyShimmer />
                <MyShimmer />
            </div>;
    }
}
