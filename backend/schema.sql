ALTER TABLE IF EXISTS participants DROP CONSTRAINT IF EXISTS participant_event_fk;
DROP TABLE IF EXISTS participants;
DROP TABLE IF EXISTS events;


CREATE TABLE events (
  "uid" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" varchar(100) NOT NULL,
  "date" date NOT NULL,
  "mail_sent" boolean NOT NULL DEFAULT false,
  CONSTRAINT event_pk PRIMARY KEY (uid)
);

CREATE TABLE participants (
  "uid" uuid NOT NULL DEFAULT gen_random_uuid(),
  "event_uid" uuid NOT NULL,
  "sciper" varchar(10) NOT NULL,
  "email" varchar(100) NOT NULL,
  "first_name" varchar(50) NOT NULL,
  "surname" varchar(50) NOT NULL,
  "group" varchar(50),
  "has_checked_in" boolean NOT NULL DEFAULT false,
  CONSTRAINT participant_pk PRIMARY KEY (uid)
);

ALTER TABLE participants
ADD CONSTRAINT participant_event_fk FOREIGN KEY (event_uid) REFERENCES public.events (uid) MATCH SIMPLE ON DELETE CASCADE ON UPDATE CASCADE;
