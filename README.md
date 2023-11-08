# Clicketing

Clicketing is a service used for CLIC's events, to facilitate the check in. Each participant in the event will receive a customized email containing a QR Code, which the staff will scan to confirm their presence.

Clicketing is divided in two separate services: the API and the UI. The former is written in Rust, while the latter uses Typescript.

## API (Backend)

The backend requires Rust and cargo, see [rustup](https://rustup.rs) to install.

### Setup

The backend requires the following environment variables at runtime:

- `ADMIN_TOKEN`: The password used to access the admin pages, to create and edit events.
- `DATABASE_URL`: Complete URL to the database, including authentication informations. Also required at build time, and must point to a running database with the correct schema (see below).
- `ENVIRONMENT`: `dev` or `prod`
- `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_MAIL`, `SMTP_SERVER`: Configuration for the mail address.
- `BASE_URI`: Uri of the api on the domain, e.g. `/api/`.

The backend uses a postgresql database, which must be hosted separately. For development server, the `backend/docker-compose.yaml` can be used to run a local database (in which case `DATABASE_URL` must be `postgres://ticketing:password@localhost:2345/ticketing`).

To apply the database schema, use the following commands:

```sh
# From /backend/
cargo install sqlx-cli
sqlx migrate run --database-url=<DATABASE_URL> # --database-url is not required if `DATABASE_URL` is set
```

### Run

Once the database is up and running with the correct schema, the backend can be started with:

```sh
# From /backend/
cargo run
```

### Use

The API is accessed with http requests, optionally using an bearer token for the authorization.

For example with curl:

```sh
curl http://127.0.0.1:8000/events -H 'Authorization: Bearer <ADMIN_TOKEN>'
```

## UI (Frontend)

The frontend is served using the NextJS framework.

### Setup

It requires the following environment variable at runtime:
- `NEXT_PUBLIC_API_URL`: The complete root URL of the API server.
- `NEXT_PUBLIC_SESSION_COOKIE_NAME`: Name of the cookie in which the admin token will be stored (upon successfull login).
- `ADMIN_TOKEN`: The same admin token as the backend. Will not be accessible from the client side.

### Run

To run the frontend, use:
```sh
# From /frontend/
npm install
npm run dev
```

## References

- [Docker](https://www.docker.com)
- API:
  - Language: [Rust](https://rust-lang.org)
  - Web framework: [Rocket](https://rocket.rs)
  - Database: [Postgres](https://www.postgresql.org/)
- UI:
  - Framework: [NextJS](https://www.nextjs.org)
