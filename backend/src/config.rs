use std::sync::OnceLock;

use envconfig::Envconfig;

#[derive(Envconfig)]
pub struct Config {
    #[envconfig(from = "ADMIN_TOKEN")]
    pub admin_token: String,
    #[envconfig(from = "DATABASE_URL")]
    pub database_url: String,
}

static CONFIG: OnceLock<Config> = OnceLock::new();

pub fn config() -> &'static Config {
    CONFIG.get_or_init(|| Envconfig::init_from_env().unwrap())
}
