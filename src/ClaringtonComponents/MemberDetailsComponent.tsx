import { Panel, PanelType } from '@fluentui/react';
import { Dropdown, Separator } from 'office-ui-fabric-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AddCommitteeMemberForm from './AddCommitteeMemberForm';
import NewMemberForm from './NewMemberForm';



export interface IMemberDetailsComponentProps {
    isOpen?: boolean;
    panelType?: PanelType;
    context: any;
}

export default class MemberDetailsComponent extends React.Component<IMemberDetailsComponentProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen,
            selectedForm: undefined
        };
    }

    public render(): React.ReactElement<any> {
        let wrapper = undefined;
        return (
            <Panel
                isLightDismiss={false}
                isOpen={this.state.isOpen}
                type={this.props.panelType ? this.props.panelType : PanelType.custom}
                onDismiss={() => this.setState({ isOpen: !this.state.isOpen })}
                customWidth={'800px'}
            >
                <div ref={e => wrapper = e}>
                    <Dropdown
                        label="Add New or Existing Member"
                        options={[{ key: "Add New Member", text: "Add New Member" }, { key: "Add Existing Member", text: "Add Existing Member" }]}
                        onChange={(event, options) => {
                            console.log(options);
                            this.setState({ selectedForm: options.key });
                        }}
                    />
                    <Separator />
                    {
                        this.state.selectedForm === "Add New Member" ?
                            <NewMemberForm context={this.props.context} description='???' /> :
                            <AddCommitteeMemberForm context={this.props.context} description={'???'} />
                    }
                </div>
            </Panel >
        );
    }
}
