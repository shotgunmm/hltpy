import { DataTableCell, DataTableRow } from "@rmwc/data-table";
import Icon from "@rmwc/icon";
import IconButton from "@rmwc/icon-button";
import * as React from "react";
import { Link } from "react-router-dom";

type Props = {
  value: Contact
  onStar: (id: number, star: boolean) => void
  starred: boolean
}

type State = {
  highlight: boolean
}

export default class ContactRow extends React.Component<Props, State> {
  componentWillMount() {
    this.setState({highlight: false})
  }

  render() {
    const { value, onStar, starred } = this.props
    const { highlight } = this.state

    return <DataTableRow key={value.id} onMouseEnter={() => this.setState({highlight: true})} onMouseLeave={() => this.setState({highlight: false})}> 
      <DataTableCell>
        {value.first_name} {value.last_name}
        <div className="tag-set">
          {value.tags.map(tag => <span className="tag" key={tag.id}>{tag.tag}</span>)}
        </div>
      </DataTableCell>
      <DataTableCell>
        <a href={"mailto:" + (value.email_personal || value.email_work)}>{ value.email_personal || value.email_work }</a>
      </DataTableCell>
      <DataTableCell>
        {value.phone_mobile || value.phone_home || value.phone_work}
      </DataTableCell>
      <DataTableCell>
        {value.address_street && `${value.address_street}, ${value.address_city}`}
      </DataTableCell>
      <DataTableCell className="action-col">
        { starred &&
          <Icon icon="star" className="favorite" onClick={() => onStar(value.id, false)} /> }
        { highlight && !starred && 
          <Icon icon="star_border" className="favorite" onClick={() => onStar(value.id, true) } />
        }
        { highlight &&
          <IconButton icon="edit" {...{ tag: Link, to: `/contacts/${value.id}` }} />
        }
        {value.reminder_due &&
          <Icon icon="notifications_active" className="favorite" /> }
      </DataTableCell>
    </DataTableRow>
  }
}