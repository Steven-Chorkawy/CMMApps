import { Panel, PanelType } from '@fluentui/react';
import { Dropdown, Separator } from 'office-ui-fabric-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GetMember } from '../ClaringtonHelperMethods/MyHelperMethods';
import AddCommitteeMemberForm from './AddCommitteeMemberForm';
import NewMemberForm from './NewMemberForm';



export interface IMemberDetailsComponentProps {
    memberId: number;
}

export interface IMemberDetailsComponentState {
    member: any;
}

export default class MemberDetailsComponent extends React.Component<IMemberDetailsComponentProps, IMemberDetailsComponentState> {
    constructor(props) {
        super(props);

        this.state = {
            member: undefined
        };

        GetMember(this.props.memberId).then(value => {
            console.log('GetMember');
            console.log(value);
            this.setState({ member: value });
        });
    }

    public render(): React.ReactElement<any> {
        return (
            <div>
                <span>hello {this.props.memberId}</span>
                <div>{JSON.stringify(this.state.member)}</div>
            </div>
        );
    }
}
