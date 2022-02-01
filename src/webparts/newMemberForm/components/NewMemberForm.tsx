import * as React from 'react';

import { INewMemberFormProps } from './INewMemberFormProps';
import { Form, FormElement, Field } from '@progress/kendo-react-form';
import { Error } from '@progress/kendo-react-labels';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox } from '@fluentui/react';
import { ActionButton } from 'office-ui-fabric-react';
import { PropertyPaneSlider } from '@microsoft/sp-property-pane';
import { CreateNewMember } from '../../../ClaringtonHelperMethods/MyHelperMethods';

export interface INewMemberFormState {
  showEmail2: boolean;
}

export default class NewMemberForm extends React.Component<INewMemberFormProps, INewMemberFormState> {
  constructor(props) {
    super(props);
    this.state = {
      showEmail2: false,
    };
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
            <h3>Add New Member</h3>
            <hr />
            <Field name={'Member.Salutation'} label={'Salutation'} component={TextField} />
            <Field name={'Member.FirstName'} label={'First Name'} required={true} component={TextField} />
            <Field name={'Member.MiddleName'} label={'Middle Name'} component={TextField} />
            <Field name={'Member.LastName'} label={'Last Name'} required={true} component={TextField} />
            <hr />
            <Field name={'Member.EMail'} label={'Email'} validator={emailValidator} component={EmailInput} />
            {!this.state.showEmail2 && <ActionButton iconProps={{ iconName: "Add" }} onClick={() => this.setState({ showEmail2: true })}>Add Second Email</ActionButton>}
            {this.state.showEmail2 && <Field name={'Member.EMail2'} label={'Email 2'} validator={emailValidator} component={EmailInput} />}

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

            <div style={{ marginTop: "10px" }}>
              <PrimaryButton text='Submit' type="submit" />
              <DefaultButton text='Clear' onClick={e => { formRenderProps.onFormReset(); }} />
            </div>
          </FormElement>
        )}
      />
    </div>);
  }
}
