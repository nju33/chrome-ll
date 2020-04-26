use yew::prelude::*;

fn list_item(item: &crate::entity::LLItem) -> Html {
  html! {
    <li class="grid grid-rows-1 grid-cols-12 py-2">
      <form class="col-start-2 col-span-1 flex justify-center items-center">
        <input type="checkbox" class="flex-auto" />
      </form>
      <dl class="col-start-4 col-span-8">
        <dd class="text-lg">
          {item.alias.clone()}
        </dd>
        <dd class="text-sm text-gray-500">
          {item.url.clone()}
        </dd>
      </dl>
    </li>
  }
}

pub struct EditPage {
  link: ComponentLink<Self>,
}

pub enum Msg {}

impl Component for EditPage {
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
      <ul>
        { items.iter().map(list_item).collect::<Html>() }
      </ul>
    }
  }
}