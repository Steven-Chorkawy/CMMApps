import { Panel, PanelType, Pivot, Dropdown, Separator, PivotItem, Label, Text, ITextProps, Stack, ActionButton, DefaultButton, Breadcrumb, IBreadcrumbItem, Shimmer, IFontStyles, Link, Icon, mergeStyleSets, ActivityItem } from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GetMember, GetMembersTermHistory } from '../ClaringtonHelperMethods/MyHelperMethods';
import { ICommitteeMemberHistoryListItem } from '../ClaringtonInterfaces/ICommitteeMemberHistory';
import IMemberListItem from '../ClaringtonInterfaces/IMemberListItem';
import AddCommitteeMemberForm from './AddCommitteeMemberForm';
import { MyShimmer } from './MyShimmer';
import NewMemberForm from './NewMemberForm';

//#region 
export interface IMemberDetailsComponentProps {
    memberId: number;
    title?: string;      // Title of the component if any are required.
    context: WebPartContext;
}

export interface IMemberDetailsComponentState {
    member: any;
    allTermHistories: ICommitteeMemberHistoryListItem[];    // A list of all the members terms.  All terms from all committees.
    termHistories: ICommitteeMemberHistoryListItem[];       // A list of the members most recent term of each committee.  Only one term per committee.
}

export interface ICommitteeMemberBreadCrumbProps {
    context: WebPartContext;
    committeeTerm: ICommitteeMemberHistoryListItem;
    allTerms?: ICommitteeMemberHistoryListItem[];     // Used to preview past committees.
}

export interface ICommitteeMemberContactDetails {
    member: IMemberListItem;
}

export interface ICommitteeMemberTermHistoryProps {
    memberID: number;
    context: WebPartContext;
}

export interface ICommitteeMemberTermHistoryState {
    allTermHistories: any[];
    termHistories: any[];
}
//#endregion

export class CommitteeMemberBreadCrumb extends React.Component<ICommitteeMemberBreadCrumbProps, any> {
    constructor(props) {
        super(props);
    }

    public render(): React.ReactElement<any> {
        const ID_FILTER = `?=FilterValue72&FilterField1=Member_x0020_Display_x0020_Name_x003a_ID&FilterValue1=${this.props.committeeTerm.MemberID}`;
        const LIBRARY_URL = `${this.props.context.pageContext.web.absoluteUrl}/${this.props.committeeTerm.CommitteeName}`;


        const itemsWithHref: IBreadcrumbItem[] = [
            // Normally each breadcrumb would have a unique href, but to make the navigation less disruptive
            // in the example, it uses the breadcrumb page as the href for all the items
            {
                text: this.props.committeeTerm.CommitteeName, key: 'CommitteeLibrary', href: `${LIBRARY_URL}`,
                // onRender: e => { console.log('IBreadcrumbItem'); console.log(e); return <div>hello world!<div>{ }</div></div>; }
            },
            { text: `${this.props.committeeTerm.CommitteeName}`, key: 'Member', href: `${LIBRARY_URL}${ID_FILTER}`, isCurrentItem: true },
        ];

        const classNames = mergeStyleSets({
            exampleRoot: {
                marginTop: '20px',
            },
            nameText: {
                fontWeight: 'bold',
            },
        });
        const activityItem = {
            key: 1,
            activityDescription: [
                <Link
                    key={1}
                    className={classNames.nameText}
                    onClick={() => {
                        alert('View More Terms...');
                    }}
                >
                    View More Terms...
                </Link>,
                <span key={2}> commented</span>,
            ],
            activityIcon: <Icon iconName={'Add'} />,
            comments: [
                <span key={1}>Hello! I am making a comment and mentioning </span>,
                <Link
                    key={2}
                    className={classNames.nameText}
                    onClick={() => {
                        alert('An @mentioned name was clicked.');
                    }}
                >
                    @Anđela Debeljak
                </Link>,
                <span key={3}> in the text of the comment.</span>,
            ],
            timeStamp: 'Just now',
        };

        return <div>
            <Breadcrumb
                items={itemsWithHref}
                maxDisplayedItems={2}
                ariaLabel="Breadcrumb with items rendered as buttons"
                overflowAriaLabel="More links"
            />
            <div>
                <div>
                    <Text variant={'small'}>
                        <span title={`Start Date`}>{new Date(this.props.committeeTerm.StartDate).toLocaleDateString()}</span> - <span title={`End Date`}>{new Date(this.props.committeeTerm.OData__EndDate).toLocaleDateString()}</span>
                    </Text>
                </div>
                {/* <ActivityItem {...activityItem} key={activityItem.key} className={classNames.exampleRoot} /> */}
            </div>
        </div >;
    }
}

export class CommitteeMemberTermHistory extends React.Component<ICommitteeMemberTermHistoryProps, ICommitteeMemberTermHistoryState>{
    constructor(props) {
        super(props);
        this.state = {
            allTermHistories: undefined,
            termHistories: undefined
        };

        GetMembersTermHistory(this.props.memberID).then(values => {
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

    public render(): React.ReactElement<any> {
        return this.state.termHistories ?
            <div>
                {this.state.termHistories.map(term => {
                    return <div>
                        <CommitteeMemberBreadCrumb
                            committeeTerm={term}
                            allTerms={this.state.allTermHistories}
                            context={this.props.context} />
                    </div>;
                })}
            </div> :
            <MyShimmer />

    }
}

export class CommitteeMemberContactDetails extends React.Component<ICommitteeMemberContactDetails, {}> {
    /**
     *
     */
    constructor(props) {
        super(props);
    }

    private _detailDisplay = (prop, label) => {
        return <div> <span>{label}: {this.props.member[prop] && this.props.member[prop]}</span></div>;
    }

    public render(): React.ReactElement<any> {
        return <div>
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
        </div>;
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
        }
    }



    public render(): React.ReactElement<any> {
        return this.state.member ?
            <div>
                {this.props.title && <Text variant={'xLarge'}>{this.state.member.Salutation} {this.props.title}</Text>}
                <Pivot aria-label="Basic Pivot Example">
                    <PivotItem
                        headerText="Overview"
                        headerButtonProps={{
                            'data-order': 1,
                            'data-title': 'Overview',
                        }}
                    >
                        <CommitteeMemberContactDetails member={this.state.member} />
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
