import * as React from 'react';

import { Form, FormElement, Field, FormRenderProps, FieldArrayRenderProps, FieldArrayProps } from '@progress/kendo-react-form';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker } from '@fluentui/react';
import { ActionButton } from 'office-ui-fabric-react';
import { ListView, ListViewHeader } from '@progress/kendo-react-listview';
import { MyComboBox } from './MyFormComponents';


export const NewCommitteeMemberContext = React.createContext<{
    parentField: string;
    activeCommittees: any[];
}>({} as any);

export class NewCommitteeMemberFormComponent extends React.Component<FieldArrayProps> {
    constructor(props) {
        super(props);

        this.state = {
            editIndex: 0,
        };
    }

    private FORM_DATA_INDEX = "formDataIndex";

    private editItemCloneRef: any = React.createRef();

    // Add a new item to the Form FieldArray that will be shown in the List
    private onAdd = (e) => {
        e.preventDefault();
        this.props.onPush({
            value: {
                id: "",
                name: "",
            },
        });
        this.setState({ editIndex: 0 });
    }

    private NewCommitteeMemberFormItem = (props) => {
        const lvContext = React.useContext(NewCommitteeMemberContext);
        return <Field
            name={`${lvContext.parentField}[${props.dataItem[this.FORM_DATA_INDEX]}].CommitteeName`}
            label={`Select Committee`}
            component={MyComboBox}
            options={lvContext.activeCommittees.map(value => { return { key: value.Title, text: value.Title }; })}
        />;
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