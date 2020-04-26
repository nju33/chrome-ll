use super::entity;
use async_trait::async_trait;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use wasm_bindgen_futures::JsFuture;
use web_sys::{Request, RequestInit, RequestMode, Response};

pub struct Api {
  base_url: String,
}

#[async_trait]
trait LLApi {
  async fn get(&self, bin_id: &str) -> Result<JsValue, JsValue>;

  // fn post(name: &str, record: &Self::Record);

  // fn put(bin_id: &str, record: &Self::Record);

  // fn delete(bin_id: &str);
}

#[async_trait]
impl LLApi for Api {
  async fn get(&self, bin_id: &str) -> Result<JsValue, JsValue> {
    let url = format!("{}?binId={}", self.base_url, bin_id);

    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.mode(RequestMode::Cors);
    let request = Request::new_with_str_and_init(&url, &opts)?;
    // request
    //   .headers()
    //   .set("Accept", "application/vnd.github.v3+json")?;
    let window = web_sys::window().unwrap();
    let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
    // `resp_value` is a `Response` object.
    // assert!(resp_value.is_instance_of::<Response>());
    let resp: Response = resp_value.dyn_into().unwrap();
    // Convert this other `Promise` into a rust `Future`.
    let json = JsFuture::from(resp.json()?).await?;
    // Use serde to parse the JSON into a struct.
    let bin: entity::LLBin = json.into_serde().unwrap();

    Ok(JsValue::from_serde(&bin).unwrap())
  }

  // fn post(name: &str, record: &Self::Record);

  // fn put(bin_id: &str, record: &Self::Record);

  // fn delete(bin_id: &str);
}
