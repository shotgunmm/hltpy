import { SimpleChip } from '@rmwc/chip';
import { Drawer, DrawerAppContent, DrawerContent } from "@rmwc/drawer";
import { List, SimpleListItem } from "@rmwc/list";
import { SimpleTopAppBar } from "@rmwc/top-app-bar";
import { inject, observer } from 'mobx-react';
import * as React from "react";
import { Link } from "react-router-dom";
import { Store } from "src/store";

type Props = {
  store?: Store
}

@inject('store')
@observer
export default class AppFrame extends React.Component<Props, {}> {
  render() {
    const store = this.props.store!
    const user = store.user!

    const userBadge = <SimpleChip leadingIcon="face" text={`${user.first_name} ${user.last_name}`} />

    return (
      <div>
        <SimpleTopAppBar title="HLTConnect" fixed endContent={userBadge}/>
        <div className="mdc-top-app-bar--fixed-adjust" />
        <div className="body-split">
          <Drawer open={true}>
            <DrawerContent>
              <List className="sidebar">
                <SimpleListItem graphic="contacts" text="Contacts" {...{ tag: Link, to: '/contacts' }}/>
                <SimpleListItem graphic="group" text="Meetups" {...{ tag: Link, to: '/contacts' }}/>
                <SimpleListItem graphic="mail" text="Messages" {...{ tag: Link, to: '/contacts' }}/>
                <SimpleListItem graphic="account_circle" text="Profile" {...{ tag: Link, to: '/contacts' }}/>
                <SimpleListItem graphic="redeem" text="Marketing" {...{ tag: Link, to: '/contacts' }}/>
              </List>
            </DrawerContent>
          </Drawer>
          <DrawerAppContent>{this.props.children}</DrawerAppContent>
        </div>
      </div>
    );
  }
}
