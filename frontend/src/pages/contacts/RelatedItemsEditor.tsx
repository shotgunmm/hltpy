import Button, { ButtonIcon } from '@rmwc/button';
import { DataTable, DataTableBody, DataTableCell, DataTableRow } from '@rmwc/data-table';
import Elevation from '@rmwc/elevation';
import * as React from 'react';
import api from 'src/store/api';

type IdObject = { id: number | string }
type Props<Parent, Child> = {
  value: Parent
  onUpdate: (value: Parent) => void
  label: string
}

type State<Parent, Child> = {
  newItem: boolean
  editedItem: Child | null
  changes: {}
}

export abstract class RelatedItemsEditor<Parent extends IdObject, Child extends IdObject> extends React.Component<Props<Parent, Child>, State<Parent, Child>> {
  getCssClass() { return "contact-section " + this.constructor.name }
  abstract getChildren(item: Parent): Child[]
  abstract getEmptyChildValue(): Child
  abstract getUrlForChild(item: Child): string

  abstract renderRow(value: Child): React.ReactFragment
  abstract renderEditor(value: Child): React.ReactFragment

  getNewEditorPosition() { return 'top' }

  componentWillMount() {
    this.setState({ newItem: false, editedItem: null, changes: {}})
  }

  renderTableHeader = (): React.ReactFragment => {
    return [];
  }

  startEdit = (item: Child | null) {
    const value = item || this.getEmptyChildValue()
    this.setState({editedItem: value, newItem: item == null})
  }

  updateChild = (item: Child, changes: {}) => {
    const url = this.getUrlForChild(item!)
    const { onUpdate } = this.props

    return api.post(url, changes)
      .then(response => {
        onUpdate(response.data)
      })
  }
  saveChild = () => {
    const item = this.state.editedItem!
    const { changes } = this.state
    this.updateChild(item, changes)
      .then(() => this.setState({ editedItem: null, changes: {}, newItem: false}))
  }

  deleteChild = (item: Child) => {
    const { value, onUpdate } = this.props
    if (item.id) {
      api.delete(this.getUrlForChild(item))
        .then(response => 
          onUpdate(response.data)
        )
    }
  }

  renderItems = () => {
    const { value } = this.props
    const { editedItem } = this.state
    return this.getChildren(value).map(m => {
      if (editedItem && editedItem.id === m.id) {
        return this.renderEditor(editedItem)
      } else {
        return this.renderRow(m)
      }
    })
  }
  renderContainer = () => {
    const { value } = this.props
    if (this.getChildren(value).length) {
      return <DataTable className="inner-table">
        {this.renderTableHeader()}
        <DataTableBody>
          { this.renderNewEditor('top') }
          { this.renderItems() }
          { this.renderNewEditor('bottom') }
        </DataTableBody>

      </DataTable>
    } else {
      return []
    }
  }

  renderNewButton = () => 
    <DataTableRow>
      <DataTableCell>
        <Button onClick={() => this.startEdit(null)}><ButtonIcon icon="create" /> Add</Button>
      </DataTableCell>
    </DataTableRow> 

  setField = (field: keyof Child) => (evt: any) => {
    const { changes } = this.state
    const editedItem = this.state.editedItem as object
    const newItem = { ...editedItem, [field]: evt.target.value }
    const newChanges = { ...changes, [field]: evt.target.value }
    this.setState({editedItem: newItem as Child, changes: newChanges})
  }
  

  renderNewEditor = (position: 'top' | 'bottom') => {
    const { editedItem } = this.state

    if (position === this.getNewEditorPosition() && !editedItem) {
      return this.renderNewButton();
    } else {
      return [];
    }
  }


  baseRender = () => {
    const { label } = this.props
    const { editedItem } = this.state

    return <Elevation z={1} className={this.getCssClass()}>
      <span className="mdc-typography--button">
        { label }
      </span>

      { this.renderContainer() }
    </Elevation>
  }
}
 