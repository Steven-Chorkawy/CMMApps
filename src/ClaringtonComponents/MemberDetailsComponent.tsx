import { Panel, PanelType } from '@fluentui/react';
import { Dropdown, Separator } from 'office-ui-fabric-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import AddCommitteeMemberForm from './AddCommitteeMemberForm';
import NewMemberForm from './NewMemberForm';



export interface IMemberDetailsComponentProps {

}

export default class MemberDetailsComponent extends React.Component<IMemberDetailsComponentProps, any> {
    constructor(props) {
        super(props);
    }

    public render(): React.ReactElement<any> {
        return (<span>hello</span>);
    }
}
