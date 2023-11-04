use error::Error;
use rocket::fairing::{Fairing, Info, Kind};
use rocket::http::{Header, Method};
use rocket::{catch, catchers, http::Status, routes, serde::json::Json};
use rocket::{Request, Response};

use crate::config::config;

pub mod config;
pub mod mail;
pub mod models;
pub mod routes;
mod error;

type DB = rocket::State<sqlx::PgPool>;

#[catch(default)]
fn default(status: Status, _: &Request) -> Json<Error> {
    Json(Error {
        status: status.code,
        description: None,
    })
}
pub struct CORS;
#[rocket::async_trait]
impl Fairing for CORS {
    fn info(&self) -> Info {
        Info {
            name: "Add CORS headers to responses",
            kind: Kind::Response,
        }
    }

    async fn on_response<'r>(&self, request: &'r Request<'_>, response: &mut Response<'r>) {
        if std::env::var("ENVIRONMENT").is_ok_and(|s| s == "dev") {
            response.set_header(Header::new("Access-Control-Allow-Origin", "*"));
            response.set_header(Header::new(
                "Access-Control-Allow-Methods",
                "POST, GET, PATCH, OPTIONS",
            ));
            response.set_header(Header::new("Access-Control-Allow-Headers", "*"));
            response.set_header(Header::new("Access-Control-Allow-Credentials", "true"));
        }

        if request.method() == Method::Options {
            response.set_status(Status::Ok);
        }
    }
}

#[rocket::launch]
async fn launch() -> _ {
    // init config
    config();

    // Connect to database
    let pool = sqlx::PgPool::connect(config().database_url.as_str())
    .await
    .unwrap();

    // Run migrations
    sqlx::migrate!().run(&pool).await.unwrap();

    // Launch webserver
    rocket::build()
        .manage(pool)
        .attach(CORS)
        .register("/", catchers![default])
        .mount(
            config().base_uri.as_str(),
            routes![
                routes::login::login,
                routes::event::get_events,
                routes::event::post_event,
                routes::event::patch_event,
                routes::event::delete_event,
                routes::event::send_preview_email,
                routes::event::send_emails,
                routes::participants::get_participants,
                routes::participants::put_participants,
                routes::participants::delete_participants,
                routes::participants::checkin,
            ],
        )
}
