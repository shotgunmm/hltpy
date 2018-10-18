import { CircularProgress } from "@rmwc/circular-progress";
import { DataTable, DataTableBody, DataTableCell, DataTableContent, DataTableHead, DataTableHeadCell, DataTableRow } from "@rmwc/data-table";
import { Fab } from '@rmwc/fab';
import { IconButton } from '@rmwc/icon-button';
import * as React from "react";
import { Link } from 'react-router-dom';
import AppFrame from "src/components/AppFrame";
import api from "src/store/api";

type State = {
  items: Contact[];
  loading: boolean;
};

export default class ContactScreen extends React.Component<{}, State> {
  refresh = () => {
    this.setState({ loading: true });
    api
      .get("/contacts")
      .then(res =>
        this.setState({ items: res.data.items as Contact[], loading: false })
      );
  };

  headerColumns = () => ["Name", "Phone Number", "Phone", "Address"];

  componentWillMount() {
    this.refresh();
  }

  renderHeader = () => (
    <DataTableHead>
      <DataTableRow>
        {this.headerColumns().map(this.renderHeaderCell)}
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
        {value.first_name} {value.last_name}
        <br /> <b>{value.state}</b>
      </DataTableCell>
      <DataTableCell>{value.email_personal || value.email_work}</DataTableCell>
      <DataTableCell>
        {value.phone_mobile || value.phone_home || value.phone_work}
      </DataTableCell>
      <DataTableCell>
        {value.address_street} <br />
        {value.address_city}
      </DataTableCell>
      <DataTableCell>
        <IconButton icon="edit" {...{tag: Link, to: `/contacts/${value.id}`}} />
      </DataTableCell>
    </DataTableRow>
  );

  render() {
    const { loading } = this.state;
    return (
      <AppFrame>
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
