use std::io::Cursor;

use rocket::{
    http::{ContentType, Status},
    response::Responder,
    Response,
};
use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct Error {
    pub status: u16,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

impl From<sqlx::Error> for Error {
    fn from(value: sqlx::Error) -> Self {
        let status = match &value {
            sqlx::Error::RowNotFound => Status::NotFound,
            _ => Status::InternalServerError,
        };

        Self {
            status: status.code,
            description: Some(value.to_string()),
        }
    }
}

impl From<String> for Error {
    fn from(value: String) -> Self {
        Self {
            status: 500,
            description: Some(value),
        }
    }
}

impl Error {
    pub fn from_any<T: ToString>(value: T) -> Self {
        Self {
            status: 500,
            description: Some(value.to_string()),
        }
    }
}

impl<'r, 'o: 'r> Responder<'r, 'o> for Error {
    fn respond_to(self, _: &'r rocket::Request<'_>) -> rocket::response::Result<'o> {
        let json = serde_json::to_string(&self);

        if let Ok(json) = json {
            Response::build()
                .header(ContentType::new("application", "json"))
                .sized_body(json.len(), Cursor::new(json))
                .status(Status { code: self.status })
                .ok()
        } else {
            Response::build().status(Status { code: self.status }).ok()
        }
    }
}
