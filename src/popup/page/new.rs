use yew::prelude::*;

pub struct NewPage {
  link: ComponentLink<Self>,
}

pub enum Msg {}

impl Component for NewPage {
  type Message = Msg;
  type Properties = ();
  fn create(_: Self::Properties, link: ComponentLink<Self>) -> Self {
    Self { link }
  }

  fn update(&mut self, _msg: Self::Message) -> ShouldRender {
    true
  }

  fn view(&self) -> Html {
    let items = vec![
      crate::entity::LLItem {
        alias: String::from("foo"),
        url: String::from("https://example.com"),
      },
      crate::entity::LLItem {
        alias: String::from("bar"),
        url: String::from("https://example.com"),
      },
      crate::entity::LLItem {
        alias: String::from("baz"),
        url: String::from("https://example.com"),
      },
    ];

    html! {
      <div class="my-2">
        <form id="new-form" class="grid grid-rows-4 grid-cols-12 gap-2">
          <label for="url" class="row-span1 col-start-2 col-span-10 flex items-end">{"URL"}</label>
          <input id="url" type="url" class="row-span1 col-start-2 col-span-10 border border-gray-300 p-2" />
          <label for="alias" class="row-span1 col-start-2 col-span-10 flex items-end">{"Alias"}</label>
          <input id="alias" class="row-span1 col-start-2 col-span-7 border border-gray-300 p-2" />
        </form>

        <div class="grid grid-rows-4 grid-cols-12 gap-2 mt-4">
          <button form="new-form" type="submit" class="row-span-1 col-start-2 col-span-3 bg-green-500 p-2">
            <i class="far fa-arrow-right"></i>
            <i class="far fa-database ml-2"></i>
          </button>
        </div>
      </div>
    }
  }
}
