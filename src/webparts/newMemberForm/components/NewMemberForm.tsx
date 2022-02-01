import * as React from 'react';

import { INewMemberFormProps } from './INewMemberFormProps';
import { Form, FormElement, Field, FieldArray } from '@progress/kendo-react-form';
import { Error } from '@progress/kendo-react-labels';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker } from '@fluentui/react';
import { ActionButton } from 'office-ui-fabric-react';
import { PropertyPaneSlider } from '@microsoft/sp-property-pane';
import { CreateNewMember, GetListOfActiveCommittees } from '../../../ClaringtonHelperMethods/MyHelperMethods';
import { NewCommitteeMemberFormComponent } from '../../../ClaringtonComponents/NewCommitteeMemberFormComponent';


export default class NewMemberForm extends React.Component<INewMemberFormProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      activeCommittees: [],
    };

    GetListOfActiveCommittees().then(value => {
      this.setState({ activeCommittees: value });
    });
  }

  private _onSubmit = values => {
    console.log('_onSubmit');
    console.log(values);
    CreateNewMember(values.Member);

    console.log('end of _onSubmit');
  }

  public render(): React.ReactElement<INewMemberFormProps> {

    const emailRegex = new RegExp(/\S+@\S+\.\S+/);
    const emailValidator = (value) => (value === undefined || emailRegex.test(value)) ? "" : "Please enter a valid email.";
    const EmailInput = (fieldRenderProps) => {
      const { validationMessage, visited, ...others } = fieldRenderProps;
      return <TextField {...others} errorMessage={visited && validationMessage && validationMessage} />;
    };

    /**
     * Fluent UI's MaskedTextField is appending one extra character so this component will manually handle the OnChange event. 
     * Any field that uses a MaskedTextField will need to include "onChange={e => formRenderProps.onChange(e.name, e.value)}".
     * @param fieldRenderProps Kendo UI Field Render Props from form.
     * @returns MaskedTextField element.
     */
    function MyMaskedInput(fieldRenderProps) {
      return <MaskedTextField
        {...fieldRenderProps}
        onChange={(event, newValue) => {
          fieldRenderProps.onChange({
            name: fieldRenderProps.name,
            value: { value: newValue }
          });
        }}
      />;
    }

    const PhoneInput = (fieldRenderProps) => {
      return <MyMaskedInput {...fieldRenderProps} mask="(999) 999-9999" />;
    };

    const PostalCodeInput = (fieldRenderProps) => {
      return <MyMaskedInput {...fieldRenderProps} mask="a9a 9a9" />;
    };

    return (<div>
      <Form
        onSubmit={this._onSubmit}
        render={(formRenderProps) => (
          <FormElement>
            <h2>Add New Member</h2>
            <hr />
            <Field name={'Member.Salutation'} label={'Salutation'} component={TextField} />
            <Field name={'Member.FirstName'} label={'First Name'} required={true} component={TextField} />
            <Field name={'Member.MiddleName'} label={'Middle Name'} component={TextField} />
            <Field name={'Member.LastName'} label={'Last Name'} required={true} component={TextField} />
            <Field name={'Member.Birthday'} label={'Date of Birth'} component={DatePicker} />
            <hr />
            <Field name={'Member.EMail'} label={'Email'} validator={emailValidator} component={EmailInput} />
            <Field name={'Member.EMail2'} label={'Email 2'} validator={emailValidator} component={EmailInput} />

            <Field name={'Member.CellPhone1'} label={'Cell Phone'} component={PhoneInput} onChange={e => formRenderProps.onChange(e.name, e.value)} />
            <Field name={'Member.WorkPhone'} label={'Work Phone'} component={PhoneInput} onChange={e => formRenderProps.onChange(e.name, e.value)} />
            <Field name={'Member.HomePhone'} label={'Home Phone'} component={PhoneInput} onChange={e => formRenderProps.onChange(e.name, e.value)} />

            <hr />
            <Field name={'Member.WorkAddress'} label={'Street Address'} component={TextField} />
            <Field name={'Member.WorkCity'} label={'City'} component={TextField} />
            <Field name={'Member.PostalCode'} label={'Postal Code'} component={PostalCodeInput} onChange={e => formRenderProps.onChange(e.name, e.value)} />
            {/** !!! TODO: Get these values from SharePoint, not hard coded.  */}
            <Field name={'Member.Province'}
              label={'Province'}
              component={ComboBox}
              options={[
                { key: 'Alberta', text: 'Alberta' },
                { key: 'British Columbia', text: 'British Columbia' },
                { key: 'Manitoba', text: 'Manitoba' },
                { key: 'New Brunswick', text: 'New Brunswick' },
                { key: 'Newfoundland and Labrador', text: 'Newfoundland and Labrador' },
                { key: 'Northwest Territories', text: 'Northwest Territories' },
                { key: 'Nova Scotia', text: 'Nova Scotia' },
                { key: 'Nunavut', text: 'Nunavut' },
                { key: 'Ontario', text: 'Ontario' },
                { key: 'Prince Edward Island', text: 'Prince Edward Island' },
                { key: 'Quebec', text: 'Quebec' },
                { key: 'Saskatchewan', text: 'Saskatchewan' },
                { key: 'Yukon', text: 'Yukon' }
              ]} />

            <hr />
            <h2>Add "{formRenderProps.valueGetter('Member.FirstName')} {formRenderProps.valueGetter('Member.LastName')}" to Committee</h2>
            {
              this.state.activeCommittees.length > 0 &&
              <FieldArray
                name={'Committees'}
                allowMultiple={true}
                component={NewCommitteeMemberFormComponent}
                dataItemKey={'CommitteeID'}
                activeCommittees={this.state.activeCommittees}
              />
            }
            <hr />
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
