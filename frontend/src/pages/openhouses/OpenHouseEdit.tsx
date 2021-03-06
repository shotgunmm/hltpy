import { Button, ButtonIcon } from "@rmwc/button";
import { CircularProgress } from "@rmwc/circular-progress";
import { Elevation } from "@rmwc/elevation";
import { List } from "@rmwc/list";
import { TextField } from "@rmwc/textfield";
import { DateTime } from 'luxon';
import { DatePicker, TimePicker } from 'material-ui-pickers';
import * as React from "react";
import { RouteComponentProps } from "react-router";
import AppFrame from "src/components/AppFrame";
import api from "src/store/api";


type FieldDesc = {
  key: string,
  label: string,
  type?: string,
  options?: any
}
type Props = RouteComponentProps<{ id: string }>;

type State = {
  value: OpenHouse;
  changes: {}
  isNew: boolean
  loading: boolean
};

export default class OpenHouseEdit extends React.Component<Props, State> {
  loadItem = (id: string) => {
    this.setState({ loading: true });
    api.get(`/openhouses/${id}`).then(response =>
      this.setState({
        value: response.data.item,
        loading: false
      })
    );
  };

  componentWillMount() {
    const { id } = this.props.match.params;
    this.setState({
      value: {} as OpenHouse,
      loading: true,
      isNew: false,
      changes: {},
    });
    if (id) {
      this.loadItem(id);
    } else {
      this.setState({ isNew: true, loading: false });
    }
  }

  onSetValue = (field: string) => (e: any) => {
    if (e.target) {
      e = e.target
    }
    if (e.value !== undefined) {
      e = e.value
    }

    const { value, changes } = this.state

    let changeValue = e
    console.log(e)

    if (field === "start_time" || field === "end_time") {
      changeValue = e.toFormat("HH:mm:ss")
    } else if (field === "date") {
      changeValue = e.toISODate("YYYY-M-d")
    }
    this.setState({value: { ...value, [field]: e }, changes: { ...changes, [field]: changeValue}})
  }

  save = () => {
    const { value, changes } = this.state
    const { history } = this.props
    const url = value.id ? `/openhouses/${value.id}`: `/openhouses`
    api.post(url, changes)
      .then(response => {
        if (response.data.success) {
          this.setState({ value: response.data.item, changes: [] })
          history.push('/openhouses')
        } else {
          alert(response.data.errors)
        }
      })
  }

  renderSection = (title: string, fields: FieldDesc[]) => {
    const { value } = this.state

    return <Elevation key={title} className="contact-section"
      z={1}
    >
      <span className="mdc-typography--button">{title}</span>
      <List>
      {fields.map((field: FieldDesc) => {
        const type = field.type || "text"
        const options = field.options || {}
        let result = <div />;

        if (type === "text" || type === "number") {
          result = <TextField
            style={{ width: "50%" }}
            key={field.key}
            type={type}
            label={field.label}
            value={value[field.key] || ""}
            onChange={this.onSetValue(field.key)}
            {...options}
          />
        } else if (type === "date") {
          result = <DatePicker
            key={field.key}
            label={field.label}
            value={value[field.key] || null}
            onChange={this.onSetValue(field.key)}
            {...options}
          />
        } else if (type === "time") {
          const fieldValue = DateTime.fromISO(value[field.key]) || undefined
          result = <TimePicker
            key={field.key}
            label={field.label}
            value={fieldValue}
            onChange={this.onSetValue(field.key)}
            {...options}
          />
        } else if (type === "file") {
          result = <TextField
            key={field.key}
            label={field.label}
            type="file"
            onChange={this.onSetValue(field.key)}
            {...options}
          />
        } 
        return <div key={field.key}>{result}</div>
      })}
      </List>
    </Elevation>
  }

  getTitle = () => {
    const { value } = this.state
    return value.name || "New Open House"
  }
  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <AppFrame>
          <CircularProgress />
        </AppFrame>
      )
    } 

    return <AppFrame>
      <div className="contact-header">
        <h1 className="mdc-typography--headline4">{this.getTitle()}</h1>
      </div>
      <div className="contact-body">
        <Button raised onClick={() => this.save()}>
          <ButtonIcon>save</ButtonIcon> Save
        </Button>
        {this.renderSection("Description", [
          { key: 'name', label: 'Name' },
          { key: 'address', label: 'Address' },
          { key: 'list_price', label: 'List Price', type: 'number', options: {withLeadingIcon: "attach_money"} },
          { key: 'mls_id', label: 'MLS #' },
        ])}
        {this.renderSection("When", [
          { key: 'date', label: 'Date', type: 'date' },
          { key: 'start_time', label: 'Start Time', type: 'time' },
          { key: 'end_time', label: 'End Time', type: 'time' },
        ])}
        {this.renderSection("Attachments", [
          { key: 'image', label: '', type: 'file' }
          ])}
        <Button raised onClick={() => this.save()}>
          <ButtonIcon>save</ButtonIcon> Save
        </Button>
      </div>
      </AppFrame>
  }
}

