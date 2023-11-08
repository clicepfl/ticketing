CREATE TABLE IF NOT EXISTS events (
  "uid" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" varchar(100) NOT NULL,
  "date" date NOT NULL,
  "mail_template" text,
  "mail_sent" boolean NOT NULL DEFAULT false,
  CONSTRAINT event_pk PRIMARY KEY (uid)
);

CREATE TABLE IF NOT EXISTS participants (
  "uid" uuid NOT NULL DEFAULT gen_random_uuid(),
  "event_uid" uuid NOT NULL,
  "email" varchar(100) NOT NULL,
  "first_name" varchar(50) NOT NULL,
  "surname" varchar(50) NOT NULL,
  "group" varchar(50),
  "has_checked_in" boolean NOT NULL DEFAULT false,
  CONSTRAINT participant_pk PRIMARY KEY (uid),
  UNIQUE ("event_uid", "email")
);

ALTER TABLE participants DROP CONSTRAINT IF EXISTS participant_event_fk;
ALTER TABLE participants
ADD CONSTRAINT participant_event_fk FOREIGN KEY (event_uid) REFERENCES public.events (uid) MATCH SIMPLE ON DELETE CASCADE ON UPDATE CASCADE;
