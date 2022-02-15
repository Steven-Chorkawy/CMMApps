import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'CommitteeMemberDashboardWebPartStrings';
import { CommitteeMemberDashboard, ICommitteeMemberDashboardProps } from '../../ClaringtonComponents/CommitteeMemberDashboard';
import './components/workbench.module.scss';
import { sp } from '@pnp/sp';



export interface ICommitteeMemberDashboardWebPartProps {
  description: string;
}

export default class CommitteeMemberDashboardWebPart extends BaseClientSideWebPart<ICommitteeMemberDashboardWebPartProps> {

  public render(): void {
    // See if memberId is provided in the URL. 
    let params = new URLSearchParams(window.location.search);
    let memberId = params.get("memberId");

    const element: React.ReactElement<ICommitteeMemberDashboardProps> = React.createElement(
      CommitteeMemberDashboard,
      {
        description: this.properties.description,
        memberId: memberId ? Number(memberId) : undefined,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
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
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
