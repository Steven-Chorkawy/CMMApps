import * as React from 'react';
import { IAddCommitteeMemberFormProps } from './IAddCommitteeMemberFormProps';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker, getTheme, Separator } from '@fluentui/react';
import { Form, FormElement, Field, FieldArray, FieldArrayProps } from '@progress/kendo-react-form';
import { SelectMember } from '../../../ClaringtonComponents/SelectMember';


export default class AddCommitteeMemberForm extends React.Component<IAddCommitteeMemberFormProps, {}> {
  public render(): React.ReactElement<IAddCommitteeMemberFormProps> {

    return (<div>
      <Form
        onSubmit={e => { console.log(e); }}
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

          </FormElement>
        )
        }
      />
    </div >);
  }
}
