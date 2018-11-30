import Button from "@rmwc/button";
import { DataTable, DataTableBody, DataTableCell, DataTableContent, DataTableRow } from "@rmwc/data-table";
import { Elevation } from "@rmwc/elevation";
import Icon from "@rmwc/icon";
import { IconButton } from "@rmwc/icon-button";
import { Select } from '@rmwc/select';
import TextField from "@rmwc/textfield";
import * as React from 'react';
import api from "src/store/api";

type Props = {
  contact: Contact
  onUpdate: (contact: Contact) => void
}

type State = {
  newMember: boolean
  editingMember: ContactTeamMember | null
  changes: {}
}

const ROLE_CHOICES = ['Mortage Broker', 'Agent', 'Estimator', 'Technician']

export default class ContactTeamMemberTable extends React.Component<Props, State> {
  componentWillMount() {
    this.setState({ newMember: false, editingMember: null, changes: {}})
  }

  startEdit = (member: ContactTeamMember | null) => {
    const value = member || { id: null, name: "", role: "Agent", company: "", phone_number: "", email: "", note: "" } as any as ContactTeamMember
    this.setState({editingMember: value, newMember: member == null})
  }

  setField = (field: keyof ContactTeamMember) => (evt: any) => {
    const member = { ...this.state.editingMember, [field]: evt.target.value } as ContactTeamMember
    const changes = { ...this.state.changes, [field]: evt.target.value }
    this.setState({editingMember: member, changes: changes})
  }

  saveMember = () => {
    const member = this.state.editingMember
    const { changes } = this.state
    const { contact, onUpdate } = this.props

    const url = `/contacts/${contact.id}/members` + (member && member.id ? `/${member.id}` : "")

    api.post(url, changes)
      .then(response => {
        onUpdate(response.data.item)
        this.setState({ editingMember: null, changes: {}, newMember: false })
      })
  }

  deleteMember = (member: ContactTeamMember) => {
    const { contact, onUpdate } = this.props
    if (member.id) {
      api.delete(`/contacts/${contact.id}/members/${member.id}`)
        .then(response => {
          onUpdate(response.data.item)
        })

    }
  }

  renderRow = (member: ContactTeamMember) => {
    return <DataTableRow key={member.id}>
      <DataTableCell width={15}>
        <Icon icon="group" />
      </DataTableCell>
      <DataTableCell>
        <b>{ member.role }</b>
      </DataTableCell>
      <DataTableCell>
        { member.name }
      </DataTableCell>
      <DataTableCell>
        { member.company }
      </DataTableCell>
      <DataTableCell>
        { member.email} 
      </DataTableCell>
      <DataTableCell>
        { member.phone_number }
      </DataTableCell>
      <DataTableCell>
        {member.id && <IconButton icon="edit" onClick={() => this.startEdit(member)} />}
        {member.id && <IconButton icon="delete" onClick={() => this.deleteMember(member)} />}
      </DataTableCell>
    </DataTableRow>
  }

  renderEditor = (member: ContactTeamMember) => {
    return <DataTableRow key={member.id}>
      <DataTableCell />
      <DataTableCell>
        <Select outlined label="Role" options={ROLE_CHOICES} value={member.role} onChange={this.setField('role')}/>
      </DataTableCell>
      <DataTableCell>
        <TextField outlined label="Name" value={member.name} onChange={this.setField('name')} />
      </DataTableCell>
      <DataTableCell>
        <TextField outlined label="Company" value={member.company} onChange={this.setField('company')} />
      </DataTableCell>
      <DataTableCell>
        <TextField outlined label="Email" value={member.email} onChange={this.setField('email')} />
      </DataTableCell>
      <DataTableCell>
        <TextField outlined label="Phone Number" value={member.phone_number} onChange={this.setField('phone_number')} />
      </DataTableCell>
      <DataTableCell>
        <Button raised onClick={() => this.saveMember()}>Save</Button>
      </DataTableCell>
    </DataTableRow>
  }


  render() {
    const { contact } = this.props
    const { newMember, editingMember } = this.state

    return <Elevation z={1} className="contact-section team-members">
      <span className="mdc-typography--button">
        Customer Team Members 
      </span>

      {contact.team_members !== [] &&
        <DataTable className="inner-table">
          <DataTableContent>
            <DataTableBody>
              {contact.team_members.map(m => {
                if (editingMember && editingMember.id === m.id) {
                  return this.renderEditor(editingMember);
                } else {
                  return this.renderRow(m)
                }
              })}
              {newMember && this.renderEditor(editingMember!)}
            </DataTableBody>
          </DataTableContent>
        </DataTable>
      }
      { !editingMember && <IconButton icon="group_add" onClick={() => this.startEdit(null)} /> }
    </Elevation>
  }
}