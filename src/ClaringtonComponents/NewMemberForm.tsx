import * as React from 'react';
import * as ReactDOM from "react-dom";

import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker, getTheme, ProgressIndicator, MessageBar, MessageBarType, Separator, Link } from '@fluentui/react';

import { CreateNewCommitteeMember, CreateNewMember, FormatDocumentSetPath, GetChoiceColumn, GetListOfActiveCommittees, OnFormatDate } from '../ClaringtonHelperMethods/MyHelperMethods';
import { NewCommitteeMemberFormComponent } from './NewCommitteeMemberFormComponent';
import { MyComboBox, PhoneInput, PostalCodeInput } from './MyFormComponents';

import { Form, FormElement, Field, FieldArray, FieldArrayProps } from '@progress/kendo-react-form';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export enum NewMemberFormSaveStatus {
  NewForm = -1,
  CreatingNewMember = 0,
  AddingMemberToCommittee = 1,
  Success = 2,
  Error = 3
}

export interface INewMemberFormProps {
  description: string;
  context: WebPartContext;
}

export interface INewMemberFormState {
  activeCommittees: any[];
  provinces: any[];
  saveStatus: NewMemberFormSaveStatus;
  linkToCommitteeDocSet: any[];
}

export default class NewMemberForm extends React.Component<INewMemberFormProps, INewMemberFormState> {
  constructor(props) {
    super(props);
    this.state = {
      activeCommittees: [],
      provinces: [],
      saveStatus: NewMemberFormSaveStatus.NewForm,
      linkToCommitteeDocSet: []
    };

    GetListOfActiveCommittees().then(value => {
      this.setState({ activeCommittees: value });
    });

    GetChoiceColumn('Members', 'Province').then(value => {
      this.setState({ provinces: value });
    });
  }

  private _onSubmit = async (values) => {
    try {
      this.setState({ saveStatus: NewMemberFormSaveStatus.CreatingNewMember });
      // Step 1: Create a new Member List Item.
      let newMemberItemAddResult = await CreateNewMember(values.Member);

      // Step 2: Add the new member to committees if any are provided. 
      if (values.Committees) {
        for (let committeeIndex = 0; committeeIndex < values.Committees.length; committeeIndex++) {
          await CreateNewCommitteeMember(newMemberItemAddResult.data.ID, values.Committees[committeeIndex]);
          let linkToDocSet = await FormatDocumentSetPath(values.Committees[committeeIndex].CommitteeName, newMemberItemAddResult.data.Title);
          this.setState({
            saveStatus: NewMemberFormSaveStatus.AddingMemberToCommittee,
            linkToCommitteeDocSet: [
              ...this.state.linkToCommitteeDocSet,
              {
                CommitteeName: values.Committees[committeeIndex].CommitteeName,
                MemberName: newMemberItemAddResult.data.Title,
                Link: linkToDocSet
              }
            ]
          });
        }
      }

      this.setState({ saveStatus: NewMemberFormSaveStatus.Success });
    } catch (error) {
      console.log("Something went wrong while saving new member!");
      console.error(error);
      this.setState({ saveStatus: NewMemberFormSaveStatus.Error });
    }
  }

  public render(): React.ReactElement<INewMemberFormProps> {

    const emailRegex = new RegExp(/\S+@\S+\.\S+/);
    const emailValidator = (value) => (value === undefined || emailRegex.test(value)) ? "" : "Please enter a valid email.";
    const EmailInput = (fieldRenderProps) => {
      const { validationMessage, visited, ...others } = fieldRenderProps;
      return <TextField {...others} errorMessage={visited && validationMessage && validationMessage} />;
    };

    const reactTheme = getTheme();

    const initialValues = this.props?.context?.pageContext?.list?.title ? {
      Committees: [{
        CommitteeName: this.props.context?.pageContext.list.title,
        Position: undefined,
        StartDate: undefined,
        _EndDate: undefined,
        _Status: undefined
      }]
    } : undefined;

    return (<div style={{ marginLeft: 'auto', marginRight: 'auto', maxWidth: '900px' }}>
      <Form
        onSubmit={this._onSubmit}
        initialValues={initialValues}
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
            {
              (this.state.saveStatus === NewMemberFormSaveStatus.CreatingNewMember || this.state.saveStatus === NewMemberFormSaveStatus.AddingMemberToCommittee) &&
              <div style={{ marginTop: '20px' }}>
                <ProgressIndicator
                  label="Saving New Committee Member..."
                  description={<div>
                    {this.state.saveStatus === NewMemberFormSaveStatus.CreatingNewMember && "Saving Member Contact Information..."}
                    {this.state.saveStatus === NewMemberFormSaveStatus.AddingMemberToCommittee && "Adding Member to Committee..."}
                  </div>}
                />
              </div>
            }
            {
              (this.state.saveStatus === NewMemberFormSaveStatus.Success) &&
              <MessageBar messageBarType={MessageBarType.success} isMultiline={true}>
                <div>
                  Success! New Committee Member has been saved.
                  {
                    this.state.linkToCommitteeDocSet.map(l => {
                      return <div>
                        <Separator />
                        <Link href={`${l.Link}`} target="_blank" underline>Click to View: {l.MemberName} - {l.CommitteeName}</Link>
                      </div>;
                    })
                  }
                </div>
              </MessageBar>
            }
            {
              (this.state.saveStatus === NewMemberFormSaveStatus.Error) &&
              <MessageBar messageBarType={MessageBarType.error}>
                Something went wrong!  Cannot save new Committee Member.
              </MessageBar>
            }
            <div style={{ marginTop: "10px" }}>
              <PrimaryButton
                text='Submit'
                type="submit"
                style={{ margin: '5px' }}
                disabled={(this.state.saveStatus === NewMemberFormSaveStatus.Success || this.state.saveStatus === NewMemberFormSaveStatus.Error)}
              />
              <DefaultButton
                text='Clear'
                style={{ margin: '5px' }}
                onClick={e => {
                  formRenderProps.onFormReset();
                  this.setState({ saveStatus: NewMemberFormSaveStatus.NewForm, linkToCommitteeDocSet: [] });
                }}
              />
            </div>
          </FormElement>
        )}
      />
    </div>);
  }
}
