import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import { ComboBox, Icon, Text } from '@fluentui/react';
import { WidgetSize, Dashboard } from '@pnp/spfx-controls-react/lib/Dashboard';
import IMemberListItem from '../../../ClaringtonInterfaces/IMemberListItem';
import { GetMember, GetMembers } from '../../../ClaringtonHelperMethods/MyHelperMethods';
import MemberDetailsComponent, { CommitteeMemberContactDetails, CommitteeMemberTermHistory } from '../../../ClaringtonComponents/MemberDetailsComponent';
import { WebPartContext } from '@microsoft/sp-webpart-base';


export interface ICommitteeMemberDashboardProps {
  description: string;
  memberId?: number;
  context: WebPartContext;
}

export interface ICommitteeMemberDashboardState {
  members: IMemberListItem[];
  selectedMember?: IMemberListItem;
}

export default class CommitteeMemberDashboard extends React.Component<ICommitteeMemberDashboardProps, ICommitteeMemberDashboardState> {

  constructor(props) {
    super(props);
    this.state = {
      members: undefined,
    };

    GetMembers().then(members => {
      this.setState({
        members: members
      });
    });

    if (this.props.memberId) {
      GetMember(this.props.memberId).then(value => {
        this.setState({ selectedMember: value });
      });
    }
  }

  public render(): React.ReactElement<ICommitteeMemberDashboardProps> {
    const linkExample = { href: "#" };
    const calloutItemsExample = [
      {
        id: "action_1",
        title: "Info",
        icon: <Icon iconName={'Edit'} />,
      },
      { id: "action_2", title: "Popup", icon: <Icon iconName={'Add'} /> },
    ];

    return <div>
      {
        this.state.members &&
        <ComboBox
          label={'Select Member'}
          options={this.state.members.map((member: IMemberListItem) => {
            return { key: member.ID, text: member.Title, data: { ...member } };
          })}
          onChange={(event, option) => {
            this.setState({ selectedMember: undefined });
            GetMember(Number(option.key)).then(member => {
              this.setState({ selectedMember: member });
            });
          }}
          defaultSelectedKey={this.props.memberId ? this.props.memberId : undefined}
        />
      }
      {
        this.state.selectedMember &&
        <Dashboard
          widgets={[{
            title: this.state.selectedMember.Title,
            desc: "Last updated Monday, April 4 at 11:15 AM (PT)",
            widgetActionGroup: calloutItemsExample,
            size: WidgetSize.Triple,
            body: [
              {
                id: "t1",
                title: "Tab 1",
                content: (
                  <CommitteeMemberContactDetails member={this.state.selectedMember} />
                ),
              }
            ],
            link: linkExample,
          },
          {
            title: "Committee History",
            size: WidgetSize.Single,
            body: [{
              id: 'id',
              title: 'Committee History',
              content: (<CommitteeMemberTermHistory memberID={this.state.selectedMember.ID} context={this.props.context} />)
            }],
            link: linkExample,
          },
          {
            title: "Card 3",
            size: WidgetSize.Double,
            link: linkExample,
          }]} />
      }
    </div>;
  }
}
