use rocket::http::Status;

pub mod event;
pub mod login;
pub mod participants;

pub type Error = (Status, String);

pub fn map_database_error(error: sqlx::Error) -> Error {
    let status = match &error {
        sqlx::Error::RowNotFound => Status::NotFound,
        _ => Status::InternalServerError,
    };

    (status, error.to_string())
}
