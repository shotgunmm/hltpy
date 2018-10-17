import { Drawer, DrawerAppContent, DrawerContent } from "@rmwc/drawer";
import { List, SimpleListItem } from "@rmwc/list";
import { SimpleTopAppBar } from "@rmwc/top-app-bar";
import * as React from "react";
import { Link } from "react-router-dom";

export default class AppFrame extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <SimpleTopAppBar title="HLTConnect" fixed />
        <div className="mdc-top-app-bar--fixed-adjust" />
        <div className="body-split">
          <Drawer open={true}>
            <DrawerContent>
              <List className="sidebar">
                <SimpleListItem graphic="contacts" text="Contacts" {...{ tag: Link, to: '/contacts' }}/>
              </List>
            </DrawerContent>
          </Drawer>
          <DrawerAppContent>{this.props.children}</DrawerAppContent>
        </div>
      </div>
    );
  }
}