/*
  componentWillMount() {
    const { id } = this.props.match.params;
    this.setState({
      value: {} as Contact,
      saving: false,
      loading: true,
      expandedSection: null,
      isNew: false,
      changes: {},
      newNote: '',
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


  saveSection = (nextSection: string | null = null) => {
    const { value, changes } = this.state
    const url = value.id ? `/contacts/${value.id}` : '/contacts'

    api.post(url, changes)
      .then(response => this.setState({value: response.data.item, changes: [], expandedSection: nextSection}))
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
          <List>
            {setFields.map(field => (
              <SimpleListItem
                key={field.key}
                graphic={icon}
                text={value[field.key]}
                secondaryText={field.label}
              />
            ))}
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

      let lastValueSet = true;

      return (
        <Elevation key={label} className="contact-section contact-section-edit" z={6}>
          <span className="mdc-typography--button">
            {label}
          </span>
          <Button onClick={() => this.saveSection()}>
            <ButtonIcon>save</ButtonIcon> Save
          </Button>
          {saving ? <CircularProgress /> :
            <List>
              {fields.map(field => {
                if (!lastValueSet) {
                  return []
                } else {
                  lastValueSet = !!value[field.key]

                  return <div key={field.key}>
                    <TextField
                      style={{ width: "50%" }}
                      withLeadingIcon={icon}
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

  setNote = (event: any) => this.setState({newNote: event.target.value || ' ' })

  saveNote = (event: any) => {
    const { value, newNote } = this.state
    if (!value.id) {
      alert("Please save this contact before creating a note.");
      return;
    }
    if (newNote.length > 1) {
      api.post(`/contacts/${value.id}`, { note: newNote })
        .then(response => this.setState({value: response.data.item, newNote: ''}))
    } else {
      this.setState({newNote: ''})
    }
  }

  renderNotesSection = () => {
    const notes = (this.state.value.events || []).filter(n => n.note);
    const { newNote } = this.state

    return (
      <Elevation className="contact-section" z={3} key="Notes">
        <span className="mdc-typography--button">
          Notes
        </span>
        <List>
          {!newNote && <SimpleListItem
            key="new"
            graphic="note"
            secondaryText="Click to write a note..."
            onClick={this.setNote}
          />}
          {newNote && <TextField
            textarea
            label="New Note"
            value={newNote}
            onChange={this.setNote}
          />}
          { newNote && <Button onClick={this.saveNote}>
              <ButtonIcon>save</ButtonIcon> Save
            </Button>
          }
          {notes.map(note => (
            <SimpleListItem
              key={note.id}
              graphic="note"
              text={note.note}
              secondaryText={new Date(note.created).toLocaleDateString()}
            />
          ))}
        </List>
      </Elevation>
    );
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

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <AppFrame>
          <CircularProgress />
        </AppFrame>
      );
    }

    return (
      <AppFrame>
        <div className="contact-header">
          <h1 className="mdc-typography--headline4">{this.getTitle()}</h1>
          <SimpleChip leadingIcon="email" text="Email" />
        </div>
        <div className="contact-body">
            {this.renderSection("Person", "person", [
              { key: "first_name", label: "First Name" },
              { key: "last_name", label: "Last Name" },
              { key: "company", label: "Company" },
              { key: "buyer_name", label: "On Behalf Of" },
            ])}

          {this.renderSection("Email", "email", [
            { key: "email_personal", label: "Personal" },
            { key: "email_work", label: "Work" }
          ])}
          {this.renderSection("Phone", "phone", [
            { key: "phone_mobile", label: "Mobile" },
            { key: "phone_home", label: "Home" },
            { key: "phone_times", label: "Best time to call" }
          ])}
          {this.renderSection("Home Address", "location_on", [
            { key: "address_street", label: "Street Address" },
            { key: "address_city", label: "City" },
            { key: "address_state", label: "State" },
            { key: "address_zip", label: "Zip" }
          ])}
          {this.renderSection("Mortgage", "attach_money", [
            { key: "mortgage_broker", label: "Mortgage Broker" },
            { key: "mortgage_company", label: "Mortgage Company" },
          ])}
          {this.renderNotesSection()}
          {this.renderDelete()}
        </div>
      </AppFrame>
    );
  }
}
*/