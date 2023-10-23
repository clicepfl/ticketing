use lol_html::{element, HtmlRewriter, Settings};
use qrcode_generator::QrCodeEcc;
use uuid::Uuid;

fn generate_qrcode_svg(uid: Uuid) -> Result<String, String> {
    qrcode_generator::to_svg_to_string(uid.to_string(), QrCodeEcc::Low, 200, None::<&str>)
        .map_err(|e| e.to_string())
}

pub fn generate_mail(template: String, uid: Uuid) -> Result<String, String> {
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
