import Button, { ButtonIcon } from "@rmwc/button";
import { CircularProgress } from "@rmwc/circular-progress";
import { DataTable, DataTableBody, DataTableContent, DataTableHead, DataTableHeadCell, DataTableRow } from "@rmwc/data-table";
import { Fab } from '@rmwc/fab';
import * as React from "react";
import { Link } from 'react-router-dom';
import AppFrame from "src/components/AppFrame";
import api from "src/store/api";
import ContactRow from "./ContactRow";

type State = {
  items: Contact[];
  stars: number[];
  query: string;
  loading: boolean;
};

export default class ContactScreen extends React.Component<{}, State> {
  refresh = () => {
    this.setState({ loading: true });
    const query = this.state ? this.state.query : "";
    api
      .get("/contacts/?q=" + query)
      .then(res => {
        this.setState({ items: res.data.items as Contact[], stars: res.data.stars as number[], loading: false })
        this.forceUpdate()
      });
  };

  headerColumns = () => ["Name", "Email", "Phone", "Address"];

  componentWillMount() {
    this.setState({ query: "" })
    this.refresh();
  }

  setStar = (contactId: number, create: boolean) => {
    const func = create ? api.post : api.delete;
    func(`/contacts/${contactId}/star`)
    .then(res => this.setState({ stars: res.data.stars }))
  }

  setQuery = (query: string) => {
    this.setState({ query: query })
    this.refresh()
  }

  renderHeader = () => (
    <DataTableHead>
      <DataTableRow>
        { this.headerColumns().map(this.renderHeaderCell) }
        { this.renderHeaderCell('') }
      </DataTableRow>
    </DataTableHead>
  );

  renderHeaderCell = (name: string) => (
    <DataTableHeadCell key={name}>{name}</DataTableHeadCell>
  );

  renderBody = () => this.state.items.map(this.renderRow);

  renderRow = (value: Contact) => 
    <ContactRow key={value.id} value={value} onStar={this.setStar} starred={value.id in this.state.stars}/>

  render() {
    const { loading } = this.state;
    return (
      <AppFrame onQuery={this.setQuery}>
        <DataTable className="big-table">
          <DataTableContent>
            {this.renderHeader()}
            <DataTableBody>
              {loading || this.renderBody()}
            </DataTableBody>
          </DataTableContent>
          {loading && <CircularProgress />}
        </DataTable>
        <Button {...{tag: Link, to: '/contacts/import'}}>
          <ButtonIcon>import_export</ButtonIcon> Import from Gmail
        </Button>
        <Fab icon="add" className="corner-fab" {...{ tag: Link, to: "/contacts/new" }}/>
      </AppFrame>
    );
  }
}
