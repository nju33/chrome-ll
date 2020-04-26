use wasm_bindgen::prelude::*;

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
  pub fn log(s: &str);
}
