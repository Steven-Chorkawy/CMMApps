import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';
import { ActionButton, MessageBar, Panel, PanelType } from 'office-ui-fabric-react';
import { MessageBarType } from '@microsoft/office-ui-fabric-react-bundle';

const LOG_SOURCE: string = 'CommitteeMemberLookUp';

export interface ICommitteeMemberLookUpState {
  isPanelOpen: boolean;
}

export default class CommitteeMemberLookUp extends React.Component<any, ICommitteeMemberLookUpState> {
  constructor(props) {
    super(props);

    this.state = { isPanelOpen: false };

    console.log('CommitteeMemberLookUp ctor');
    console.log(props);
    console.log(this.state);
  }

  @override
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: CommitteeMemberLookUp mounted');
  }

  @override
  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: CommitteeMemberLookUp unmounted');
  }

  @override
  public render(): React.ReactElement<{}> {
    console.log('CommitteeMemberLookUp Render');
    console.log(this.props);
    console.log(this.state);

    return (
      <div>
        {
          this.props.fieldValue ? <div>
            <ActionButton
              iconProps={{ iconName: 'ContactInfo' }}
              onClick={e => {
                e.preventDefault();
                this.setState({ isPanelOpen: true });
              }}>
              View More Details
            </ActionButton>
            {
              this.state.isPanelOpen &&
              <Panel
                headerText="TODO: Update this Panel is data."
                type={PanelType.large}
                isOpen={this.state.isPanelOpen}
                onDismiss={e => { this.setState({ isPanelOpen: false }); }}
                // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
                closeButtonAriaLabel="Close"
              >
                <p>Content goes here.</p>
              </Panel>
            }
          </div> : <MessageBar messageBarType={MessageBarType.error}>Cannot Get Member Details!</MessageBar>
        }
      </div>
    );
  }
}
