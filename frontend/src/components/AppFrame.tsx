import { Chip } from "@rmwc/chip";
import { Drawer, DrawerAppContent, DrawerContent } from "@rmwc/drawer";
import { List, SimpleListItem } from "@rmwc/list";
import { TextField } from "@rmwc/textfield";
import { TopAppBar, TopAppBarNavigationIcon, TopAppBarRow, TopAppBarSection } from "@rmwc/top-app-bar";
import { debounce } from "lodash";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Link } from "react-router-dom";
import logo from "src/assets/blre-logo.png";
import { Store } from "src/store";

type Props = {
  store?: Store;
  bodyClass?: string;
  onQuery?: (query: string) => void;
};

type State = {
  query: string;
  callback?: (query: string) => void;
  mobileView: boolean;
  drawerOpen: boolean;
};

@inject("store")
@observer
export default class AppFrame extends React.Component<Props, State> {
  componentWillMount() {
    this.setState({
      drawerOpen: window.innerWidth > 800,
      mobileView: window.innerWidth <= 800,
      query: "",
      callback: this.props.onQuery
        ? debounce(this.props.onQuery, 300)
        : undefined
    });
  }

  setQuery = (e: any) => {
    const query = e.target.value;
    this.setState({ query: query });
    this.state.callback!(query);
  };

  toggleDrawer = () => {
    console.log('toggle')
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  render() {
    const store = this.props.store!;
    const user = store.user!;
    const { onQuery, bodyClass } = this.props;
    const { query, drawerOpen} = this.state;

    const userBadge = (
      <Chip leadingIcon="face" text={`${user.first_name} ${user.last_name}`} />
    );

    const searchBar = onQuery ? (
      <TextField
        withLeadingIcon="search"
        className="search-field"
        key="search"
        placeholder="Search..."
        outlined
        dense
        value={query}
        onChange={this.setQuery}
      />
    ) : (
      []
    );

    return (
      <div>
        <TopAppBar className="top-app-bar" fixed>
          <TopAppBarRow>
            <TopAppBarNavigationIcon icon="menu" className="black" onClick={this.toggleDrawer} />
            <TopAppBarSection className="title">
              <img
                src={logo}
                className="logo"
                alt="Better Living Real Estate"
              />
            </TopAppBarSection>
            <TopAppBarSection >{searchBar}</TopAppBarSection>
            <TopAppBarSection alignEnd>{userBadge}</TopAppBarSection>
          </TopAppBarRow>
        </TopAppBar>
        <div className="mdc-top-app-bar--fixed-adjust" />
        <div className="body-split">
          <Drawer open={drawerOpen} dismissible>
            <DrawerContent>
              <List className="sidebar">
                <SimpleListItem
                  graphic="inbox"
                  text="Opportunities"
                  {...{ tag: 'a', href: '/account/opportunities' }}
                />
                <SimpleListItem
                  graphic="contacts"
                  text="Contacts"
                  {...{ tag: Link, to: "/contacts" }}
                />
                <SimpleListItem
                  graphic="home"
                  text="Open Houses"
                  {...{ tag: Link, to: "/openhouses" }}
                />
                <SimpleListItem
                  graphic="email"
                  text="Message Center"
                  {...{ tag: 'a', href: '/account/notifications' }}
                />
                <SimpleListItem
                  graphic="search"
                  text="Find a Pro"
                  {...{ tag: 'a', href: '/account/advisors/find' }}
                />
                <SimpleListItem
                  graphic="language"
                  text="LSNs"
                  {...{ tag: 'a', href: '/account/lsns/find' }}
                />
                <SimpleListItem
                  graphic="people"
                  text="Personnel Directory"
                  {...{ tag: Link, to: "/account/personnel-directory" }}
                />
                <SimpleListItem
                  graphic="settings"
                  text="Settings"
                  {...{ tag: Link, to: "/account/settings" }}
                />
              </List>
            </DrawerContent>
          </Drawer>
          <DrawerAppContent className={bodyClass}>
            {this.props.children}
          </DrawerAppContent>
        </div>
      </div>
    );
  }
}
