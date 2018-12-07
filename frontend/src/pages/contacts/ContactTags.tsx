import { Chip, ChipSet } from '@rmwc/chip';
import { SimpleDialog } from '@rmwc/dialog';
import TextField from '@rmwc/textfield';
import * as React from 'react';
import api from 'src/store/api';
type Props = {
  value: Contact
  onUpdate: (contact: Contact) => void
}

type State = {
  showDialog: boolean
  newTagValue: string
}

export class ContactTags extends React.Component<Props, State> {
  componentWillMount() {
    this.setState({showDialog: false, newTagValue: ""})
  }

  newTag = () => {
    this.setState({showDialog: true, newTagValue: ""})
  }

  saveTag = () => {
    const { newTagValue } = this.state
    const { value, onUpdate } = this.props

    api
      .post(`/contacts/${value.id}/tags`, {tag: newTagValue})
      .then(response => {
        onUpdate(response.data.item)
        this.setState({showDialog: false})
      })
  }

  setTagName = (evt: any) => {
    this.setState({newTagValue: evt.target.value})
  }

  deleteTag = (tag: ContactTag) => { 
    const { value, onUpdate } = this.props
    api
      .delete(`/contacts/${value.id}/tags/${tag.id}`)
      .then(response => onUpdate(response.data.item))
  }

  render() {
    const { value } = this.props
    const { newTagValue, showDialog } = this.state

    return <div>
        <ChipSet>
        {value.tags.map(tag =>
          <Chip key={tag.id} trailingIcon="close">{tag.tag}</Chip>
        )}
        <Chip leadingIcon="create" onClick={() => this.newTag()} key="_create"/>
      </ChipSet>
      <SimpleDialog
        open={showDialog}
        title="Add Tag"
        body={<TextField onChange={this.setTagName} value={newTagValue} label="Tag Name" />}
        acceptLabel="Save"
        onClose={this.saveTag}
        />
    </div>
  }

}