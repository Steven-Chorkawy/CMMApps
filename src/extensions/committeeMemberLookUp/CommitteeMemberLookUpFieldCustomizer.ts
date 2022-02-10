import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Log } from '@microsoft/sp-core-library';
import { override } from '@microsoft/decorators';
import {
  BaseFieldCustomizer,
  IFieldCustomizerCellEventParameters
} from '@microsoft/sp-listview-extensibility';

import * as strings from 'CommitteeMemberLookUpFieldCustomizerStrings';
import CommitteeMemberLookUp from './components/CommitteeMemberLookUp';
import { sp } from '@pnp/sp';

/**
 * If your field customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICommitteeMemberLookUpFieldCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

const LOG_SOURCE: string = 'CommitteeMemberLookUpFieldCustomizer';

export default class CommitteeMemberLookUpFieldCustomizer
  extends BaseFieldCustomizer<ICommitteeMemberLookUpFieldCustomizerProperties> {

  @override
  public async onInit(): Promise<void> {
    // Add your custom initialization to this method.  The framework will wait
    // for the returned promise to resolve before firing any BaseFieldCustomizer events.
    Log.info(LOG_SOURCE, 'Activated CommitteeMemberLookUpFieldCustomizer with properties:');
    Log.info(LOG_SOURCE, JSON.stringify(this.properties, undefined, 2));
    Log.info(LOG_SOURCE, `The following string should be equal: "CommitteeMemberLookUpFieldCustomizer" and "${strings.Title}"`);

    await super.onInit().then(() => {
      sp.setup({
        spfxContext: this.context,
        sp: {
          headers: {
            "Accept": "application/json; odata=nometadata"
          },
          baseUrl: this.context.pageContext.web.absoluteUrl
        }
      });
    });

    return Promise.resolve();
  }

  @override
  public onRenderCell(event: IFieldCustomizerCellEventParameters): void {
    const committeeMemberLookUp: React.ReactElement<{}> = React.createElement(CommitteeMemberLookUp, { context: this.context, ...event });
    ReactDOM.render(committeeMemberLookUp, event.domElement);
  }

  @override
  public onDisposeCell(event: IFieldCustomizerCellEventParameters): void {
    // This method should be used to free any resources that were allocated during rendering.
    // For example, if your onRenderCell() called ReactDOM.render(), then you should
    // call ReactDOM.unmountComponentAtNode() here.
    ReactDOM.unmountComponentAtNode(event.domElement);
    super.onDisposeCell(event);
  }
}
