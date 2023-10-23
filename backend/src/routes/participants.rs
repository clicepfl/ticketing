use rocket::{delete, get, post, put, serde::json::Json};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{models::Participant, DB};

use super::{login::RequireLogin, Error};

#[derive(Serialize, Deserialize)]
pub struct ParticipantForm {
    pub sciper: String,
    pub email: String,
    pub first_name: String,
    pub surname: String,
    pub group: String,
}

#[get("/events/<uid>/participants")]
pub async fn get_participants(uid: Uuid, db: &DB) -> Result<Json<Vec<Participant>>, Error> {
    sqlx::query_as!(
        Participant,
        r#"SELECT * FROM participants WHERE event_uid = $1"#,
        uid
    )
    .fetch_all(db.inner())
    .await
    .map(Json)
    .map_err(Error::from)
}

#[put("/events/<uid>/participants", format = "json", data = "<participants>")]
pub async fn put_participants(
    uid: Uuid,
    participants: Json<Vec<ParticipantForm>>,
    db: &DB,
    _login: RequireLogin,
) -> Result<(), Error> {
    for p in participants.into_inner().into_iter() {
        sqlx::query!(
            r#"INSERT INTO participants ("event_uid", "sciper", "email", "first_name", "surname", "group") 
            VALUES($1, $2, $3, $4, $5, $6) 
            ON CONFLICT(email, event_uid) DO UPDATE SET "event_uid" = $1, "sciper" = $2, "email" = $3, "first_name" = $4, "surname" = $5, "group" = $6"#,
            uid,
            p.sciper,
            p.email,
            p.first_name,
            p.surname,
            p.group
        ).execute( db.inner()).await?;
    }

    Ok(())
}

#[delete("/events/<event_uid>/participants/<participant_uid>")]
pub async fn delete_participants(
    event_uid: Uuid,
    participant_uid: Option<Uuid>,
    db: &DB,
    _login: RequireLogin,
) -> Result<(), Error> {
    sqlx::query!(
        "DELETE FROM participants WHERE event_uid = $1 AND (uid = $2 OR $2 IS NULL)",
        event_uid,
        participant_uid
    )
    .execute(db.inner())
    .await?;

    Ok(())
}

#[post("/events/<event_uid>/participants/<participant_uid>/checkin")]
pub async fn checkin(
    event_uid: Uuid,
    participant_uid: Uuid,
    db: &DB,
) -> Result<Json<Option<Participant>>, Error> {
    let participant = sqlx::query_as!(
        Participant,
        r#"SELECT * FROM participants WHERE event_uid = $1 AND uid = $2"#,
        event_uid,
        participant_uid
    )
    .fetch_one(db.inner())
    .await?;

    sqlx::query!(
        "UPDATE participants SET has_checked_in = true WHERE uid = $1",
        participant_uid
    )
    .execute(db.inner())
    .await?;

    Ok(Json(Some(participant)))
}
