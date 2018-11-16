import { SimpleChip } from '@rmwc/chip';
import { Drawer, DrawerAppContent, DrawerContent } from "@rmwc/drawer";
import { List, SimpleListItem } from "@rmwc/list";
import { TextField } from "@rmwc/textfield";
import { SimpleTopAppBar } from "@rmwc/top-app-bar";
import { debounce } from "lodash";
import { inject, observer } from 'mobx-react';
import * as React from "react";
import { Link } from "react-router-dom";
import { Store } from "src/store";

type Props = {
  store?: Store
  bodyClass?: string
  onQuery?: (query: string) => void
}

type State = {
  query: string
  callback?: (query: string) => void
}

@inject('store')
@observer
export default class AppFrame extends React.Component<Props, State> {
  componentWillMount() {
    this.setState({query: "", callback: this.props.onQuery ? debounce(this.props.onQuery, 300) : undefined})
  }

  setQuery = (e: any) => {
    const query = e.target.value
    this.setState({query: query})
    this.state.callback!(query)
  }

  render() {
    const store = this.props.store!
    const user = store.user!
    const { onQuery, bodyClass } = this.props
    const { query } = this.state

    const userBadge = <SimpleChip leadingIcon="face" text={`${user.first_name} ${user.last_name}`} />

    const searchBar = onQuery ? 
      <TextField withLeadingIcon="search" className="search-field" key="search" placeholder="Search..." outlined dense value={query} onChange={this.setQuery} />
      : []

    return (
      <div>
        <SimpleTopAppBar title="HLTConnect" fixed startContent={searchBar} endContent={userBadge}/>
        <div className="mdc-top-app-bar--fixed-adjust" />
        <div className="body-split">
          <Drawer open={true}>
            <DrawerContent>
              <List className="sidebar">
                <SimpleListItem graphic="contacts" text="Contacts" {...{ tag: Link, to: '/contacts' }}/>
                <SimpleListItem graphic="home" text="Open Houses" {...{ tag: Link, to: '/openhouses' }}/>
                <SimpleListItem graphic="group" text="Meetups" {...{ tag: Link, to: '/contacts' }}/>
                <SimpleListItem graphic="mail" text="Messages" {...{ tag: Link, to: '/contacts' }}/>
                <SimpleListItem graphic="account_circle" text="Profile" {...{ tag: Link, to: '/contacts' }}/>
                <SimpleListItem graphic="redeem" text="Marketing" {...{ tag: Link, to: '/contacts' }}/>
              </List>
            </DrawerContent>
          </Drawer>
          <DrawerAppContent className={bodyClass}>{this.props.children}</DrawerAppContent>
        </div>
      </div>
    );
  }
}
