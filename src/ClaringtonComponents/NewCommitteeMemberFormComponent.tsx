import * as React from 'react';

import { Form, FormElement, Field, FormRenderProps, FieldArrayRenderProps } from '@progress/kendo-react-form';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker } from '@fluentui/react';
import { ActionButton } from 'office-ui-fabric-react';
import { ListView, ListViewHeader } from '@progress/kendo-react-listview';

export interface INewCommitteeMemberFormComponentProps extends FieldArrayRenderProps {
    allowMultiple: boolean;
    committeeName?: string;
    dataItemKey?: string;
    activeCommittees?: any;
}

export class NewCommitteeMemberFormComponent extends React.Component<INewCommitteeMemberFormComponentProps, any> {
    constructor(props) {
        super(props);
    }

    public shouldComponentUpdate(nextProps: Readonly<INewCommitteeMemberFormComponentProps>, nextState: Readonly<any>, nextContext: any): boolean {
        if (this.props.value === undefined || nextProps.value === undefined) {
            return true;
        }
        if (this.props.value.length !== nextProps.value.length) {
            return true;
        }
        return false;
    }

    public render(): React.ReactElement<any> {

        const dataWithIndexes = this.props.value?.map((item, index) => {
            return { ...item, ["formDataIndex"]: index };
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
            return (<div key={`${this.props.dataItemKey}${props.index}`}>
                <Field name={`Committees[${props.index}].CommitteeName`} label={`Text ${props.index}`} component={ComboBox} options={this.props.activeCommittees.map(value => { return { key: value.Title, text: value.Title }; })} />
            </div>);
        };

        const onAdd = () => {
            console.log('onAdd');
            this.props.onPush({
                value: {
                    id: "",
                    CommitteeName: ""
                }
            });
        };

        return (
            <div>
                <ListView
                    item={NewCommitteeMemberFormItem}
                    footer={MyFooter}
                    data={dataWithIndexes}
                    style={{ width: "100%" }}
                />
            </div>
        );
    }
}


export const WTF_IS_THIS_Context = React.createContext({});

export const _N = (fieldArrayRenderProps) => {
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
                <h6>tester</h6>
                {/* <Field
                    name={`Committees[${props.index}].CommitteeName`}
                    label={`Text ${props.index}`}
                    component={ComboBox}
                    options={fieldArrayRenderProps.activeCommittees.map(value => { return { key: value.Title, text: value.Title }; })}
                />
                <Field
                    name={`Committees[${props.index}].TestText`}
                    label={'Test Text'}
                    component={TextField}
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