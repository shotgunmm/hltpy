import Button, { ButtonIcon } from "@rmwc/button";
import Checkbox from "@rmwc/checkbox";
import { DataTableCell, DataTableRow } from "@rmwc/data-table";
import Icon from "@rmwc/icon";
import IconButton from "@rmwc/icon-button";
import TextField from "@rmwc/textfield";
import * as moment from 'moment';
import * as React from "react";
import MultiLineText from "src/components/MultiLineText";
import { RelatedItemsEditor } from "./RelatedItemsEditor";

export default class ContactNotesSection extends RelatedItemsEditor<Contact, ContactNote> {
  getSectionLabel() { return 'Notes' }
  getChildren(item: Contact) {
    return item.notes || []
  }

  getEmptyChildValue() {
    return {id: 0, text: '', shared: false} as ContactNote
  }

  getUrlForChild = (item: ContactNote) => {
    const { value } = this.props
    if (item.id) {
      return `/contacts/${value.id}/notes/${item.id}`
    } else {
      return `/contacts/${value.id}/notes`
    }
  }
  renderRow = (value: ContactNote) => {
    return <DataTableRow key={value.id}>
      <DataTableCell className="icon-col"><Icon icon="note" /></DataTableCell>
      <DataTableCell width="70%"><MultiLineText value={value.text} /></DataTableCell>
      <DataTableCell className="dateline">
        {moment(value.created).fromNow()}
        <br />{value.shared ? "Public" : "Private"}
        <br />
        <IconButton icon="edit" onClick={() => this.startEdit(value)} />
      </DataTableCell>
    </DataTableRow>
  }
  renderEditor = (value: ContactNote) => {
    return <DataTableRow key={value.id} className="table-editor">
      <DataTableCell className="icon-col"><Icon icon="note" /></DataTableCell>
      <DataTableCell width="70%">
        <TextField textarea label="Note Text" value={value.text} onChange={this.setField('text')} />
      </DataTableCell>
      <DataTableCell className="dateline">
        <Button raised onClick={this.saveChild}><ButtonIcon icon="save" />Save</Button>
        <br /> <br />
        <Checkbox label="Share note with team members" checked={value.shared} onChange={this.setField('shared')} />
      </DataTableCell>
    </DataTableRow>
  }

  renderNewButton = () => {
    return <DataTableRow className="new-button" onClick={() => this.startEdit(null)}>
      <DataTableCell className="icon-col"><Icon icon="note" /></DataTableCell>
      <DataTableCell>
        Create a note...
      </DataTableCell>
    </DataTableRow>
  }

  render() { return this.baseRender() }
}