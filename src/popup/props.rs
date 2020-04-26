use std::cell::RefCell;
use std::rc::Rc;
use yew::prelude::*;

#[derive(PartialEq, Clone, Copy, Debug)]
pub enum View {
  List,
  Edit,
  New,
  Sync,
}

impl Default for View {
  fn default() -> Self {
    View::List
  }
}

pub type ChangeView = Callback<View>;

#[derive(Properties, Clone, Debug)]
pub struct Props {
  pub current_view: Rc<RefCell<View>>,
  pub change_view: ChangeView,
}
