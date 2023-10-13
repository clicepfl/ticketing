CREATE TABLE events (
  uid uuid NOT NULL DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  date date NOT NULL,
  CONSTRAINT event_pk PRIMARY KEY (uid)
);

CREATE TABLE participants (
  uid uuid NOT NULL DEFAULT gen_random_uuid(),
  event_uid uuid NOT NULL,
  sciper varchar(10) NOT NULL,
  email varchar(100) NOT NULL,
  first_name varchar(50) NOT NULL,
  surname varchar(50) NOT NULL,
  CONSTRAINT participant_pk PRIMARY KEY (uid)
);

ALTER TABLE participants
ADD CONSTRAINT participant_event_fk FOREIGN KEY (event_uid) REFERENCES public.events (uid) MATCH SIMPLE ON DELETE CASCADE ON UPDATE CASCADE;