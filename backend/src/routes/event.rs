use chrono::NaiveDate;
use rocket::{delete, get, patch, post, serde::json::Json};
use serde::Deserialize;
use uuid::Uuid;

use crate::{models::Event, DB};

use super::{login::RequireLogin, map_database_error, Error};

#[derive(Deserialize)]
pub struct EventForm {
    pub date: NaiveDate,
    pub name: String,
}

#[get("/events")]
pub async fn get_events(pool: &DB, _login: RequireLogin) -> Result<Json<Vec<Event>>, Error> {
    sqlx::query_as!(Event, "SELECT * FROM events")
        .fetch_all(pool.inner())
        .await
        .map(Json)
        .map_err(map_database_error)
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
        INSERT INTO events(date, name) 
        VALUES($1, $2)
        RETURNING *
        "#,
        form.date,
        form.name
    )
    .fetch_one(pool.inner())
    .await
    .map(Json)
    .map_err(map_database_error)
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
    .map_err(map_database_error)
}

#[delete("/events/<uid>")]
pub async fn delete_event(uid: Uuid, pool: &DB, _login: RequireLogin) -> Result<(), Error> {
    sqlx::query!("DELETE FROM events WHERE uid = $1", uid)
        .execute(pool.inner())
        .await
        .map(|_| ())
        .map_err(map_database_error)
}
