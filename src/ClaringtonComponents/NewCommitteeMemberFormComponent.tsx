import * as React from 'react';

import { Form, FormElement, Field, FormRenderProps, FieldArrayRenderProps, FieldArrayProps } from '@progress/kendo-react-form';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker } from '@fluentui/react';
import { ActionButton } from 'office-ui-fabric-react';
import { ListView, ListViewHeader } from '@progress/kendo-react-listview';
import { MyComboBox } from './MyFormComponents';
import { GetChoiceColumn } from '../ClaringtonHelperMethods/MyHelperMethods';


export const NewCommitteeMemberContext = React.createContext<{
    parentField: string;
    activeCommittees: any[];
}>({} as any);

export class NewCommitteeMemberFormComponent extends React.Component<FieldArrayProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            editIndex: 0,
            position: [],
            status: []
        };
    }

    private FORM_DATA_INDEX = "formDataIndex";

    private editItemCloneRef: any = React.createRef();

    // Add a new item to the Form FieldArray that will be shown in the List
    private onAdd = (e) => {
        e.preventDefault();
        this.props.onPush({
            value: {
                CommitteeName: ''
            },
        });
        this.setState({ editIndex: 0 });
    }

    private NewCommitteeMemberFormItem = (props) => {
        const lvContext = React.useContext(NewCommitteeMemberContext);
        return (
            <div>
                <Field
                    name={`${lvContext.parentField}[${props.dataItem[this.FORM_DATA_INDEX]}].CommitteeName`}
                    label={`Select Committee`}
                    component={MyComboBox}
                    options={lvContext.activeCommittees.map(value => { return { key: value.Title, text: value.Title }; })}
                    onChange={(e) => {
                        GetChoiceColumn(e.value, 'Status').then(f => this.setState({ status: f }));
                        GetChoiceColumn(e.value, 'Position').then(f => this.setState({ positions: f }));
                    }}
                />
                <Field
                    name={`${lvContext.parentField}[${props.dataItem[this.FORM_DATA_INDEX]}]._Status`}
                    label={'Status'}
                    component={MyComboBox}
                    options={this.state.status ? this.state.status.map(f => { return { key: f, text: f }; }) : []}
                />

                <Field
                    name={`${lvContext.parentField}[${props.dataItem[this.FORM_DATA_INDEX]}].Position`}
                    label={'Position'}
                    component={MyComboBox}
                    options={this.state.positions ? this.state.positions.map(f => { return { key: f, text: f }; }) : []}
                />
                <Field
                    name={`${lvContext.parentField}[${props.dataItem[this.FORM_DATA_INDEX]}].StartDate`}
                    label={'Term Start Date'}
                    component={DatePicker}
                />
                <h5>Term End Date goes here...</h5>
                <h5>File Upload Goes here...</h5>
            </div>
        );
    }

    private MyFooter = () => {
        return (<ListViewHeader
            style={{
                color: "rgb(160, 160, 160)",
                fontSize: 14,
            }}
            className="pl-3 pb-2 pt-2"
        >
            <ActionButton iconProps={{ iconName: 'Add' }} onClick={this.onAdd}>Add Committee</ActionButton>
        </ListViewHeader>);
    }

    public render() {
        const dataWithIndexes = this.props.value?.map((item, index) => {
            return { ...item, [this.FORM_DATA_INDEX]: index };
        });
        const { validationMessage, visited, name, dataItemKey } = this.props;

        return (
            <NewCommitteeMemberContext.Provider value={{
                parentField: name,
                activeCommittees: this.props.activeCommittees,
            }}>
                <ListView
                    item={this.NewCommitteeMemberFormItem}
                    footer={this.MyFooter}
                    data={dataWithIndexes}
                    style={{ width: "100%" }}
                />
            </NewCommitteeMemberContext.Provider>
        );
    }
}