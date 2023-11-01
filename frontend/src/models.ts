export type EventForm = {
  date: string;
  name: string;
  mailTemplate: string;
};
export type Event = EventForm & { uid: string; mailSent: boolean };

export type Participant = {
  uid: string;
  event_uid: string;
  sciper: String;
  email: String;
  first_name: String;
  surname: String;
  group?: string;
  has_checked_in: boolean;
};
