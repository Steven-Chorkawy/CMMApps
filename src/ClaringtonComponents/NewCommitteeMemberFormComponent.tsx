import * as React from 'react';

import { Form, FormElement, Field, FormRenderProps, FieldArrayRenderProps, FieldArrayProps } from '@progress/kendo-react-form';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker } from '@fluentui/react';
import { ActionButton } from 'office-ui-fabric-react';
import { ListView, ListViewHeader } from '@progress/kendo-react-listview';
import { MyComboBox } from './MyFormComponents';
import { GetChoiceColumn, GetCommitteeByName, OnFormatDate } from '../ClaringtonHelperMethods/MyHelperMethods';
import ICommitteeFileItem from '../ClaringtonInterfaces/ICommitteeFileItem';


export const NewCommitteeMemberContext = React.createContext<{
    parentField: string;
    activeCommittees: any[];
}>({} as any);

export interface INewCommitteeMemberFormComponentState {
    editIndex: number;
    positions: string[];
    status: string[];
    committeeFileItem?: ICommitteeFileItem;
    selectedStartDate?: Date;
    calculatedEndDate?: Date;
}

export class NewCommitteeMemberFormComponent extends React.Component<FieldArrayProps, INewCommitteeMemberFormComponentState> {
    constructor(props) {
        super(props);

        this.state = {
            editIndex: 0,
            positions: [],
            status: [],
            committeeFileItem: undefined
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

    private _calculateEndDate = (startDate: Date, termLength: number): Date => {
        return new Date(startDate.getFullYear() + termLength, startDate.getMonth(), startDate.getDate());
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
                    description={this.state.committeeFileItem ? `Term Length: ${this.state.committeeFileItem.TermLength} years.` : ""}
                    onChange={(e) => {
                        GetChoiceColumn(e.value, 'Status').then(f => this.setState({ status: f }));
                        GetChoiceColumn(e.value, 'Position').then(f => this.setState({ positions: f }));
                        GetCommitteeByName(e.value).then(f => this.setState({ committeeFileItem: f }));
                    }}
                />
                <Field
                    name={`${lvContext.parentField}[${props.dataItem[this.FORM_DATA_INDEX]}]._Status`}
                    label={'Status'}
                    component={MyComboBox}
                    disabled={!this.state.committeeFileItem}
                    options={this.state.status ? this.state.status.map(f => { return { key: f, text: f }; }) : []}
                />

                <Field
                    name={`${lvContext.parentField}[${props.dataItem[this.FORM_DATA_INDEX]}].Position`}
                    label={'Position'}
                    component={MyComboBox}
                    disabled={!this.state.committeeFileItem}
                    options={this.state.positions ? this.state.positions.map(f => { return { key: f, text: f }; }) : []}
                />
                <Field
                    name={`${lvContext.parentField}[${props.dataItem[this.FORM_DATA_INDEX]}].StartDate`}
                    label={'Term Start Date'}
                    //allowTextInput={true}
                    formatDate={OnFormatDate}
                    component={DatePicker}
                    disabled={!this.state.committeeFileItem}
                    onSelectDate={e => this.setState({ calculatedEndDate: this._calculateEndDate(e, this.state.committeeFileItem.TermLength) })}
                />
                {
                    this.state.calculatedEndDate &&
                    <Field
                        name={`${lvContext.parentField}[${props.dataItem[this.FORM_DATA_INDEX]}]._EndDate`}
                        label={'Term End Date'}
                        value={this.state.calculatedEndDate ? this.state.calculatedEndDate : undefined}
                        formatDate={OnFormatDate}
                        component={DatePicker}
                    // disabled={true}
                    />
                }
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