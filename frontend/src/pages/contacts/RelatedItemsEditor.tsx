import Button, { ButtonIcon } from '@rmwc/button';
import { DataTable, DataTableBody, DataTableCell, DataTableContent, DataTableRow } from '@rmwc/data-table';
import Elevation from '@rmwc/elevation';
import * as React from 'react';
import api from 'src/store/api';

type IdObject = { id: number | string }
type Props<Parent, Child> = {
  value: Parent
  onUpdate: (value: Parent) => void
}

type State<Parent, Child> = {
  newItem: boolean
  editedItem: Child | null
  changes: {}
}

export abstract class RelatedItemsEditor<Parent extends IdObject, Child extends IdObject> extends React.Component<Props<Parent, Child>, State<Parent, Child>> {
  getCssClass() { return "contact-section " + this.constructor.name }

  abstract getSectionLabel(): string
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

  startEdit = (item: Child | null) => {
    const value = item || this.getEmptyChildValue()
    this.setState({editedItem: value, newItem: item == null})
  }

  updateChild = (item: Child, changes: {}) => {
    const url = this.getUrlForChild(item!)
    const { onUpdate } = this.props

    return api.post(url, changes)
      .then(response => {
        onUpdate(response.data.item)
      })
  }
  saveChild = () => {
    const item = this.state.editedItem!
    const { changes } = this.state
    this.updateChild(item, changes)
      .then(() => this.setState({ editedItem: null, changes: {}, newItem: false}))
  }

  deleteChild = (item: Child) => {
    const { onUpdate } = this.props
    if (item.id) {
      api.delete(this.getUrlForChild(item))
        .then(response => 
          onUpdate(response.data.item)
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
    return <DataTable className="inner-table">
      <DataTableContent>
      {this.renderTableHeader()}
      <DataTableBody>
        { this.renderNewEditor('top') }
        { this.renderItems() }
        { this.renderNewEditor('bottom') }
        </DataTableBody>
      </DataTableContent>
    </DataTable>
  }

  renderNewButton = () => 
    <DataTableRow>
      <DataTableCell>
        <Button onClick={() => this.startEdit(null)}><ButtonIcon icon="create" /> Add</Button>
      </DataTableCell>
    </DataTableRow> 

  setField = (field: keyof Child) => (evt: any) => {
    console.log(evt)
    const { changes } = this.state
    const editedItem = this.state.editedItem as object
    const newItem = { ...editedItem, [field]: evt.target.value }
    const newChanges = { ...changes, [field]: evt.target.value }
    this.setState({editedItem: newItem as Child, changes: newChanges})
  }
  

  renderNewEditor = (position: 'top' | 'bottom') => {
    const { editedItem, newItem } = this.state

    if (position === this.getNewEditorPosition()) {
      if (editedItem && newItem) {
        return this.renderEditor(editedItem);
      } else if (!editedItem) {
        return this.renderNewButton();
      }
    }

    return []
  }


  baseRender = () => {
    return <Elevation z={1} className={this.getCssClass()}>
      <span className="mdc-typography--button">
        { this.getSectionLabel() }
      </span>

      { this.renderContainer() }
    </Elevation>
  }
}
 