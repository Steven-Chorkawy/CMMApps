import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';
import { ActionButton, MessageBar, Panel, PanelType } from 'office-ui-fabric-react';
import { MessageBarType } from '@microsoft/office-ui-fabric-react-bundle';
import MemberDetailsComponent from '../../../ClaringtonComponents/MemberDetailsComponent';

const LOG_SOURCE: string = 'CommitteeMemberLookUp';

export interface ICommitteeMemberLookUpState {
  isPanelOpen: boolean;
}

export default class CommitteeMemberLookUp extends React.Component<any, ICommitteeMemberLookUpState> {
  constructor(props) {
    super(props);

    this.state = { isPanelOpen: false };
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
    console.log(this.props);

    return (
      <div>
        {
          this.props.fieldValue && this.props.fieldValue.length > 0 ? <div>
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
                headerText={'Committee Member Details'}
                type={PanelType.large}
                isOpen={this.state.isPanelOpen}
                onDismiss={e => { this.setState({ isPanelOpen: false }); }}
                // You MUST provide this prop! Otherwise screen readers will just say "button" with no label.
                closeButtonAriaLabel="Close"
              >
                <MemberDetailsComponent
                  // this.props.fieldValue[0] must be checked first.
                  memberId={this.props.fieldValue[0].lookupId}
                />
              </Panel>
            }
          </div> :
            <MessageBar messageBarType={MessageBarType.error}>Cannot Get Member Details!</MessageBar>
        }
      </div>
    );
  }
}
