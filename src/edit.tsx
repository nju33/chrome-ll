import './main.css'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import { List, Record, RecordOf } from 'immutable'
import React from 'react'
import { render } from 'react-dom'
import { ItemVo, Storage } from './modules/storage'

const ItemListItem = ({
  item
}: {
  item: RecordOf<ItemVo>
}): React.ReactElement => {
  const { deleteItem } = React.useContext(vmContext)

  return (
    <li className="flex">
      <div className="flex-none" style={{ width: 330 }}>
        {item.url}
      </div>
      <div className="flex-none" style={{ width: 140 }}>
        {item.alias}
      </div>
      <div className="flex-none" style={{ width: 40 }}>
        <button
          title="Delete item"
          className="hover:text-red-500 duration-100"
          onClick={() => {
            if (!window.confirm(chrome.i18n.getMessage('areYouSure'))) {
              return
            }

            const storage = new Storage(chrome.storage.sync)

            // eslint-disable-next-line no-void
            void pipe(
              storage.deleteItem(item),
              TE.map(() => {
                deleteItem(item)
              })
            )()
          }}>
          <i className="far fa-trash-alt"></i>
        </button>
      </div>
    </li>
  )
}

interface ItemListViewModelVo {
  items: List<RecordOf<ItemVo>>
}

class ItemListViewModel extends Record<ItemListViewModelVo>({
  items: List()
}) {}

type Actions =
  | { payload: { items: List<RecordOf<ItemVo>> }; type: 'setItems' }
  | {
      payload: { item: RecordOf<ItemVo> }
      type: 'deleteItem'
    }

const reducer: React.Reducer<RecordOf<ItemListViewModelVo>, Actions> = (
  state,
  action
) => {
  switch (action.type) {
    case 'setItems': {
      return state.set('items', action.payload.items)
    }
    case 'deleteItem': {
      return state.set(
        'items',
        state.items.filter((item) => item.id !== action.payload.item.id)
      )
    }
  }
}

const vmContext = React.createContext<{
  deleteItem: (item: RecordOf<ItemVo>) => void
}>(
  new Proxy({} as any, {
    get(): never {
      throw new Error('Not Implemented')
    }
  })
)

const ItemList = (): React.ReactElement => {
  const [state, dispatch] = React.useReducer(reducer, new ItemListViewModel())
  React.useEffect(() => {
    const storage = new Storage(chrome.storage.sync)

    // eslint-disable-next-line no-void
    void pipe(
      storage.getItems,
      TE.map((items) => {
        console.log(items)
        dispatch({ type: 'setItems', payload: { items } })
      })
    )()
  }, [])

  return (
    <div>
      <vmContext.Provider
        value={{
          deleteItem(item): void {
            dispatch({ type: 'deleteItem', payload: { item } })
          }
        }}>
        <ul className="leading-6">
          <li className="flex font-bold border-b">
            <div className="flex-none" style={{ width: 330 }}>
              URL
            </div>
            <div className="flex-none" style={{ width: 140 }}>
              {chrome.i18n.getMessage('alias')}
            </div>
            <div className="flex-none" style={{ width: 40 }}></div>
          </li>
          {state.items.map((item) => {
            return <ItemListItem key={item.url} item={item} />
          })}
        </ul>
      </vmContext.Provider>
    </div>
  )
}

const Edit = (): React.ReactElement => {
  return (
    <div className="p-2 m-auto w-full space-y-2" style={{ maxWidth: 500 }}>
      <h2 className="text-xl my-2 font-bold">
        {chrome.i18n.getMessage('edit')}
      </h2>
      <ItemList />
      <div className="text-xs flex justify-end space-x-1 opacity-50 hover:opacity-100 duration-100">
        <span>Created by</span>
        <img
          className="w-4 h-4"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABblBMVEUAAAA9MEI8L0ECAQIzKDcAAAAAAAAAAAAhGiQ1Kjo5LT46Lj87LkA7LkA+MEM8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0E8L0FENUoAAAA8L0E8L0EUEBY2Kjo8L0E7LkA7LkA+MUM7LkA8L0E6LkE6LkA5LkA7L0E9L0FlQUqYVlSaV1VrQ0s+MEFkQEmVVVSfWVaATE9LNkQ7LkFlQEredGPreWboeGV3SE1vRUzhdWTqeWbve2bBaF1ROEWXVlTxfGeHT1FnQkqoXVhiP0msX1jtemZ7Sk5SOEa4ZFtVOkahWlZmQUo4LUA9MEGnXFeUVFNKNURBMUJnQUpjQEnVcGHyfGfSb2GKUFFEMkNYO0fdc2PwfGdAMUJDMkJePkjddGPLbF9FM0OiWlbue2ZoQkpHNEOsX1m2Y1vneGW9Zlzcc2NCMkKcWFXNbV9pQktLNURWOkc/MEJXOkdgPkn///9LNMr8AAAAJnRSTlMAAAAAAAoFAQcvcrLf+AM3l9/7GorqNsP+QtnCAgI46Qgv3t73A6ZAUkQAAAABYktHRHmh3NTQAAAACXBIWXMAACxLAAAsSwGlPZapAAAAB3RJTUUH5QENFhUvwZjVcwAAAY5JREFUOMuFk2dXwjAUQEPYFGTvPWwixY2iojjAhRsRce+9UHH8fJMWhHIo3A/Nad89afIGUKoE1BqtjtEbWNagZ3Rajbr2WQlUgCLrMZrMFlTDYjYZe2R8QMULEFptdiTCbrNCWBcgdDhdqAWX00ENKkDo9mACQrgPx7l/xeMmBhHk0OFJ9A8MDg0nRkaTY+OphuGAciIorF48MTmVTk/PZGYzc/MLDcNrVRDBZ0M4m1tcWl5Zza+tZzc2GwKy+VTAHwgivJXf3ing3Vxxr1Dimk4aDPhByISosB9HuHxweHR80iwgUwiEI3UBcafJs/Oi6LKRMNBZGsLF5dX1zW3zFhYdYMiC7+4f4oh7fHouvryWRFswIEqF7FuZ5Knynkl/fKZEQhTE6FL9qpAn9/3zWxWdEaEYYOnCYeEV45Y4YgVBGlb4hTQx/pAdiPLX7ADDJ0oakiiaamlIqmmxpCHFouWWhJabNowktGFoy0nFhZajTds+Xmtavu3bxmtt331wuo9e2+HtrQ9vt/H/A8eEjgwvbvRXAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTAxLTEzVDIyOjIxOjQ3KzAxOjAwrfUJ0wAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wMS0xM1QyMjoyMTo0NyswMTowMNyosW8AAABXelRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeJzj8gwIcVYoKMpPy8xJ5VIAAyMLLmMLEyMTS5MUAxMgRIA0w2QDI7NUIMvY1MjEzMQcxAfLgEigSi4A6hcRdPJCNZUAAAAASUVORK5CYII="
        />{' '}
        <a
          href="https://github.com/nju33"
          onClick={(event) => {
            event.preventDefault()
            chrome.tabs.create({ url: 'https://github.com/nju33' })
          }}
          className="underline hover:text-yellow-500 duration-100">
          nju33
        </a>
      </div>
    </div>
  )
}

render(<Edit />, document.getElementById('app'))
