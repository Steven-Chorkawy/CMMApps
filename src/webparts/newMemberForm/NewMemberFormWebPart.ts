import * as React from 'react';
import * as ReactDom from 'react-dom';
import { sp } from "@pnp/sp";
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'NewMemberFormWebPartStrings';
import NewMemberForm from './components/NewMemberForm';
import { INewMemberFormProps } from './components/INewMemberFormProps';

export interface INewMemberFormWebPartProps {
  description: string;
}

export default class NewMemberFormWebPart extends BaseClientSideWebPart<INewMemberFormWebPartProps> {

  public render(): void {
    const element: React.ReactElement<INewMemberFormProps> = React.createElement(
      NewMemberForm,
      {
        description: this.properties.description
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
