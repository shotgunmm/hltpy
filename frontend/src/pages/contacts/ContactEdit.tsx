import { Button, ButtonIcon } from "@rmwc/button";
import { CircularProgress } from "@rmwc/circular-progress";
import { SimpleDialog } from '@rmwc/dialog';
import { Elevation } from "@rmwc/elevation";
import { List, SimpleListItem } from "@rmwc/list";
import { TextField } from "@rmwc/textfield";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import AppFrame from "src/components/AppFrame";
import api from "src/store/api";
import ContactNotesSection from "./ContactNotesSection";
import ContactRemindersSection from "./ContactRemindersSection";
import { ContactTags } from "./ContactTags";
import ContactTeamMemberTable from "./ContactTeamMemberTable";

type FieldDescription = {
  key: string;
  label?: string;
  divider?: boolean;
  width?: number;
  icon?: string;
  link?: 'mailto' | 'href';
};

type Props = RouteComponentProps<{ id: string }>;

type State = {
  value: Contact
  changes: {}
  loading: boolean
  expandedSection: string | null
  isNew: boolean
  newNote: string
  newReminder: boolean
  reminderNote: string
  reminderDate: string
  saving: boolean
  deleteOpen: boolean
};

export default class ContactEdit extends React.Component<Props, State> {
  loadItem = (id: string) => {
    this.setState({ loading: true });
    api.get(`/contacts/${id}`).then(response =>
      this.setState({
        value: response.data.item,
        loading: false
      })
    );
  };

  componentWillMount() {
    const { id } = this.props.match.params;
    this.setState({
      value: {reminders: [], team_members: [], tags: []} as any as Contact,
      saving: false,
      loading: true,
      expandedSection: null,
      isNew: false,
      changes: {},
      newNote: '',
      newReminder: false,
      reminderNote: '',
      reminderDate: '',
      deleteOpen: false
    });

    if (id) {
      this.loadItem(id);
    } else {
      this.setState({ isNew: true, loading: false, expandedSection: "Name" });
    }
  }

  getTitle = () => {
    const { value } = this.state;
    if (value.first_name || value.last_name) {
      return `${value.first_name || ""} ${value.last_name || ""}`;
    } else {
      return "New Contact";
    }
  };

  setSection = (section: string | null) => () => {
    if (Object.keys(this.state.changes).length === 0) {
      this.setState({ expandedSection: section });
    } else {
      this.saveSection(section)
    }
  }
  

  onSetValue = (key: string) => {
    return (event: any) => {
      const { value } = this.state;
      value[key] = event.target.value;
      const changes = { ...this.state.changes, [key]: event.target.value }
      this.setState({ value: value, changes: changes });
    };
  };

  onUpdate = (value: Contact) => {
    this.setState({value: value})
  }

  saveSection = (nextSection: string | null = null, changes: {} | null = null) => {
    const { value } = this.state
    changes = changes || this.state.changes
    const url = value.id ? `/contacts/${value.id}` : '/contacts/'

    api.post(url, [changes])
      .then(response => this.setState({ value: response.data.items[0], changes: {}, expandedSection: nextSection}))
  }

  renderSection = (label: string, icon: string, fields: FieldDescription[]) => {
    const { expandedSection, value, saving } = this.state;

    if (expandedSection !== label) {
      const setFields = fields.filter(field => value[field.key]);
      return (
        <Elevation
          key={label}
          className="contact-section"
          z={1}
          onClick={this.setSection(label)}
        >
          <span className="mdc-typography--button section-header">
            {label}
          </span>
          <List>
            {setFields.map(field => {
              const attribs = {} as any
              if (field.link === 'mailto' && value[field.key]) {
                attribs.href = 'mailto:' + value[field.key];
                attribs.tag = 'a'
              }
              return <SimpleListItem
                className={field.width ? "field narrow" : "field wide"}
                key={field.key}
                graphic={field.icon}
                text={value[field.key]}
                secondaryText={field.label}
                style={{width: `${(field.width || 100) - 5}%`}}
                { ...attribs }
              />
            })}
            {setFields.length === 0 && (
              <SimpleListItem
                key={label}
                graphic={icon}
                secondaryText={`Click to edit`}
              />
            )}
          </List>
        </Elevation>
      );
    } else {

      return (
        <Elevation key={label} className="contact-section contact-section-edit" z={6}>
          <span className="mdc-typography--button section-header">
            {label}
          </span>
          <Button raised onClick={() => this.saveSection()}>
            Save
          </Button>
          {saving ? <CircularProgress /> :
            <List>
              {fields.map(field => {
                if (field.divider) {
                  return <div className="full-width" key={field.key} />
                } else {
                  return <div key={field.key}
                    className={field.width ? "field narrow" : "field wide"}
                    style={{ width: field.width ? `${field.width * 0.8}%` : "80%" }}
                  >
                    <TextField
                      style={{ width: "100%" }}
                      withLeadingIcon={field.icon}
                      key={field.key}
                      label={field.label}
                      value={value[field.key] || ""}
                      onChange={this.onSetValue(field.key)}
                    />
                  </div>
                }
              })}
            </List>
          }
        </Elevation>
      );
    }
  };

