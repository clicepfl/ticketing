use chrono::NaiveDate;
use rocket::{delete, get, http::ContentType, patch, post, serde::json::Json};
use serde::Deserialize;
use uuid::Uuid;

use crate::{mail::generate_mail, models::Event, DB};

use super::{login::RequireLogin, Error};

#[derive(Deserialize)]
pub struct EventForm {
    pub date: NaiveDate,
    pub name: String,
    pub mail_template: Option<String>,
}

#[get("/events")]
pub async fn get_events(pool: &DB, _login: RequireLogin) -> Result<Json<Vec<Event>>, Error> {
    sqlx::query_as!(Event, "SELECT * FROM events")
        .fetch_all(pool.inner())
        .await
        .map(Json)
        .map_err(Error::from)
}

#[post("/events", format = "json", data = "<form>")]
pub async fn post_event(
    form: Json<EventForm>,
    pool: &DB,
    _login: RequireLogin,
) -> Result<Json<Event>, Error> {
    sqlx::query_as!(
        Event,
        r#"
        INSERT INTO events(date, name, mail_template) 
        VALUES($1, $2, $3)
        RETURNING *
        "#,
        form.date,
        form.name,
        form.mail_template,
    )
    .fetch_one(pool.inner())
    .await
    .map(Json)
    .map_err(Error::from)
}

#[patch("/events/<uid>", format = "json", data = "<form>")]
pub async fn patch_event(
    uid: Uuid,
    form: Json<EventForm>,
    pool: &DB,
    _login: RequireLogin,
) -> Result<Json<Event>, Error> {
    sqlx::query_as!(
        Event,
        r#"
        UPDATE events
        SET date = $2, name = $3
        WHERE uid = $1
        RETURNING *
        "#,
        uid,
        form.date,
        form.name
    )
    .fetch_one(pool.inner())
    .await
    .map(Json)
    .map_err(Error::from)
}

#[delete("/events/<uid>")]
pub async fn delete_event(uid: Uuid, pool: &DB, _login: RequireLogin) -> Result<(), Error> {
    sqlx::query!("DELETE FROM events WHERE uid = $1", uid)
        .execute(pool.inner())
        .await
        .map(|_| ())
        .map_err(Error::from)
}

#[get("/events/<uid>/mail-preview")]
pub async fn preview_email(
    uid: Uuid,
    pool: &DB,
) -> Result<(ContentType, String), Error> {
    let record = sqlx::query!("SELECT mail_template FROM events WHERE uid = $1", uid)
        .fetch_one(pool.inner())
        .await?;
    let template = record.mail_template.ok_or_else(|| Error {
        status: 400,
        description: Some("No mail template".to_owned()),
    })?;

    let mail = generate_mail(template.as_str(), Uuid::new_v4()).map_err(|s| Error {
        status: 500,
        description: Some(s),
    })?;

    Ok((ContentType::HTML, mail))
}
