import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import * as TE from 'fp-ts/TaskEither'
import { List, Record, RecordOf } from 'immutable'
import { v4 as uuidv4 } from 'uuid'

export class StorageError extends Error {
  constructor(message?: string) {
    super(message ?? '')

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export interface ItemVo {
  alias: string
  createdAt: number
  id: string
  url: string
}

export type ProtocolItem = RecordOf<ItemVo>

export class Item extends Record<ItemVo>({
  id: '',
  alias: '',
  url: '',
  createdAt: 0
}) {
  constructor(values: Omit<ItemVo, 'id' | 'createdAt'>) {
    super({ ...values, id: uuidv4(), createdAt: Date.now() })
  }
}

export interface TraitStrage {
  addItem: ReaderTaskEither<ProtocolItem, StorageError, boolean>
  deleteItem: ReaderTaskEither<ProtocolItem, StorageError, boolean>
  getItems: TE.TaskEither<StorageError, List<ProtocolItem>>
}

export class Storage implements TraitStrage {
  constructor(private readonly sync: chrome.storage.SyncStorageArea) {}

  deleteItem: ReaderTaskEither<RecordOf<ItemVo>, StorageError, boolean> = (
    item
  ) => {
    return pipe(
      this.getItems,
      TE.chain((items) => {
        return async (): Promise<E.Either<StorageError, boolean>> =>
          await new Promise((resolve) => {
            const filtered = items.filter((aItem) => aItem.id !== item.id)

            this.sync.set({ items: filtered.toJS() }, () => {
              if (chrome.runtime.lastError !== undefined) {
                resolve(
                  E.left(new StorageError(chrome.runtime.lastError.message))
                )
                return
              }

              resolve(E.right(true))
            })
          })
      })
    )
  }

  addItem: ReaderTaskEither<ProtocolItem, StorageError, boolean> = (
    item: ProtocolItem
  ) => {
    return pipe(
      this.getItems,
      TE.chain((items) => {
        return async (): Promise<E.Either<StorageError, boolean>> =>
          await new Promise((resolve) => {
            const newItems = items.push(item)

            chrome.storage.sync.set({ items: newItems.toJS() }, () => {
              if (chrome.runtime.lastError !== undefined) {
                resolve(
                  E.left(new StorageError(chrome.runtime.lastError.message))
                )
                return
              }

              resolve(E.right(true))
            })
          })
      })
    )
  }

  getItems: TE.TaskEither<StorageError, List<ProtocolItem>> = async () => {
    return await new Promise((resolve) => {
      this.sync.get(null, (_data) => {
        if (chrome.runtime.lastError !== undefined) {
          return resolve(
            E.left(new StorageError(chrome.runtime.lastError.message))
          )
        }

        const data = _data as { items?: ProtocolItem[] }
        const items = List(data.items ?? [])

        return resolve(E.right(items))
      })
    })
  }
}
