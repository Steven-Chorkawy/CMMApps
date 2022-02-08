import { Panel, PanelType } from '@fluentui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AddCommitteeMemberForm from './AddCommitteeMemberForm';



export interface IAddMemberSidePanelProps {
    isOpen?: boolean;
    panelType?: PanelType;
    context: any;
}

export default class AddMemberSidePanel extends React.Component<IAddMemberSidePanelProps, any> {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: this.props.isOpen
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
                    <AddCommitteeMemberForm context={this.props.context} description={'???'} />
                </div>
            </Panel >
        );
    }
}
