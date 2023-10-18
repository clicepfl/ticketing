use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Event {
    pub uid: Uuid,
    pub date: NaiveDate,
    pub name: String,
    pub mail_sent: bool,
}

#[derive(Serialize, Deserialize)]
pub struct Participant {
    pub uid: Uuid,
    pub event_uid: Uuid,
    pub sciper: String,
    pub email: String,
    pub first_name: String,
    pub surname: String,
    pub group: Option<String>,
}
