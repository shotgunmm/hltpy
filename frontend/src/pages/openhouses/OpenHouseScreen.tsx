import { CircularProgress } from "@rmwc/circular-progress";
import { DataTable, DataTableBody, DataTableCell, DataTableContent, DataTableHead, DataTableHeadCell, DataTableRow } from "@rmwc/data-table";
import { Fab } from '@rmwc/fab';
import { IconButton } from '@rmwc/icon-button';
import * as React from "react";
import { Link } from 'react-router-dom';
import AppFrame from "src/components/AppFrame";
import api from "src/store/api";

type State = {
  items: OpenHouse[];
  loading: boolean;
};

export default class OpenHouseScreen extends React.Component<{}, State> {
  refresh = () => {
    this.setState({ loading: true });
    api
      .get("/openhouses")
      .then(res =>
        this.setState({ items: res.data.items as OpenHouse[], loading: false })
      );
  };

  headerColumns = () => ["Name", "Address", "Date", "Actions"];

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

  renderRow = (value: OpenHouse) => (
    <DataTableRow key={value.id}> 
      <DataTableCell>
        {value.name} 
      </DataTableCell>
      <DataTableCell>{value.address}</DataTableCell>
      <DataTableCell>
        {value.date}
      </DataTableCell>
      <DataTableCell>
        { !value.completed && <IconButton icon="open_in_new" tag="a" href={`/openhouse/${value.key}/enter`} target="_window" /> }
        <IconButton icon="edit" {...{tag: Link, to: `/openhouses/${value.id}`}} />
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
        <Fab icon="add" className="corner-fab" {...{ tag: Link, to: "/openhouses/new" }}/>
      </AppFrame>
    );
  }
}
