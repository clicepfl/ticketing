CREATE TABLE "entries" (
  "uid" uuid DEFAULT gen_random_uuid(),
  "group" smallint NOT NULL COMMENT 'Group assigned to the person at the event.',
  "firstname" varchar(30) NOT NULL,
  "surname" varchar(30) NOT NULL,
  "email" varchar(50) NOT NULL,
  "scanned" boolean NOT NULL DEFAULT FALSE,
  CONSTRAINT entries_pk PRIMARY_KEY(uid)
);
