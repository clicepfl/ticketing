CREATE TABLE "entries" (
  "uid" SERIAL PRIMARY KEY,
  "group" SMALLINT NOT NULL,
  "firstname" VARCHAR(30) NOT NULL,
  "surname" VARCHAR(30) NOT NULL,
  "email" VARCHAR(50) NOT NULL,
  "scanned" BOOLEAN NOT NULL DEFAULT FALSE
);