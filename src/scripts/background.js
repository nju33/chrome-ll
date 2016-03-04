import storage from 'helpers/storage';
import esc from 'lodash.escape';
import unesc from 'lodash.unescape';

storage.get().then(onReady);

// const sample = [
//   {
//     url: esc('https://www.youtube.com/?hl=ja&gl=JP'),
//     alias: 'yt',
//     lastEnter: 0,
//   },
//   {
//     url: esc('https://github.com/totora0155'),
//     alias: 'gh',
//     lastEnter: 0,
//   },
//   {
//     url: 'http://www.netflix.com/browse',
//     alias: 'nf',
//     lastEnter: 0,
//   },
// ]

function onReady(aliases) {
  chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    const re = new RegExp(text);
    const filtered = aliases.filter((aliasData) => {
      return re.test(aliasData.alias);
    });
    const sorted = filtered.sort((a, b) => {
      return b.lastEnter - a.lastEnter;
    });
    const mapped = sorted.map((aliasData) => {
      return {
        content: unesc(aliasData.url),
        description: `@${aliasData.alias}  ${aliasData.url}`,
      };
    });
    return suggest(mapped);
  });

  chrome.omnibox.onInputEntered.addListener((text) => {
    const idx = aliases.findIndex(aliasData => aliasData.url === esc(text));

    if (~idx) {
      const {url} = aliases[idx];
      chrome.tabs.update({url});

      aliases[idx].lastEnter = Date.now();
      storage.set(aliases);
    }
  });
}
