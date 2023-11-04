use rocket::{
    http::Status,
    post,
    request::{FromRequest, Outcome},
    serde::json::Json,
    Request,
};
use serde::Deserialize;

use crate::config::config;

#[derive(Deserialize)]
pub struct LoginForm {
    token: String,
}

#[post("/login", format = "json", data = "<form>")]
pub fn login(form: Json<LoginForm>) -> Status {
    if config().admin_token == form.token {
        Status::Ok
    } else {
        Status::Forbidden
    }
}

/// Guard to ensure that a request has a valid authorization bearer token.
pub struct RequireLogin;

#[rocket::async_trait]
impl<'r> FromRequest<'r> for RequireLogin {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let Some(header) = request.headers().get_one("Authorization") else {
            return Outcome::Failure((Status::Unauthorized, ()));
        };

        let Some(token) = header.strip_prefix("Bearer ") else {
            return Outcome::Failure((Status::BadRequest, ()));
        };

        if token == config().admin_token {
            Outcome::Success(RequireLogin)
        } else {
            Outcome::Failure((Status::Forbidden, ()))
        }
    }
}
