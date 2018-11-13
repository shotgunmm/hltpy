import { CircularProgress } from "@rmwc/circular-progress";
import { DataTable, DataTableBody, DataTableCell, DataTableContent, DataTableHead, DataTableHeadCell, DataTableRow } from "@rmwc/data-table";
import { Fab } from '@rmwc/fab';
import { Icon } from '@rmwc/icon';
import { IconButton } from '@rmwc/icon-button';
import * as React from "react";
import { Link } from 'react-router-dom';
import AppFrame from "src/components/AppFrame";
import api from "src/store/api";

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
      .get("/contacts?q=" + query)
      .then(res => {
        this.setState({ items: res.data.items as Contact[], stars: res.data.stars as number[], loading: false })
        this.forceUpdate()
      });
  };

  headerColumns = () => ["", "Name", "Email", "Phone", "Address"];

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

  renderRow = (value: Contact) => (
    <DataTableRow key={value.id}> 
      <DataTableCell>
        { this.state.stars.indexOf(value.id) > -1 ? 
          <Icon icon="star" className="favorite" onClick={() => this.setStar(value.id, false) } /> :
          <Icon icon="star_border" className="favorite" onClick={() => this.setStar(value.id, true) } />
        }
      </DataTableCell>
      <DataTableCell>
        {value.first_name} {value.last_name}
        <br /> <b>{value.state}</b>
      </DataTableCell>
      <DataTableCell>{value.email_personal || value.email_work}</DataTableCell>
      <DataTableCell>
        {value.phone_mobile || value.phone_home || value.phone_work}
      </DataTableCell>
      <DataTableCell>
        {value.address_street && `${value.address_street}, ${value.address_city}`}
      </DataTableCell>
      <DataTableCell>
        <IconButton icon="edit" {...{tag: Link, to: `/contacts/${value.id}`}} />
      </DataTableCell>
    </DataTableRow>
  );

  render() {
    const { loading } = this.state;
    return (
      <AppFrame onQuery={this.setQuery}>
        <DataTable style={{ width: "100%" }}>
          <DataTableContent>
            {this.renderHeader()}
            <DataTableBody>
              {loading || this.renderBody()}
            </DataTableBody>
          </DataTableContent>
          {loading && <CircularProgress />}
        </DataTable>
        <Fab icon="add" className="corner-fab" {...{ tag: Link, to: "/contacts/new" }}/>
      </AppFrame>
    );
  }
}
