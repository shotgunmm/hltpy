import { CircularProgress } from "@rmwc/circular-progress";
import { DataTable, DataTableBody, DataTableContent, DataTableHead, DataTableHeadCell, DataTableRow } from "@rmwc/data-table";
import { Fab } from '@rmwc/fab';
import Icon from "@rmwc/icon";
import * as qs from 'query-string';
import * as React from "react";
import { Link } from 'react-router-dom';
import AppFrame from "src/components/AppFrame";
import api from "src/store/api";
import ContactRow from "./ContactRow";

type State = {
  items: Contact[];
  stars: number[];
  query: string;
  sort: string | undefined;
  reverse: boolean
  loading: boolean;
};

export default class ContactScreen extends React.Component<{}, State> {
  refresh = () => {
    this.setState({ loading: true });
    const query = { q: this.state.query, sort: this.state.sort, reverse: this.state.reverse }

    api
      .get("/contacts/?" + qs.stringify(query))
      .then(res => {
        this.setState({ items: res.data.items as Contact[], stars: res.data.stars as number[], loading: false })
        this.forceUpdate()
      });
  };

  headerColumns = (): ColumnDef[] => [
    { label: "Name", sort_key: 'last_name' },
    { label: "Email", sort_key: 'email_personal' },
    { label: "Phone", sort_key: 'phone_mobile' },
    { label: "Address" },
    { label: '', align: 'right', className: 'action' }
  ];

  componentWillMount() {
    this.setState({ query: "", sort: undefined, reverse: false, loading: true, items: [] }, this.refresh)
  }

  setStar = (contactId: number, create: boolean) => {
    const func = create ? api.post : api.delete;
    func(`/contacts/${contactId}/star`)
      .then(res => this.setState({ stars: res.data.stars }))
  }

  setQuery = (query: string) => {
    this.setState({ query: query }, this.refresh)
  }

  setSort = (key: string) => {
    const reverse = this.state.sort === key && !this.state.reverse

    this.setState({ sort: key, reverse: reverse }, this.refresh)
  }

  renderHeader = () => (
    <DataTableHead>
      <DataTableRow>
        { this.headerColumns().map(this.renderHeaderCell) }
      </DataTableRow>
    </DataTableHead>
  );

  renderHeaderCell = (col: ColumnDef, idx: number) => {
    const sortActive = col.sort_key && col.sort_key === this.state.sort;
    const onClick = col.sort_key ? () => this.setSort(col.sort_key!) : undefined;
    const className = (col.className || '') + (col.sort_key ? ' sortable' : '') + (sortActive ? ' sorted' : '');
    const style = { textAlign: col.align || undefined, width: col.width || undefined }

    const sortIndicator = sortActive ? 
      <Icon className="sort-indicator" icon={this.state.reverse ? "keyboard_arrow_down" : "keyboard_arrow_up"} />
      : null;

    return <DataTableHeadCell
      key={idx}
      {...{ className, style, onClick }}
    >
      { col.label }
      { sortIndicator }

    </DataTableHeadCell>
  }

  renderBody = () => this.state.items.map(this.renderRow);

  renderRow = (value: Contact) => 
    <ContactRow key={value.id} value={value} onStar={this.setStar} starred={this.state.stars.indexOf(value.id) >= 0}/>

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
        { /* 
        <Button {...{tag: Link, to: '/contacts/import'}}>
          <ButtonIcon>import_export</ButtonIcon> Import from Gmail
        </Button>
        */ }
        <Fab icon="add" className="corner-fab" {...{ tag: Link, to: "/contacts/new" }}/>
      </AppFrame>
    );
  }
}
