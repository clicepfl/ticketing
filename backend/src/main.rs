use rocket::{catch, catchers, http::Status, routes, serde::json::Json, Request};
use routes::Error;

use crate::config::config;

pub mod config;
pub mod mail;
pub mod models;
pub mod routes;

type DB = rocket::State<sqlx::PgPool>;

#[catch(default)]
fn default(status: Status, _: &Request) -> Json<Error> {
    Json(Error {
        status: status.code,
        description: None,
    })
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
        .register("/", catchers![default])
        .mount(
            config().base_uri.as_str(),
            routes![
                routes::login::login,
                routes::event::get_events,
                routes::event::post_event,
                routes::event::patch_event,
                routes::event::delete_event,
                routes::event::preview_email,
                routes::participants::get_participants,
                routes::participants::put_participants,
                routes::participants::delete_participants,
                routes::participants::checkin,
            ],
        )
}
