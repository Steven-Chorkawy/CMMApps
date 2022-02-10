import { Panel, PanelType, Pivot, Dropdown, Separator, PivotItem, Label, Text, ITextProps, Stack, ActionButton, DefaultButton } from '@fluentui/react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GetMember, GetMembersTermHistory } from '../ClaringtonHelperMethods/MyHelperMethods';
import { ICommitteeMemberHistoryListItem } from '../ClaringtonInterfaces/ICommitteeMemberHistory';
import AddCommitteeMemberForm from './AddCommitteeMemberForm';
import { MyShimmer } from './MyShimmer';
import NewMemberForm from './NewMemberForm';

export interface IMemberDetailsComponentProps {
    memberId: number;
    context: WebPartContext;
}

export interface IMemberDetailsComponentState {
    member: any;
    termHistory: ICommitteeMemberHistoryListItem[];
}

export default class MemberDetailsComponent extends React.Component<IMemberDetailsComponentProps, IMemberDetailsComponentState> {
    constructor(props) {
        super(props);

        this.state = {
            member: undefined,
            termHistory: undefined
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
                this.setState({ termHistory: values });
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
                                this.state.termHistory ?
                                    <div>
                                        <ul>
                                            {
                                                this.state.termHistory.map(term => {
                                                    return <li>
                                                        <a href={`${this.props.context.pageContext.web.absoluteUrl}/${term.CommitteeName}`} target='_blank'>{term.CommitteeName}</a>
                                                    </li>;
                                                })
                                            }
                                        </ul>
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
