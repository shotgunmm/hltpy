import { CircularProgress } from "@material-ui/core";
import Button, { ButtonIcon } from "@rmwc/button";
import { Checkbox } from "@rmwc/checkbox";
import { DataTable, DataTableBody, DataTableCell, DataTableContent, DataTableHead, DataTableHeadCell, DataTableRow } from "@rmwc/data-table";
import { SimpleDialog } from "@rmwc/dialog";
import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import AppFrame from "src/components/AppFrame";
import api from "src/store/api";

type Props = RouteComponentProps<{}>;

type State = {
  loading: boolean
  authorized: boolean
  checkedIds: number[]
  contacts: Contact[]
}
export default class ContactImport extends React.Component<Props, State> {
  componentWillMount() {
    this.setState({loading: true})
    api
      .get("contacts/import")
      .then(res => 
        this.setState({loading: false, authorized: res.data.authorized, contacts: res.data.contacts as Contact[], checkedIds: []})
      )
  }

  onAuthorizeSubmit = (evt: any) => {
    if (evt.detail.action === 'accept') {
      window.location.href = '/dashboard/contacts/import/auth';
    } else {
      window.location.href = '/dashboard/contacts';
    }
  }

  setChecked = (idx: number) => {
    let { checkedIds } = this.state
    if (checkedIds.indexOf(idx) === -1) {
      console.log("check", idx)
      checkedIds = checkedIds.concat([idx])
    } else {
      console.log("uncheck", idx)
      checkedIds = checkedIds.filter(n => n !== idx)
    }
    console.log(checkedIds)
    this.setState({checkedIds: checkedIds})
  }

  uploadContacts = () => {
    const { contacts, checkedIds } = this.state
    const selectedContacts = checkedIds.map(idx => contacts[idx])
    const { history } = this.props

    api
      .post("/contacts", selectedContacts)
      .then(() => history.push('/contacts'))
  }

  render() {
    const { loading, authorized, contacts, checkedIds } = this.state 
    
    let content = <div />

    if (loading) {
      content = <CircularProgress />
    } else if (!authorized) {
      content = <SimpleDialog key="dialog"
          title="Authorize Google Import"
          body="In order to allow import from Google Contacts, you will need provide a one-time authorization to Human Life Technologies to access your contact data. Would you like to proceed?"
          open={true}
          onClose={this.onAuthorizeSubmit}
        />
    } else {
      content = <div>
        <p>
          <Button raised onClick={() => this.uploadContacts()}>
            <ButtonIcon>save</ButtonIcon> Import Selected
          </Button>
        </p>
        <DataTable>
        <DataTableContent>
          <DataTableHead>
            <DataTableRow>
              <DataTableHeadCell />
              <DataTableHeadCell>Name</DataTableHeadCell>
              <DataTableHeadCell>Email</DataTableHeadCell>
              <DataTableHeadCell>Phone</DataTableHeadCell>
            </DataTableRow>
          </DataTableHead>
          <DataTableBody>
            {contacts.map((contact, idx) => 
              <DataTableRow key={idx}>
                <DataTableCell>
                  <Checkbox
                      checked={checkedIds.indexOf(idx) >= 0}
                    onChange={() => this.setChecked(idx)}
                  />
                </DataTableCell>
                <DataTableCell>
                  { contact.first_name } { contact.last_name }
                </DataTableCell>
                <DataTableCell>
                  { contact.email_personal }
                </DataTableCell>
                <DataTableCell>
                  { contact.phone_mobile }
                </DataTableCell>
              </DataTableRow>
            )}
          </DataTableBody>
        </DataTableContent>
        </DataTable>
      </div>
    }

    return <AppFrame bodyClass="secondary">
      <h1 className="mdc-typography--headline4">Contact Import</h1>

      { content }
    </AppFrame>

  }
}