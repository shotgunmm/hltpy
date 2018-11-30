import { Button, ButtonIcon } from '@rmwc/button';
import { List, ListItem, ListItemGraphic, ListItemMeta, ListItemPrimaryText, ListItemSecondaryText, ListItemText } from '@rmwc/list';
import TextField from '@rmwc/textfield';
import * as React from 'react';
import { RelatedItemsEditor } from './RelatedItemsEditor';
import moment = require('moment');



export default class ContactRemindersSection extends RelatedItemsEditor<Contact, ContactReminder> {
  getChildren(item: Contact) {
    return item.reminders || []
  }

  getEmptyChildValue() {
    return { id: 0, date: '', note: "", seen: false, is_active: false } as ContactReminder
  }

  getUrlForChild = (item: ContactReminder) => {
    const { value } = this.props
    if (item.id) {
      return `/contact/${value.id}/reminders/${item.id}`
    } else {
      return `/contact/${value.id}/reminders`
    }
  }

  renderRow = (reminder: ContactReminder) => {
      return <ListItem key={reminder.id} className={reminder.seen ? 'reminder-seen' : (reminder.is_active ? 'reminder-active' : '')}>
          <ListItemGraphic icon={(reminder.is_active && !reminder.seen) ? 'notifications_active' : 'notifications_none'} />
          <ListItemText>
            <ListItemPrimaryText>{reminder.note}</ListItemPrimaryText>
            <ListItemSecondaryText>{moment(reminder.date).fromNow()}</ListItemSecondaryText>
          </ListItemText>
        <ListItemMeta className="clickable" icon={reminder.seen ? null : 'check'} {...{ onClick: () => this.setReminderSeen(reminder) }}/>
        </ListItem>
  }

  renderEditor = (reminder: ContactReminder) => {
    return <ListItem key="edit">
      <TextField
        withLeadingIcon="notifications"
        style={{width: "50%"}}
        label="Remind Me to"
        value={reminder.note}
        onChange={this.setField('note')}
      />
      <TextField
        label="On"
        type="date"
        value={reminder.date}
        onChange={this.setField('date')}
      />
      <Button onClick={this.saveChild}><ButtonIcon icon="save" /> Save</Button>
    </ListItem>
  }

  renderContainer = () => {
    return <List>
      { this.renderNewEditor('top') }
      { this.renderItems() }
      { this.renderNewEditor('bottom') }
    </List>
  }

  render() { return this.baseRender() }
}