import * as React from 'react';
import * as ReactDOM from "react-dom";

import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker, getTheme } from '@fluentui/react';

import { INewMemberFormProps } from './INewMemberFormProps';
import { CreateNewMember, GetChoiceColumn, GetListOfActiveCommittees, OnFormatDate } from '../../../ClaringtonHelperMethods/MyHelperMethods';
import { NewCommitteeMemberFormComponent } from '../../../ClaringtonComponents/NewCommitteeMemberFormComponent';
import { MyComboBox, PhoneInput, PostalCodeInput } from '../../../ClaringtonComponents/MyFormComponents';

import { Form, FormElement, Field, FieldArray, FieldArrayProps } from '@progress/kendo-react-form';

export default class NewMemberForm extends React.Component<INewMemberFormProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      activeCommittees: [],
      provinces: []
    };

    GetListOfActiveCommittees().then(value => {
      this.setState({ activeCommittees: value });
    });

    GetChoiceColumn('Members', 'Province').then(value => {
      this.setState({ provinces: value });
    });
  }

  private _onSubmit = values => {
    console.log('_onSubmit');
    console.log(values);
    // TODO: Uncomment this when I am done testing.
    //CreateNewMember(values.Member);

    console.log('end of _onSubmit');
  }

  public render(): React.ReactElement<INewMemberFormProps> {

    const emailRegex = new RegExp(/\S+@\S+\.\S+/);
    const emailValidator = (value) => (value === undefined || emailRegex.test(value)) ? "" : "Please enter a valid email.";
    const EmailInput = (fieldRenderProps) => {
      const { validationMessage, visited, ...others } = fieldRenderProps;
      return <TextField {...others} errorMessage={visited && validationMessage && validationMessage} />;
    };
    const reactTheme = getTheme();

    return (<div>
      <Form
        onSubmit={this._onSubmit}
        initialValues={{ Member: { FirstName: 'a', LastName: 'b' } }}
        render={(formRenderProps) => (
          <FormElement>
            <h2>Add New Member</h2>
            <div style={{ padding: '10px', marginBottom: '10px', boxShadow: reactTheme.effects.elevation16 }}>
              <Field name={'Member.Salutation'} label={'Salutation'} component={TextField} />
              <Field name={'Member.FirstName'} label={'First Name'} required={true} component={TextField} />
              <Field name={'Member.MiddleName'} label={'Middle Name'} component={TextField} />
              <Field name={'Member.LastName'} label={'Last Name'} required={true} component={TextField} />
              <Field name={'Member.Birthday'} label={'Date of Birth'} component={DatePicker} formatDate={OnFormatDate} />

              <Field name={'Member.EMail'} label={'Email'} validator={emailValidator} component={EmailInput} />
              <Field name={'Member.Email2'} label={'Email 2'} validator={emailValidator} component={EmailInput} />

              <Field name={'Member.CellPhone1'} label={'Cell Phone'} component={PhoneInput} onChange={e => formRenderProps.onChange(e.name, e.value)} />
              <Field name={'Member.WorkPhone'} label={'Work Phone'} component={PhoneInput} onChange={e => formRenderProps.onChange(e.name, e.value)} />
              <Field name={'Member.HomePhone'} label={'Home Phone'} component={PhoneInput} onChange={e => formRenderProps.onChange(e.name, e.value)} />


              <Field name={'Member.WorkAddress'} label={'Street Address'} component={TextField} />
              <Field name={'Member.WorkCity'} label={'City'} component={TextField} />
              <Field name={'Member.PostalCode'} label={'Postal Code'} component={PostalCodeInput} onChange={e => formRenderProps.onChange(e.name, e.value)} />
              {/** !!! TODO: Get these values from SharePoint, not hard coded.  */}
              <Field name={'Member.Province'}
                label={'Province'}
                component={MyComboBox}
                options={this.state.provinces ? this.state.provinces.map(f => { return { key: f, text: f }; }) : []}
              />
            </div>


            <h2>Add "{formRenderProps.valueGetter('Member.FirstName')} {formRenderProps.valueGetter('Member.LastName')}" to Committee</h2>
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
              <PrimaryButton text='Submit' type="submit" style={{ margin: '5px' }} />
              <DefaultButton text='Clear' style={{ margin: '5px' }} onClick={e => { formRenderProps.onFormReset(); }} />
            </div>
          </FormElement>
        )}
      />
    </div>);
  }
}
