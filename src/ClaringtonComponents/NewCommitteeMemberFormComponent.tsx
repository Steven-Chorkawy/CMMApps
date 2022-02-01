import * as React from 'react';

import { Form, FormElement, Field, FormRenderProps, FieldArrayRenderProps } from '@progress/kendo-react-form';
import { DefaultButton, PrimaryButton, TextField, MaskedTextField, ComboBox, DatePicker } from '@fluentui/react';
import { ActionButton } from 'office-ui-fabric-react';
import { ListView, ListViewHeader } from '@progress/kendo-react-listview';

export interface INewCommitteeMemberFormComponentProps extends FieldArrayRenderProps {
    allowMultiple: boolean;
    committeeName?: string;
    dataItemKey?: string;
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
                <Field name={`Committees[${props.index}].CommitteeName`} label={`Text ${props.index}`} component={ComboBox} options={[{ key: '1', text: 'CommitteeA' }, { key: '1', text: 'CommitteeB' }]} />
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
                    data={this.props.value}
                    style={{ width: "100%" }}
                />
            </div>
        );
    }
}
