use lettre::transport::smtp::AsyncSmtpTransport;
use lettre::{
    message::{header::ContentType, Mailbox, MessageBuilder},
    transport::smtp::{
        authentication::{Credentials, Mechanism},
        PoolConfig,
    },
};
use lettre::{AsyncTransport, Tokio1Executor};
use lol_html::{element, HtmlRewriter, Settings};
use qrcode_generator::QrCodeEcc;
use uuid::Uuid;

use crate::config::config;

fn generate_qrcode_svg(uid: Uuid) -> Result<String, String> {
    qrcode_generator::to_svg_to_string(uid.to_string(), QrCodeEcc::Low, 200, None::<&str>)
        .map_err(|e| e.to_string())
}

pub fn generate_mail(template: &str, uid: Uuid) -> Result<String, String> {
    let mut output = vec![];

    let mut rewriter = HtmlRewriter::new(
        Settings {
            element_content_handlers: vec![element!("div#qrcode", |el| {
                el.set_inner_content(
                    generate_qrcode_svg(uid)?.as_str(),
                    lol_html::html_content::ContentType::Html,
                );
                Ok(())
            })],
            ..Settings::default()
        },
        |c: &[u8]| output.extend_from_slice(c),
    );

    rewriter
        .write(template.as_bytes())
        .map_err(|e| e.to_string())?;

    String::from_utf8(output).map_err(|e| e.to_string())
}

pub async fn send_mail(
    template: &str,
    participants: Vec<(String, Uuid)>,
    event_name: &str,
) -> Result<(), String> {
    let sender = AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&config().smtp_server)
        .map_err(|e| e.to_string())?
        .credentials(Credentials::new(
            config().smtp_user.clone(),
            config().smtp_password.clone(),
        ))
        .authentication(vec![Mechanism::Plain, Mechanism::Login])
        .pool_config(PoolConfig::default())
        .build();

    for (mail_address, uid) in participants.into_iter() {
        let mail = generate_mail(template, uid)?;
        let Ok(mail_address) = mail_address.parse::<Mailbox>() else {
            continue;
        };

        println!("{}", mail);

        let message = MessageBuilder::new()
            .from(
                config()
                    .smtp_email
                    .parse::<Mailbox>()
                    .map_err(|e| e.to_string())?,
            )
            .to(mail_address)
            .subject(format!("Registrations - {}", event_name))
            .header(ContentType::TEXT_HTML)
            .body(mail)
            .map_err(|e| e.to_string())?;

        sender.send(message).await.map_err(|e| e.to_string())?;
    }

    Ok(())
}
