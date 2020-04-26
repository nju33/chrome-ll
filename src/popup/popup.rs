use super::page;
use super::props;
use super::tab::Tab;
use yew::prelude::*;

pub struct Popup {
  link: ComponentLink<Self>,
  pub props: props::Props,
}

impl Popup {
  pub fn get_page(&self) -> Html {
    super::super::console::log(&format!("{:?}", self.props));

    let current_view = self.props.current_view.borrow();

    match *current_view {
      props::View::List => html! {
        <page::list::ListPage />
      },
      props::View::New => html! {
        <page::new::NewPage />
      },
      props::View::Edit => html! {
        <page::edit::EditPage />
      },
      props::View::Sync => html! {
        <page::sync::SyncPage />
      },
    }
  }
}

pub enum Msg {}

impl Component for Popup {
  type Message = Msg;
  type Properties = props::Props;
  fn create(props: Self::Properties, link: ComponentLink<Self>) -> Self {
    Self { link, props }
  }

  fn update(&mut self, _msg: Self::Message) -> ShouldRender {
    true
  }

  fn change(&mut self, props: Self::Properties) -> ShouldRender {
    self.props = props;
    true
  }

  fn view(&self) -> Html {
    super::super::console::log("popup view");
    let page = self.get_page();
    let tab_props = self.props.clone();

    html! {
      <div class="w-full h-full bg-gray-100">
        <div class="shadow-sm">
          <Tab with tab_props />
        </div>

        {page}
      </div>
    }
  }
}
