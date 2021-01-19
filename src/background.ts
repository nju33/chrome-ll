import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import { Reader } from 'fp-ts/Reader'
import * as TE from 'fp-ts/TaskEither'
import Fuse from 'fuse.js'
import { List, Record, RecordOf } from 'immutable'
import isAbsoluteUrl from 'is-absolute-url'
import { ItemVo, Storage } from './modules/storage'

interface OmniboxViewModelVo {
  fuse: O.Option<Fuse<ItemVo>>
  items: List<RecordOf<ItemVo>>
}

interface TraitOmniboxViewModel {
  init: () => void
  search: Reader<string, ItemVo[]>
}

type ProtocolOmniboxViewModel = RecordOf<OmniboxViewModelVo> &
  TraitOmniboxViewModel

class OmniboxViewModel
  extends Record<OmniboxViewModelVo>({ items: List(), fuse: O.none })
  implements TraitOmniboxViewModel {
  // private fuse: O.Option<Fuse<ItemVo>> = O.none

  init(): void {
    this.set(
      'fuse',
      O.some(
        new Fuse<ItemVo>(this.items.toJS(), { keys: ['alias'] })
      )
    )
  }

  search(text: string): ItemVo[] {
    return pipe(
      this.fuse,
      O.fold(
        () => [],
        (fuse) => {
          return fuse.search(text).map(({ item }) => item)
        }
      )
    )
  }
}

let omniboxViewModel: O.Option<ProtocolOmniboxViewModel> = O.none

function handleInputStarted(): void {
  const storage = new Storage(chrome.storage.sync)
  omniboxViewModel = O.some(new OmniboxViewModel({ items: List() }).asMutable())

  // eslint-disable-next-line no-void
  void pipe(
    storage.getItems,
    TE.map((items) => {
      pipe(
        omniboxViewModel,
        O.map((vm) => {
          vm.set('items', items).init()
        })
      )
    })
  )()
}

function handleInputChanged(
  text: string,
  suggest: (suggestResults: chrome.omnibox.SuggestResult[]) => void
): void {
  pipe(
    omniboxViewModel,
    O.map((vm) => {
      const items = vm.search(text)
      suggest(
        items.map((item) => {
          return {
            content: item.url,
            description: `${item.alias}: ${item.url}`
          }
        })
      )
    })
  )
}

function handleInputEntered(text: string): void {
  if (isAbsoluteUrl(text)) {
    chrome.tabs.create({ url: text })
  }

  const storage = new Storage(chrome.storage.sync)
  // eslint-disable-next-line no-void
  void pipe(
    storage.getItems,
    TE.map((items) => {
      const vm = new OmniboxViewModel({ items }).asMutable()
      vm.init()

      pipe(
        O.fromNullable(vm.search(text)[0]),
        O.map((item) => {
          chrome.tabs.create({ url: item.url })
        })
      )
    })
  )()
}

function handleInputCancelled(): void {
  omniboxViewModel = O.none
}

chrome.omnibox.onInputStarted.addListener(handleInputStarted)

chrome.omnibox.onInputChanged.addListener(handleInputChanged)

chrome.omnibox.onInputEntered.addListener(handleInputEntered)

chrome.omnibox.onInputCancelled.addListener(handleInputCancelled)
