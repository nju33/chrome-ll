use yew::prelude::*;

pub struct SyncPage {
  link: ComponentLink<Self>,
}

pub enum Msg {}

impl Component for SyncPage {
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
        <div class="grid grid-cols-12">
          <dl class="col-start-2 col-span-10 p-2 bg-gray-300 rounded">
            <dt>{"Last Updated"}</dt>
            <dd class="gray-500 text-sm">{"2020-04-26T05:07:24.557801002+09:00"}</dd>
          </dl>
        </div>

        <form class="grid grid-cols-12 gap-2 py-2 my-2">
          <button type="submit" class="col-start-2 col-span-3 bg-green-500 p-2">
            <i class="far fa-database"></i>
            <i class="far fa-arrow-right ml-2"></i>
          </button>
        </form>
      </div>
    }
  }
}
