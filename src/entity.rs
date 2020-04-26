// use serde::{Deserialize, Serialize};

// #[derive(Deserialize, Serialize, Debug)]
pub struct LLItem {
  pub alias: String,
  pub url: String,
}

// #[derive(Deserialize, Serialize, Debug)]
pub struct LLRecord {
  pub items: Vec<LLItem>,
}

// #[derive(Deserialize, Serialize, Debug)]
pub struct LLBin {
  pub record: LLRecord,
}
