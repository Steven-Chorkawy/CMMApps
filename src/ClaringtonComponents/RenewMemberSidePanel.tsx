import { Panel, PanelType } from '@fluentui/react';
import { Dropdown, Separator } from 'office-ui-fabric-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AddCommitteeMemberForm from './AddCommitteeMemberForm';
import NewMemberForm from './NewMemberForm';
import RenewMemberForm from './RenewMemberForm';

export interface IRenewMemberSidePanelProps {
    isOpen?: boolean;
    panelType?: PanelType;
    context: any;
    committeeMemberID: number;
}

export default class RenewMemberSidePanel extends React.Component<IRenewMemberSidePanelProps, any> {
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
                    <RenewMemberForm {...this.props} />
                </div>
            </Panel >
        );
    }
}
