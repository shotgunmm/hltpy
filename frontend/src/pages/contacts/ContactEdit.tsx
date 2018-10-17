import { Button, ButtonIcon } from "@rmwc/button";
import { CircularProgress } from "@rmwc/circular-progress";
import { Elevation } from "@rmwc/elevation";
import { List, SimpleListItem } from "@rmwc/list";
import { TextField } from "@rmwc/textfield";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import AppFrame from "src/components/AppFrame";
import api from "src/store/api";

type FieldDescription = {
  key: string;
  label: string;
};

type Props = RouteComponentProps<{ id: string }>;

type State = {
  value: Contact
  loading: boolean
  expandedSection: string | null
  isNew: boolean
  newNote: string
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
      value: {} as Contact,
      loading: true,
      expandedSection: null,
      isNew: false,
      newNote: ''
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

  setSection = (section: string | null) => () =>
    this.setState({ expandedSection: section });

  onSetValue = (key: string) => {
    return (event: any) => {
      const { value } = this.state;
      value[key] = event.target.value;
      this.setState({ value: value });
    };
  };

  renderSection = (label: string, icon: string, fields: FieldDescription[]) => {
    const { expandedSection, value } = this.state;
    if (expandedSection !== label) {
      const setFields = fields.filter(field => value[field.key]);

      return (
        <Elevation
          key={label}
          className="contact-section"
          z={3}
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
      return (
        <Elevation key={label} className="contact-section" z={6}>
          <h3 className="mdc-typography--subtitle2">
            {label}
            <Button onClick={this.setSection(null)}>
              <ButtonIcon>save</ButtonIcon> Save
            </Button>
          </h3>
          <List>
            {fields.map(field => (
              <div key={field.key}>
                <TextField
                  style={{ width: "50%" }}
                  withLeadingIcon={icon}
                  key={field.key}
                  label={field.label}
                  value={value[field.key] || ""}
                  onChange={this.onSetValue(field.key)}
                />
              </div>
            ))}
          </List>
        </Elevation>
      );
    }
  };

  setNote = (event: any) => this.setState({newNote: event.target.value || ' ' })

  saveNote = (event: any) => {
    const { value, newNote } = this.state
    if (newNote.length > 1) {
      const events = [...(value.events || [])]
      events.push({ id: new Date().toISOString(), kind: 'note', note: newNote, field_changed: null, extra: null, value_before: null, value_after: null, created: new Date().toISOString() })
      this.setState({ value: { ...value, events }, newNote: '' })
    } else {
      this.setState({newNote: ''})
    }
  }

  renderNotesSection = () => {
    const notes = (this.state.value.events || []).filter(n => n.note);
    const { newNote } = this.state

    return (
      <Elevation className="contact-section" z={3} key="Notes">
        <h3 className="mdc-typography--subtitle2">Notes</h3>
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

  render() {
    const { loading, isNew } = this.state;

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
        </div>
        <div className="contact-body">
          {isNew &&
            this.renderSection("Name", "person", [
              { key: "first_name", label: "First Name" },
              { key: "last_name", label: "Last Name" }
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
          {this.renderNotesSection()}
        </div>
      </AppFrame>
    );
  }
}
