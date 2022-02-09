import * as React from 'react';
import * as ReactDOM from "react-dom";

import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker, getTheme, ProgressIndicator, MessageBar, MessageBarType, Separator, Link } from '@fluentui/react';

import { CreateNewCommitteeMember, CreateNewMember, FormatDocumentSetPath, GetChoiceColumn, GetListOfActiveCommittees, OnFormatDate, RenewCommitteeMember } from '../ClaringtonHelperMethods/MyHelperMethods';
import { NewCommitteeMemberFormComponent } from './NewCommitteeMemberFormComponent';
import { MyComboBox, PhoneInput, PostalCodeInput } from './MyFormComponents';

import { Form, FormElement, Field, FieldArray, FieldArrayProps } from '@progress/kendo-react-form';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IRenewMemberSidePanelProps } from './RenewMemberSidePanel';
import { SelectMember } from './SelectMember';

export interface IRenewMemberFormProps extends IRenewMemberSidePanelProps {

}

export default class RenewMemberForm extends React.Component<IRenewMemberFormProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            activeCommittees: []
        };

        GetListOfActiveCommittees().then(value => {
            this.setState({ activeCommittees: value });
        });
    }

    private _onSubmit = values => {
        console.log('Renew Member Form Submit');
        console.log(values);
        RenewCommitteeMember(values);
    }

    public render(): React.ReactElement<IRenewMemberFormProps> {
        return (<div style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '900px' }}>
            <Form
                onSubmit={this._onSubmit}
                initialValues={{
                    Committees: [{
                        CommitteeName: this.props?.context?.pageContext.list.title ? this.props.context?.pageContext.list.title : undefined,
                        Position: undefined,
                        StartDate: undefined,
                        _EndDate: undefined,
                        _Status: undefined
                    }]
                }}
                render={(formRenderProps) => (
                    <FormElement>
                        <h2>Renew Committee Member</h2>
                        <Field
                            name={'Member'}
                            label={'Select Member'}
                            require={true}
                            component={SelectMember}
                            committeeMemberID={this.props.committeeMemberID}
                        />

                        {
                            this.state.activeCommittees.length > 0 &&
                            <FieldArray
                                name={'Committees'}
                                component={NewCommitteeMemberFormComponent}
                                context={this.props.context}
                                activeCommittees={this.state.activeCommittees}
                                formRenderProps={formRenderProps}
                            />
                        }

                        <div style={{ marginTop: "10px" }}>
                            <PrimaryButton
                                text='Submit'
                                type="submit"
                                style={{ margin: '5px' }}
                            />
                            <DefaultButton
                                text='Clear'
                                style={{ margin: '5px' }}
                                onClick={e => {
                                    formRenderProps.onFormReset();
                                }}
                            />
                        </div>
                    </FormElement>
                )}
            />
        </div>);
    }
}
