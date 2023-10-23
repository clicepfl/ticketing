use std::sync::OnceLock;

use envconfig::Envconfig;

#[derive(Envconfig)]
pub struct Config {
    #[envconfig(from = "ADMIN_TOKEN")]
    pub admin_token: String,
    #[envconfig(from = "DATABASE_URL")]
    pub database_url: String,
    #[envconfig(from = "BASE_URI", default = "/")]
    pub base_uri: String,
    #[envconfig(from = "SMTP_MAIL")]
    pub smtp_email: String,
    #[envconfig(from = "SMTP_USER")]
    pub smtp_user: String,
    #[envconfig(from = "SMTP_PASSWORD")]
    pub smtp_password: String,
    #[envconfig(from = "SMTP_SERVER")]
    pub smtp_server: String,
}

static CONFIG: OnceLock<Config> = OnceLock::new();

pub fn config() -> &'static Config {
    CONFIG.get_or_init(|| Envconfig::init_from_env().unwrap())
}
