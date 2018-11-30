type Contact = {
  id: number
  first_name: string
  last_name: string
  state: string
  phone_mobile: string
  phone_home: string
  phone_work: string
  phone_times: string
  email_personal: string
  email_work: string
  address_street: string
  address_city: string
  address_state: string
  address_zip: string
  workplace: string
  position: string
  created: string
  updated: string
  open_house: OpenHouse
  events: ContactEvent[] | null
  reminders: ContactReminder[] | null
  reminder_due: ContactReminder | null
  team_members: ContactTeamMember[]
}

type ContactEvent = {
  id: string
  kind: string
  field_changed: string | null
  value_before: string | null
  value_after: string | null
  note: string 
  extra: any | null
  created: string
}


type ContactReminder = {
  id: number
  date: string
  note: string
  seen: boolean
  is_active: boolean
}

type ContactTeamMember = {
  id: number 
  name: string
  role: string
  company: string
  phone_number: string
  email: string
  note: string
}