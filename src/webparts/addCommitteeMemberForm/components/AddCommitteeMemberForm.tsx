import * as React from 'react';
import { IAddCommitteeMemberFormProps } from './IAddCommitteeMemberFormProps';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker, getTheme, Separator } from '@fluentui/react';
import { Form, FormElement, Field, FieldArray, FieldArrayProps } from '@progress/kendo-react-form';
import { SelectMember } from '../../../ClaringtonComponents/SelectMember';
import { NewCommitteeMemberFormComponent } from '../../../ClaringtonComponents/NewCommitteeMemberFormComponent';
import { CreateNewCommitteeMember, GetListOfActiveCommittees } from '../../../ClaringtonHelperMethods/MyHelperMethods';


export interface IAddCommitteeMemberFormState {
  activeCommittees: [];
}

export default class AddCommitteeMemberForm extends React.Component<IAddCommitteeMemberFormProps, IAddCommitteeMemberFormState> {

  constructor(props) {
    super(props);
    this.state = {
      activeCommittees: []
    };

    GetListOfActiveCommittees().then(value => {
      this.setState({ activeCommittees: value });
    });
  }


  private _onSubmit = async (values) => {
    if (values.Committees && values.Member) {
      for (let committeeIndex = 0; committeeIndex < values.Committees.length; committeeIndex++) {
        await CreateNewCommitteeMember(values.Member.ID, values.Committees[committeeIndex]);
      }

      alert('Done!');
    }
  }

  public render(): React.ReactElement<IAddCommitteeMemberFormProps> {

    return (<div>
      <Form
        onSubmit={this._onSubmit}
        initialValues={{
          Committees: [{
            CommitteeName: undefined,
            Position: undefined,
            StartDate: undefined,
            _EndDate: undefined,
            _Status: undefined
          }]
        }}
        render={formRenderProps => (
          <FormElement>
            <h2 style={{ margin: '0' }}>Add Member to Committee</h2>
            <Separator />
            <Field
              name={'Member'}
              label={'Select Member'}
              require={true}
              component={SelectMember}
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
              <PrimaryButton text='Submit' type="submit" style={{ margin: '5px' }} />
              <DefaultButton text='Clear' style={{ margin: '5px' }} onClick={e => { formRenderProps.onFormReset(); }} />
            </div>
          </FormElement>
        )
        }
      />
    </div >);
  }
}
