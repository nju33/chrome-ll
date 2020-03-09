import Fuse from 'fuse.js'
import fetch from 'node-fetch';
import {UID} from "./uid";

// chrome.omnibox.onInputStarted.addListener(() => {
//   storage.get().then(_aliases => {
//     aliases = _aliases || [];
//     fuse = new Fuse(aliases, {keys: ['alias']})
//   })
// });

export interface OmniboxStruct {
  fuse: Fuse<{}, Fuse.FuseOptions<{}>;
}

export class Omnibox {
  async onInputStarted() {
    const uid = await UID.getProfileUserId();
    
    // If not logged in Chrome yet, the `uid` becomes empty string.
    if (uid === '') {
      return;
    }

    
  }
}