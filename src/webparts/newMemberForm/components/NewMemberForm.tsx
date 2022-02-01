import * as React from 'react';
import * as ReactDOM from "react-dom";

import { PropertyPaneSlider } from '@microsoft/sp-property-pane';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker } from '@fluentui/react';
import { ActionButton } from 'office-ui-fabric-react';

import { INewMemberFormProps } from './INewMemberFormProps';
import { CreateNewMember, GetListOfActiveCommittees } from '../../../ClaringtonHelperMethods/MyHelperMethods';
import { NewCommitteeMemberFormComponent, _N } from '../../../ClaringtonComponents/NewCommitteeMemberFormComponent';

import { Error } from '@progress/kendo-react-labels';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { Form, FormElement, Field, FieldArray } from '@progress/kendo-react-form';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import { clone } from '@progress/kendo-react-common';
import { ListView, ListViewHeader } from '@progress/kendo-react-listview';


//#region Array Grid Test
const FORM_DATA_INDEX = "formDataIndex";

const requiredValidator = (value) => (value ? "" : "The field is required");

const DisplayValue = (fieldRenderProps) => {
  return <>{fieldRenderProps.value}</>;
};

const TextInputWithValidation = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

const minValidator = (value) => (value >= 0 ? "" : "Minimum units 0");

const NumericTextBoxWithValidation = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  const anchor = React.useRef(null);
  return (
    <div>
      <NumericTextBox {...others} ref={anchor} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};

export const NumberCell = (props) => {
  const { parentField, editIndex }: any = React.useContext(FormGridEditContext);
  const isInEdit = props.dataItem[FORM_DATA_INDEX] === editIndex;
  return (
    <td>
      <Field
        component={isInEdit ? NumericTextBoxWithValidation : DisplayValue}
        name={`${parentField}[${props.dataItem[FORM_DATA_INDEX]}].${props.field}`}
        validator={minValidator}
      />
    </td>
  );
};
export const NameCell = (props) => {
  const { parentField, editIndex }: any = React.useContext(FormGridEditContext);
  const isInEdit = props.dataItem[FORM_DATA_INDEX] === editIndex;
  return (
    <td>
      <Field
        component={isInEdit ? TextInputWithValidation : DisplayValue}
        name={`${parentField}[${props.dataItem[FORM_DATA_INDEX]}].${props.field}`}
        validator={requiredValidator}
      />
    </td>
  );
};

const arrayLengthValidator = (value) =>
  value && value.length ? "" : "Please add at least one record."; // Create React.Context to pass props to the Form Field components from the main component

export const FormGridEditContext = React.createContext({});
const DATA_ITEM_KEY = "ProductID"; // Add a command cell to Edit, Update, Cancel and Delete an item

const CommandCell = (props) => {
  const { onRemove, onEdit, onSave, onCancel, editIndex }: any = React.useContext(FormGridEditContext);
  const isInEdit = props.dataItem[FORM_DATA_INDEX] === editIndex;
  const isNewItem = !props.dataItem[DATA_ITEM_KEY];
  const onRemoveClick = React.useCallback(
    (e) => {
      e.preventDefault();
      onRemove(props.dataItem);
    },
    [props.dataItem, onRemove]
  );
  const onEditClick = React.useCallback(
    (e) => {
      e.preventDefault();
      onEdit(props.dataItem, isNewItem);
    },
    [props.dataItem, onEdit, isNewItem]
  );
  const onSaveClick = React.useCallback(
    (e) => {
      e.preventDefault();
      onSave();
    },
    [onSave]
  );
  const onCancelClick = React.useCallback(
    (e) => {
      e.preventDefault();
      onCancel();
    },
    [onCancel]
  );
  return isInEdit ? (
    <td className="k-command-cell">
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-save-command"
        onClick={onSaveClick}
      >
        {isNewItem ? "Add" : "Update"}
      </button>
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command"
        onClick={isNewItem ? onRemoveClick : onCancelClick}
      >
        {isNewItem ? "Discard" : "Cancel"}
      </button>
    </td>
  ) : (
    <td className="k-command-cell">
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary k-grid-edit-command"
        onClick={onEditClick}
      >
        Edit
      </button>
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-remove-command"
        onClick={onRemoveClick}
      >
        Remove
      </button>
    </td>
  );
}; // Create the Grid that will be used inside the Form

const FormGrid = (fieldArrayRenderProps) => {
  const { validationMessage, visited, name, dataItemKey } =
    fieldArrayRenderProps;
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

  const onRemove = React.useCallback(
    (dataItem) => {
      fieldArrayRenderProps.onRemove({
        index: dataItem[FORM_DATA_INDEX],
      });
      setEditIndex(undefined);
    },
    [fieldArrayRenderProps]
  ); // Update an item from the Grid and update the index of the edited item

  const onEdit = React.useCallback((dataItem, isNewItem) => {
    if (!isNewItem) {
      editItemCloneRef.current = clone(dataItem);
    }

    setEditIndex(dataItem[FORM_DATA_INDEX]);
  }, []); // Cancel the editing of an item and return its initial value

  // const onCancel = React.useCallback(() => {
  //   if (editItemCloneRef.current) {
  //     fieldArrayRenderProps.onReplace({
  //       index: editItemCloneRef['current'][FORM_DATA_INDEX],
  //       value: editItemCloneRef.current,
  //     });
  //   }

  //   editItemCloneRef.current = undefined;
  //   setEditIndex(undefined);
  // }, [fieldArrayRenderProps]); // Save the changes

  const onSave = React.useCallback(() => {
    console.log(fieldArrayRenderProps);
    setEditIndex(undefined);
  }, [fieldArrayRenderProps]);
  const dataWithIndexes = fieldArrayRenderProps.value?.map((item, index) => {
    return { ...item, [FORM_DATA_INDEX]: index };
  });
  return (
    <FormGridEditContext.Provider
      value={{
        // onCancel,
        onEdit,
        onRemove,
        onSave,
        editIndex,
        parentField: name,
      }}
    >
      {visited && validationMessage && <Error>{validationMessage}</Error>}
      <Grid data={dataWithIndexes} dataItemKey={dataItemKey}>
        <GridToolbar>
          <button
            title="Add new"
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
            onClick={onAdd}
          >Add new</button>
        </GridToolbar>
        <GridColumn
          field="ProductName"
          title="Name" cell={NameCell} />
        <GridColumn
          field="UnitsOnOrder"
          title="Units" cell={NumberCell} />
        <GridColumn cell={CommandCell} width="240px" />
      </Grid>
    </FormGridEditContext.Provider>
  );
};
//#endregion

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
    console.log('NewCommitteeMemberFormItem');
    console.log(props);
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
            <FieldArray
              name="Products"
              dataItemKey={DATA_ITEM_KEY}
              component={FormGrid}
              validator={arrayLengthValidator}
            />
            {
              this.state.activeCommittees.length > 0 &&
              <FieldArray
                name={'Committees'}
                allowMultiple={true}
                component={_N}
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
