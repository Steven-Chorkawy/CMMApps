import * as React from 'react';

import { Form, FormElement, Field, FormRenderProps, FieldArrayRenderProps, FieldArrayProps } from '@progress/kendo-react-form';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { FileTypeIcon, ApplicationType, IconType, ImageSize } from "@pnp/spfx-controls-react/lib/FileTypeIcon";


import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker, Calendar, getTheme, Stack, DefaultPalette, Icon, Label } from '@fluentui/react';
import { ActionButton, IconButton, Separator } from 'office-ui-fabric-react';
import { ListView, ListViewHeader, ListViewItemProps } from '@progress/kendo-react-listview';
import { MyComboBox, MyDatePicker } from './MyFormComponents';
import { CalculateTermEndDate, FORM_DATA_INDEX, GetChoiceColumn, GetCommitteeByName, GetMembers, OnFormatDate } from '../ClaringtonHelperMethods/MyHelperMethods';
import ICommitteeFileItem from '../ClaringtonInterfaces/ICommitteeFileItem';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import IMemberListItem from '../ClaringtonInterfaces/IMemberListItem';
import { MyShimmer } from './MyShimmer';


export interface ISelectMemberState {
    members: IMemberListItem[];
    selectedMember: IMemberListItem;
}

export class SelectMember extends React.Component<any, ISelectMemberState> {

    constructor(props) {
        super(props);
        this.state = {
            members: undefined,
            selectedMember: undefined
        };

        GetMembers().then(members => {
            this.setState({ members: members });
            if (this.props.committeeMemberID) {
                this._onComboBoxChange(null, {
                    data: { ...members.find(f => f.ID === this.props.committeeMemberID) }
                });
            }
        });
    }

    private _onComboBoxChange = (event, option) => {
        debugger;
        if (event) {
            event.preventDefault();
        }
        console.log('_onComboBoxChange');
        console.log(option.data);
        // ! This calls the fields onChange event which in turn passes the new selected value to the form state.
        this.props.onChange({ value: { ...option.data } });
        this.setState({ selectedMember: option.data });
    }

    public render() {
        const reactTheme = getTheme();

        // Tokens definition
        const stackTokens = {
            childrenGap: 50,
            padding: 10,
        };

        const contactInfoLabelStyles = {
            marginLeft: '5px',
        };

        const stackStyle = {
            marginBottom: '10px',
        };

        return (
            this.state.members ?
                <div style={{ padding: '10px', marginBottom: '10px', boxShadow: reactTheme.effects.elevation16 }}>
                    <Stack horizontal tokens={stackTokens}>
                        <Stack.Item grow={5}>
                            <ComboBox
                                label={this.props.label}
                                options={this.state.members.map((member: IMemberListItem) => {
                                    return { key: member.ID, text: member.Title, data: { ...member } };
                                })}
                                onChange={this._onComboBoxChange}
                                defaultSelectedKey={this.props.committeeMemberID ? this.props.committeeMemberID : undefined}
                                required={true}
                            />
                            <Separator />
                            {
                                this.state.selectedMember &&
                                <div>
                                    <Stack style={stackStyle}>
                                        <Stack.Item grow={3}>
                                            <span><Icon iconName='Mail' ariaLabel='EMail' title='EMail' />EMail:</span><span style={contactInfoLabelStyles}>{this.state.selectedMember.EMail}</span>
                                        </Stack.Item>
                                        <Stack.Item grow={3}>
                                            <span><Icon iconName='Mail' />EMail:</span><span style={contactInfoLabelStyles}>{this.state.selectedMember.Email2}</span>
                                        </Stack.Item>
                                    </Stack>
                                    <Stack style={stackStyle}>
                                        {this.state.selectedMember.HomePhone &&
                                            <Stack.Item grow={2}>
                                                <span><Icon iconName='Phone' />Home Phone:</span><span style={contactInfoLabelStyles}>{this.state.selectedMember.HomePhone}</span>
                                            </Stack.Item>
                                        }
                                        {this.state.selectedMember.CellPhone1 &&
                                            <Stack.Item grow={2}>
                                                <span><Icon iconName='Phone' />Cell Phone:</span><span style={contactInfoLabelStyles}>{this.state.selectedMember.CellPhone1}</span>
                                            </Stack.Item>
                                        }
                                        {this.state.selectedMember.WorkPhone &&
                                            <Stack.Item grow={2}>
                                                <span><Icon iconName='Phone' />Work Phone:</span><span style={contactInfoLabelStyles}>{this.state.selectedMember.WorkPhone}</span>
                                            </Stack.Item>
                                        }
                                    </Stack>
                                    <Stack style={stackStyle} horizontal>
                                        <Stack.Item grow={3} align="center">{this.state.selectedMember.WorkAddress}</Stack.Item>
                                        <Stack.Item grow={3} align="center">{this.state.selectedMember.PostalCode}</Stack.Item>
                                        <Stack.Item grow={3} align="center">{this.state.selectedMember.WorkCity}</Stack.Item>
                                        <Stack.Item grow={3} align="center">{this.state.selectedMember.Province}</Stack.Item>
                                    </Stack>
                                </div>
                            }
                        </Stack.Item>
                        <Stack.Item grow={1}>
                            <h4>Current Committees</h4>
                            <div>
                                <MyShimmer />
                                <MyShimmer />
                                <MyShimmer />
                            </div>
                        </Stack.Item>
                    </Stack>

                </div >
                : <div>
                    <MyShimmer />
                </div>
        );
    }
}