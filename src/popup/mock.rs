use super::super::console;
use super::popup::Popup;
use super::props;
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::rc::Rc;
use std::sync::Arc;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{future_to_promise, spawn_local, JsFuture};
use yew::prelude::*;

pub struct Mock {
  link: ComponentLink<Self>,
  pub current_view: Rc<RefCell<props::View>>,
  pub a: Arc<Mutex<String>>,
}

pub enum Msg {
  ChangeView(props::View),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Branch {
  pub name: String,
  pub commit: Commit,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Commit {
  pub sha: String,
  pub commit: CommitDetails,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommitDetails {
  pub author: Signature,
  pub committer: Signature,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Signature {
  pub name: String,
  pub email: String,
}

// #[cfg(target_arch = "wasm32")]
// impl From<crate::error::Error> for wasm_bindgen::JsValue {
//   fn from(err: Error) -> wasm_bindgen::JsValue {
//     js_sys::Error::from(err).into()
//   }
// }

// #[cfg(target_arch = "wasm32")]
// impl From<crate::error::Error> for js_sys::Error {
//   fn from(err: Error) -> js_sys::Error {
//     js_sys::Error::new(&format!("{}", err))
//   }
// }
// #[wasm_bindgen]
pub async fn get() -> anyhow::Result<Branch> {
  let res = reqwest::Client::new()
    .get("https://api.github.com/repos/rustwasm/wasm-bindgen/branches/master")
    .send()
    .await?;

  let text = res.text().await?;
  let branch_info: Branch = serde_json::from_str(&text).unwrap();

  Ok(branch_info)
}

impl Component for Mock {
  type Message = Msg;
  type Properties = ();
  fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
    Self {
      link: link,
      current_view: Rc::new(RefCell::new(Default::default())),
      a: Arc::new(Mutex::new("asdf".into())),
    }
  }

  fn update(&mut self, msg: Self::Message) -> ShouldRender {
    let mut value = self.current_view.borrow_mut();
    let b = &self.a;

    spawn_local(async move {
      let a = get().await;
      console::log(&format!("{:?}", a));

      let mut b = b.lock().unwrap();
      *b = "aiueo".into();

      // value = props::View::Sync;
    });

    *value = match msg {
      Msg::ChangeView(view) => match view {
        props::View::List => props::View::List,
        props::View::Edit => props::View::Edit,
        props::View::New => props::View::New,
        props::View::Sync => props::View::Sync,
      },
    };

    true
  }

  fn view(&self) -> Html {
    html! {
      <div>
        <Popup
          current_view=self.current_view.clone(),
          change_view=self.link.callback(|view| Msg::ChangeView(view))
        />
      </div>
    }
  }
}

fn change_view(view: &props::View) -> props::View {
  match view {
    props::View::List => props::View::List,
    props::View::New => props::View::New,
    props::View::Edit => props::View::Edit,
    props::View::Sync => props::View::Sync,
  }
}