  showDelete = () => {
    this.setState({ deleteOpen: true })
  }
  submitDelete = (evt: any) => {
    const { value } = this.state
    const { history } = this.props

    if (evt.detail.action === 'accept') {
      // delete the user
      api.delete(`/contacts/${value.id}`)
        .then(() => {
          history.push('/contacts')
      })
    } else {
      this.setState({deleteOpen: false})
    }
  }

  renderDelete = () => {
    const { value, deleteOpen } = this.state
    if (value.id) {
      return [
        <Button key="btn" onClick={this.showDelete} theme="error">
          <ButtonIcon icon="delete" /> Delete
        </Button>,
        <SimpleDialog key="dialog"
          body="Are you sure you want to delete this contact?"
          open={deleteOpen}
          onClose={this.submitDelete}
        />
      ]
    } else {
      return []
    }
  }

  renderOpenHouse = () => {
    const { open_house } = this.state.value
    if (open_house) {
      return <Elevation className="contact-section" z={3}>
        <List>
          <SimpleListItem graphic="home">Visited <strong>{open_house.name}</strong></SimpleListItem>
        </List>
      </Elevation>
    } else {
      return null;
    }
  }

  render() {
    const { loading, value } = this.state;

    if (loading) {
      return (
        <AppFrame>
          <CircularProgress />
        </AppFrame>
      );
    }

    return (
      <AppFrame bodyClass="primary grey">
        <div className="contact-header">
          <h1 className="mdc-typography--headline4">{this.getTitle()}</h1>
          <ContactTags value={value} onUpdate={this.onUpdate} />
        </div>
        <div className="contact-body">
            {this.renderSection('Person', 'person', [
              { key: 'first_name', label: 'First Name', width: 50, icon: 'person' },
              { key: 'last_name', label: 'Last Name', width: 50, icon: 'person' },
              { key: 'company', label: 'Company', width: 100, icon: 'business' },
              { divider: true, key: 'div1' },
              { key: 'email_work', label: 'Work', link: 'mailto', width: 50, icon: 'email' },
              { key: 'email_personal', label: 'Personal', link: 'mailto', width: 50, icon: 'email' },
              { divider: true, key: 'div2' },
              { key: 'phone_work', label: 'Work Phone', width: 40, icon: 'phone' },
              { key: 'phone_work_extension', label: 'Extension', width: 10 },
              { key: 'phone_mobile', label: 'Mobile', width: 50, icon: 'phone' },
              { key: 'phone_home', label: 'Home', width: 50, icon: 'phone' },
              { key: 'phone_times', label: 'Best time to call', width: 50, icon: 'phone' },
              { divider: true, key: 'div3' },
              { key: 'address_street', label: 'Street Address', icon: 'location_on' },
              { key: 'address_city', label: 'City', width: 50, icon: 'location_on' },
              { key: 'address_state', label: 'State', width: 20, icon: 'location_on' },
              { key: 'address_zip', label: 'Zip', width: 30, icon: 'location_on' }
            ])}

          <ContactRemindersSection value={value} onUpdate={this.onUpdate} />

          <ContactNotesSection value={value} onUpdate={this.onUpdate} />

          { this.renderOpenHouse() }

          <ContactTeamMemberTable contact={value} onUpdate={this.onUpdate} />

          {this.renderDelete()}
        </div>
      </AppFrame>
    );
  }
}
