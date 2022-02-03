import * as React from 'react';

import { Form, FormElement, Field, FormRenderProps, FieldArrayRenderProps, FieldArrayProps } from '@progress/kendo-react-form';
import { FilePicker, IFilePickerResult } from '@pnp/spfx-controls-react/lib/FilePicker';

import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker, Calendar, getTheme } from '@fluentui/react';
import { ActionButton } from 'office-ui-fabric-react';
import { ListView, ListViewHeader, ListViewItemProps } from '@progress/kendo-react-listview';
import { MyComboBox, MyDatePicker } from './MyFormComponents';
import { CalculateTermEndDate, FORM_DATA_INDEX, GetChoiceColumn, GetCommitteeByName, OnFormatDate } from '../ClaringtonHelperMethods/MyHelperMethods';
import ICommitteeFileItem from '../ClaringtonInterfaces/ICommitteeFileItem';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';


export const NewCommitteeMemberContext = React.createContext<{
    parentField: string;
    activeCommittees: any[];
}>({} as any);

export interface INewCommitteeMemberFormComponentProps extends FieldArrayProps {
    formRenderProps: FormRenderProps;
    context: WebPartContext;
}

export interface INewCommitteeMemberFormComponentState {
    editIndex: number;
}

export interface INewCommitteeMemberFormItemState {
    positions: string[];
    status: string[];
    committeeFileItem?: ICommitteeFileItem;
    selectedStartDate?: Date;
    calculatedEndDate?: Date;
    pendingFiles?: any;
}

export class NewCommitteeMemberFormItem extends React.Component<any, INewCommitteeMemberFormItemState> {
    constructor(props) {
        super(props);
        this.state = {
            positions: [],
            status: [],
            committeeFileItem: undefined,
            pendingFiles: []
        };
    }

    public render() {
        const reactTheme = getTheme();
        return (
            <div style={{ padding: '10px', marginBottom: '10px', boxShadow: reactTheme.effects.elevation16 }}>
                <Field
                    name={`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}].CommitteeName`}
                    label={`Select Committee`}
                    component={MyComboBox}
                    options={this.props.listViewContext.activeCommittees.map(value => { return { key: value.Title, text: value.Title }; })}
                    description={this.state.committeeFileItem ? `Term Length: ${this.state.committeeFileItem.TermLength} years.` : ""}
                    onChange={(e) => {
                        GetChoiceColumn(e.value, 'Status').then(f => this.setState({ status: f }));
                        GetChoiceColumn(e.value, 'Position').then(f => this.setState({ positions: f }));
                        GetCommitteeByName(e.value).then(f => this.setState({ committeeFileItem: f }));
                        this.props.formRenderProps.onChange(`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}]._EndDate`, { value: '' });
                        this.props.formRenderProps.onChange(`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}].StartDate`, { value: '' });
                        this.props.formRenderProps.onChange(`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}]._Status`, { value: '' });
                        this.props.formRenderProps.onChange(`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}].Position`, { value: '' });
                    }}
                />
                <Field
                    name={`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}]._Status`}
                    label={'Status'}
                    component={MyComboBox}
                    disabled={!this.state.committeeFileItem}
                    options={this.state.status ? this.state.status.map(f => { return { key: f, text: f }; }) : []}
                />

                <Field
                    name={`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}].Position`}
                    label={'Position'}
                    component={MyComboBox}
                    disabled={!this.state.committeeFileItem}
                    options={this.state.positions ? this.state.positions.map(f => { return { key: f, text: f }; }) : []}
                />
                <Field
                    name={`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}].StartDate`}
                    label={'Term Start Date'}
                    //allowTextInput={true}
                    formatDate={OnFormatDate}
                    component={MyDatePicker}
                    onChange={e => {
                        let calcEndDate = CalculateTermEndDate(e.value, this.state.committeeFileItem.TermLength);
                        this.setState({
                            calculatedEndDate: calcEndDate
                        });

                        this.props.formRenderProps.onChange(`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}]._EndDate`, { value: calcEndDate });
                    }}
                    disabled={!this.state.committeeFileItem}
                />
                {
                    this.state.calculatedEndDate &&
                    <Field
                        name={`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}]._EndDate`}
                        label={'Term End Date'}
                        formatDate={OnFormatDate}
                        component={DatePicker}
                        disabled={true}
                    />
                }
                {
                    // MS is working on allowing users to select multiple files from a library. https://github.com/pnp/sp-dev-fx-controls-react/pull/1047                
                }
                <FilePicker
                    // accepts={[".gif", ".jpg", ".jpeg", ".bmp", ".dib", ".tif", ".tiff", ".ico", ".png", ".jxr", ".svg"]}
                    buttonIcon="FileImage"
                    buttonLabel='Select Files'
                    label={'Upload Attachments'}
                    onSave={(filePickerResult: IFilePickerResult[]) => {
                        console.log('onSave');
                        console.log(filePickerResult);
                        let currentFiles = this.state.pendingFiles;
                        currentFiles.push(...filePickerResult);
                        this.setState({ pendingFiles: currentFiles });
                        filePickerResult.map(fpr => {
                            fpr.downloadFileContent().then(fileContent => {
                                sp.web.getFolderByServerRelativeUrl('/sites/CMM/Shared%20Documents/Hello').files.add(fpr.fileName, fileContent, true);
                            });
                        })
                    }}
                    onChange={(filePickerResult: IFilePickerResult[]) => {
                        console.log('onChange');
                        console.log(filePickerResult);
                    }}
                    context={this.props.context}
                    hideStockImages={true}
                    hideLinkUploadTab={true}
                    hideLocalUploadTab={true}
                    hideRecentTab={true}
                />
                {this.state.pendingFiles.map(f => { return <div><span>Name: {f.fileName}</span> | <span>Size: {f.fileSize}</span></div>; })}

                {/* <Field
                    name={`${this.props.listViewContext.parentField}[${this.props.dataItem[FORM_DATA_INDEX]}].Files`}
                    batch={false}
                    multiple={true}
                    defaultFiles={[]}

                    component={Upload}
                /> */}
            </div>
        );
    }
}

export class NewCommitteeMemberFormComponent extends React.Component<INewCommitteeMemberFormComponentProps, INewCommitteeMemberFormComponentState> {
    constructor(props) {
        super(props);

        this.state = {
            editIndex: 0,
        };
    }

    // Add a new item to the Form FieldArray that will be shown in the List
    private onAdd = (e) => {
        e.preventDefault();
        this.props.onPush({
            value: {
                CommitteeName: '',
                StartDate: '',
                _EndDate: '',
                _Status: '',
                Position: ''
            },
        });
        this.setState({ editIndex: 0 });
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

    private NewCommitteeMemberFormItem = props =>
        <NewCommitteeMemberFormItem {...props} context={this.props.context} listViewContext={React.useContext(NewCommitteeMemberContext)} formRenderProps={this.props.formRenderProps} />

    public render() {
        const dataWithIndexes = this.props.value?.map((item, index) => {
            return { ...item, [FORM_DATA_INDEX]: index };
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