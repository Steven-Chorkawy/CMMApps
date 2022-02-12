import * as React from 'react';
import { ICommitteeMemberDashboardProps } from './ICommitteeMemberDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Icon, Text } from '@fluentui/react';
import { WidgetSize, Dashboard } from '@pnp/spfx-controls-react/lib/Dashboard';

export default class CommitteeMemberDashboard extends React.Component<ICommitteeMemberDashboardProps, {}> {
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
      <Dashboard
        widgets={[{
          title: "Card 1",
          desc: "Last updated Monday, April 4 at 11:15 AM (PT)",
          widgetActionGroup: calloutItemsExample,
          size: WidgetSize.Triple,
          body: [
            {
              id: "t1",
              title: "Tab 1",
              content: (
                <Text>
                  Content #1
                </Text>
              ),
            },
            {
              id: "t2",
              title: "Tab 2",
              content: (
                <Text>
                  Content #2
                </Text>
              ),
            },
            {
              id: "t3",
              title: "Tab 3",
              content: (
                <Text>
                  Content #3
                </Text>
              ),
            },
          ],
          link: linkExample,
        },
        {
          title: "Card 2",
          size: WidgetSize.Single,
          link: linkExample,
        },
        {
          title: "Card 3",
          size: WidgetSize.Double,
          link: linkExample,
        }]} />
    </div>;
  }
}
