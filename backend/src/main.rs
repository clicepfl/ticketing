use rocket::routes;

use crate::config::config;

pub mod config;
pub mod models;
pub mod routes;

type DB = rocket::State<sqlx::PgPool>;

#[rocket::launch]
async fn launch() -> _ {
    // init config
    config();

    // Connect to database
    let pool = sqlx::PgPool::connect(config().database_url.as_str())
        .await
        .unwrap();

    // Launch webserver
    rocket::build().manage(pool).mount(
        "/",
        routes![
            routes::login::login,
            routes::event::get_events,
            routes::event::post_event,
            routes::event::patch_event,
            routes::event::delete_event,
            routes::participants::get_participants,
            routes::participants::put_participants,
        ],
    )
}
