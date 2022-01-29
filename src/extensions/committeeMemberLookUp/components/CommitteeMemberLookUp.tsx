import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import * as React from 'react';

import styles from './CommitteeMemberLookUp.module.scss';

export interface ICommitteeMemberLookUpProps {
  text: string;
}

const LOG_SOURCE: string = 'CommitteeMemberLookUp';

export default class CommitteeMemberLookUp extends React.Component<ICommitteeMemberLookUpProps, {}> {
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
    return (
      <div className={styles.CommitteeMemberLookUp}>
        { this.props.text }
      </div>
    );
  }
}
