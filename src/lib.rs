#![recursion_limit = "256"]

// mod api;
mod console;
mod entity;
mod popup;
mod utils;

use wasm_bindgen::prelude::*;
use yew::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// fn main() {
// yew::initialize();
// App::<Model>::new().mount_to_body();
// }

#[wasm_bindgen]
extern "C" {
  // fn alert(s: &str);

  #[wasm_bindgen(js_namespace = console)]
  fn log(s: &str);
}

#[wasm_bindgen]
pub fn render_popup() -> Result<(), JsValue> {
  yew::initialize();
  App::<popup::mock::Mock>::new().mount_to_body();

  Ok(())
}

// use serde::{Deserialize, Serialize};
// use wasm_bindgen::prelude::*;
// use wasm_bindgen::JsCast;
// use wasm_bindgen_futures::JsFuture;
// use web_sys::{Request, RequestInit, RequestMode, Response};

// #[derive(Debug, Serialize, Deserialize)]
// pub struct Todo {
//   pub userId: i32,
//   pub id: i32,
//   pub title: String,
//   pub completed: bool,
// }

// pub struct UserInfo {
//   email: String,
//   id: String,
// }

// pub struct A {
//   userInfo: UserInfo,
// }

#[wasm_bindgen]
pub fn handle_omnibox_input_started(user_id: &str) {
  // console::log(&format!("{}", user_id));
  // console::log("alksdjf")
}

// #[wasm_bindgen]
// pub async fn test() -> Result<JsValue, JsValue> {
//   let mut opts = RequestInit::new();
//   opts.method("GET");
//   opts.mode(RequestMode::Cors);

//   let url = "https://jsonplaceholder.typicode.com/todos/1";

//   let request = Request::new_with_str_and_init(&url, &opts)?;

//   // request
//   //   .headers()
//   //   .set("Accept", "application/vnd.github.v3+json")?;

//   let window = web_sys::window().unwrap();
//   let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;

//   // `resp_value` is a `Response` object.
//   // assert!(resp_value.is_instance_of::<Response>());
//   let resp: Response = resp_value.dyn_into().unwrap();

//   // Convert this other `Promise` into a rust `Future`.
//   let json = JsFuture::from(resp.json()?).await?;

//   // Use serde to parse the JSON into a struct.
//   let todo: Todo = json.into_serde().unwrap();

//   console::log(&format!("{:?}", todo));

//   Ok(JsValue::from_serde(&todo).unwrap())
// }

// pub async fn get_bin(bin_id: &str) -> Result<JsValue, JsValue> {
//   let url = format!("https://chrome-ll.now.sh/api/v1/bin?binId={}", bin_id);

//   let mut opts = RequestInit::new();
//   opts.method("GET");
//   opts.mode(RequestMode::Cors);

//   let request = Request::new_with_str_and_init(&url, &opts)?;

//   // request
//   //   .headers()
//   //   .set("Accept", "application/vnd.github.v3+json")?;

//   let window = web_sys::window().unwrap();
//   let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;

//   // `resp_value` is a `Response` object.
//   // assert!(resp_value.is_instance_of::<Response>());
//   let resp: Response = resp_value.dyn_into().unwrap();

//   // Convert this other `Promise` into a rust `Future`.
//   let json = JsFuture::from(resp.json()?).await?;

//   // Use serde to parse the JSON into a struct.
//   let todo: Todo = json.into_serde().unwrap();

//   console::log(&format!("{:?}", todo));

//   Ok(JsValue::from_serde(&todo).unwrap())
// }
