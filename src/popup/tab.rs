use super::props;
use yew::prelude::*;

pub struct Tab {
  link: ComponentLink<Self>,
  pub props: props::Props,
}

impl Tab {
  pub fn get_class(&self, view: &props::View) -> Vec<&str> {
    let mut classes = vec![
      "transition",
      "ease-in-out",
      "duration-75",
      "col-span-1",
      "hover:bg-red-100",
    ];

    if &*self.props.current_view.borrow() == view {
      classes.push("bg-red-600 hover:bg-red-600");
    }

    classes
  }
}

pub enum Msg {
  List,
  Edit,
  New,
  Sync,
}

impl Component for Tab {
  type Message = Msg;
  type Properties = props::Props;
  fn create(props: Self::Properties, link: ComponentLink<Self>) -> Self {
    Self { link, props }
  }

  fn update(&mut self, msg: Self::Message) -> ShouldRender {
    match msg {
      Msg::List => self.props.change_view.emit(props::View::List),
      Msg::New => self.props.change_view.emit(props::View::New),
      Msg::Edit => self.props.change_view.emit(props::View::Edit),
      Msg::Sync => self.props.change_view.emit(props::View::Sync),
    };
    true
  }

  fn view(&self) -> Html {
    html! {
      <div class="w-full h-12 grid grid-rows-1 grid-cols-4 border-b border-gray-300">
        <button class=self.get_class(&props::View::List) onclick=self.link.callback(|_| Msg::List)>
          <i class="far fa-bars"></i>
          <span class="text-sm">{" List"}</span>
        </button>
        <button class=self.get_class(&props::View::Edit) onclick=self.link.callback(|_| Msg::Edit)>
          <i class="far fa-edit"></i>
          <span class="text-sm">{" Edit"}</span>
        </button>
        <button class=self.get_class(&props::View::New) onclick=self.link.callback(|_| Msg::New)>
          <i class="far fa-plus"></i>
          <span class="text-sm">{" New"}</span>
        </button>
        <button class=self.get_class(&props::View::Sync) onclick=self.link.callback(|_| Msg::Sync)>
          <i class="far fa-sync"></i>
          <span class="text-sm">{" Sync"}</span>
        </button>
      </div>
    }
  }
}
