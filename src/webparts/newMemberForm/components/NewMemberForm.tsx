import * as React from 'react';
import * as ReactDOM from "react-dom";

import { PropertyPaneSlider } from '@microsoft/sp-property-pane';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker } from '@fluentui/react';
import { ActionButton, concatStyleSetsWithProps } from 'office-ui-fabric-react';

import { INewMemberFormProps } from './INewMemberFormProps';
import { CreateNewMember, GetListOfActiveCommittees } from '../../../ClaringtonHelperMethods/MyHelperMethods';
import { NewCommitteeMemberFormComponent, _N } from '../../../ClaringtonComponents/NewCommitteeMemberFormComponent';

import { Error } from '@progress/kendo-react-labels';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { Form, FormElement, Field, FieldArray, FieldArrayProps } from '@progress/kendo-react-form';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import { clone } from '@progress/kendo-react-common';
import { ListView, ListViewHeader } from '@progress/kendo-react-listview';

const FORM_DATA_INDEX = "formDataIndex";

//#region Array List Test
export const WTF_IS_THIS_Context = React.createContext({});

export const _NN = (fieldArrayRenderProps) => {
  const FORM_DATA_INDEX = "formDataIndex";
  const { validationMessage, visited, name, dataItemKey } = fieldArrayRenderProps;
  const [editIndex, setEditIndex] = React.useState(0);
  const editItemCloneRef = React.useRef(); // Add a new item to the Form FieldArray that will be shown in the Grid

  const onAdd = React.useCallback(
    (e) => {
      e.preventDefault();
      fieldArrayRenderProps.onUnshift({
        value: {
          id: "",
          name: "",
        },
      });
      setEditIndex(0);
    },
    [fieldArrayRenderProps]
  ); // Remove a new item to the Form FieldArray that will be removed from the Grid
  const dataWithIndexes = fieldArrayRenderProps.value?.map((item, index) => {
    return { ...item, [FORM_DATA_INDEX]: index };
  });

  const MyFooter = () => {
    return (<ListViewHeader
      style={{
        color: "rgb(160, 160, 160)",
        fontSize: 14,
      }}
      className="pl-3 pb-2 pt-2"
    >
      <ActionButton iconProps={{ iconName: 'Add' }} onClick={onAdd}>Add Committee</ActionButton>
    </ListViewHeader>);
  };

  const NewCommitteeMemberFormItem = (props) => {
    return (
      <div>
        <h5>Hello World!</h5>
        {/* <Field
          name={`Committees[${0}].CommitteeName`}
          label={`Text ${0}`}
          component={ComboBox}
          options={[]}
          // options={fieldArrayRenderProps.activeCommittees.map(value => { return { key: value.Title, text: value.Title }; })}
        /> */}
      </div>
    );
  };

  return (
    <WTF_IS_THIS_Context.Provider value={{
      onAdd,
      editIndex,
      parentField: name
    }}>
      <ListView
        item={NewCommitteeMemberFormItem}
        footer={MyFooter}
        data={dataWithIndexes}
        style={{ width: "100%" }}
      />
    </WTF_IS_THIS_Context.Provider>
  );
}
//#endregion

//#region Array Basic List Text
export const ListViewContext = React.createContext<{
  parentField: string;
  activeCommittees: any[];
}>({} as any);

class TestList extends React.Component<FieldArrayProps> {
  /**
   *
   */
  constructor(props) {
    super(props);
  }
  editItemCloneRef: any = React.createRef();

  state = {
    editIndex: 0,
  };

  // Add a new item to the Form FieldArray that will be shown in the List
  onAdd = (e) => {
    e.preventDefault();
    this.props.onPush({
      value: {
        id: "",
        name: "",
      },
    });
    this.setState({ editIndex: 0 });
  };

  NewCommitteeMemberFormItem = (props) => {
    const lvContext = React.useContext(ListViewContext);

    return (
      <div>
        <h5>Hello World!</h5>
        <Field
          name={`${lvContext.parentField}[${props.dataItem[FORM_DATA_INDEX]}].HardCodeName`}
          label={`Text`}
          component={ComboBox}
          options={lvContext.activeCommittees.map(value => { return { key: value.Title, text: value.Title }; })}
        />
      </div>
    );
  };

  MyFooter = () => {
    return (<ListViewHeader
      style={{
        color: "rgb(160, 160, 160)",
        fontSize: 14,
      }}
      className="pl-3 pb-2 pt-2"
    >
      <ActionButton iconProps={{ iconName: 'Add' }} onClick={this.onAdd}>Add Committee</ActionButton>
    </ListViewHeader>);
  };


  public render() {
    const dataWithIndexes = this.props.value?.map((item, index) => {
      return { ...item, [FORM_DATA_INDEX]: index };
    });
    const { validationMessage, visited, name, dataItemKey } = this.props;

    return (
      <ListViewContext.Provider value={{
        parentField: name,
        activeCommittees: this.props.activeCommittees,
      }}>
        <ListView
          item={this.NewCommitteeMemberFormItem}
          footer={this.MyFooter}
          data={dataWithIndexes}
          style={{ width: "100%" }}
        />
      </ListViewContext.Provider>
    );
  }
}

//#endregion

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


    const _myComboBox = (fieldRenderProps) => {
      const { label, options, value, onChange } = fieldRenderProps;

      return <ComboBox
        label={label}
        options={options}
        onChange={(event, option) => {
          event.preventDefault();
          onChange({ value: option.text });
        }}
      />;
    };

    return (<div>
      <Form
        onSubmit={this._onSubmit}
        initialValues={{ Member: { FirstName: 'a', LastName: 'b' } }}
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
            <Field name={'Member.Email2'} label={'Email 2'} validator={emailValidator} component={EmailInput} />

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
              component={_myComboBox}
              options={[
                { id: 'Alberta', text: 'Alberta' },
                { id: 'British Columbia', text: 'British Columbia' },
                { id: 'Manitoba', text: 'Manitoba' },
                { id: 'New Brunswick', text: 'New Brunswick' },
                { id: 'Newfoundland and Labrador', text: 'Newfoundland and Labrador' },
                { id: 'Northwest Territories', text: 'Northwest Territories' },
                { id: 'Nova Scotia', text: 'Nova Scotia' },
                { id: 'Nunavut', text: 'Nunavut' },
                { id: 'Ontario', text: 'Ontario' },
                { id: 'Prince Edward Island', text: 'Prince Edward Island' },
                { id: 'Quebec', text: 'Quebec' },
                { id: 'Saskatchewan', text: 'Saskatchewan' },
                { id: 'Yukon', text: 'Yukon' }
              ]}
              // onChange={e => {
              //   console.log('field on Change');
              //   console.log(e);
              //   //formRenderProps.onChange('Member.Province', e.value)
              // }}
            />

            <hr />
            <h2>Test List View</h2>
            <FieldArray
              name={'TestList'}
              component={TestList}
              activeCommittees={this.state.activeCommittees}
            />
            <hr />
            <h2>Add "{formRenderProps.valueGetter('Member.FirstName')} {formRenderProps.valueGetter('Member.LastName')}" to Committee</h2>
            {
              // this.state.activeCommittees.length > 0 &&
              // <FieldArray
              //   name={'Committees'}
              //   allowMultiple={true}
              //   component={_N}
              //   dataItemKey={'CommitteeID'}
              //   activeCommittees={this.state.activeCommittees}
              // />
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
