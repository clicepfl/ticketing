export type EventForm = {
  date: string;
  name: string;
  mailTemplate?: string;
};
export type Event = EventForm & { uid: string; mailSent: boolean };

export type Participant = {
  uid: string;
  eventUid: string;
  email: string;
  firstName: string;
  surname: string;
  group?: string;
  hasCheckedIn: boolean;
};

export type Error = { status: number; description?: string };
