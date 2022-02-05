import * as React from 'react';

import { Form, FormElement, Field, FormRenderProps, FieldArrayRenderProps, FieldArrayProps } from '@progress/kendo-react-form';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';
import { FileTypeIcon, ApplicationType, IconType, ImageSize } from "@pnp/spfx-controls-react/lib/FileTypeIcon";


import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker, Calendar, getTheme } from '@fluentui/react';
import { ActionButton, IconButton } from 'office-ui-fabric-react';
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
}

export class SelectMember extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {
            members: undefined,
        };

        GetMembers().then(members => {
            console.log('members');
            console.log(members);
            this.setState({ members: members });
        });
    }

    public render() {
        const reactTheme = getTheme();

        return (
            this.state.members ?
                <div style={{ padding: '10px', marginBottom: '10px', boxShadow: reactTheme.effects.elevation16 }}>
                    <ComboBox
                        label={this.props.label}
                        options={this.state.members.map((member: IMemberListItem) => {
                            return { key: member.Title, text: member.Title, data: { ...member } };
                        })}
                        onChange={(event, option) => {
                            event.preventDefault();
                            // ! This calls the fields onChange event which in turn passes the new selected value to the form state.
                            this.props.onChange({ value: { ...option.data } });
                        }}
                        required={true}
                    />
                </div>
                : <div>
                    <MyShimmer />
                </div>
        );
    }
}