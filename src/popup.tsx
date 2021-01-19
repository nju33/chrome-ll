import './main.css'
import { yupResolver } from '@hookform/resolvers/yup'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'
import React from 'react'
import { render } from 'react-dom'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Item, Storage, StorageError } from './modules/storage'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  alias: yup.string().min(2).required()
})

interface FormValues {
  alias: string
  url: string
}

const Form = (): React.ReactElement => {
  const [message, setMessage] = React.useState<string | undefined>(undefined)
  const [error, setError] = React.useState<StorageError | undefined>(undefined)
  const { errors, handleSubmit, register, reset } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      url: '',
      alias: ''
    }
  })

  return (
    <form
      className="space-y-2"
      onSubmit={handleSubmit((values) => {
        const storage = new Storage(chrome.storage.sync)
        const item = new Item(values)

        // eslint-disable-next-line no-void
        void pipe(
          storage.addItem(item),
          TE.mapLeft((e) => setError(e))
        )().then(() => {
          reset()
          setMessage('Registration was successful!')
          setTimeout(() => {
            setMessage(undefined)
          }, 5000)
        })
      })}>
      <div className="font-bold text-center my-2 text-xl">
        {chrome.i18n.getMessage('registrationForm')}
      </div>
      <div>
        <label htmlFor="form-url" className="flex flex-col">
          <div className="flex items-center">
            <span className="flex-none w-12 text-right pr-1 font-bold">
              URL
            </span>
            <input
              ref={register}
              id="form-url"
              name="url"
              className="py-1 px-2 w-64 border rounded"
            />
          </div>
          {typeof errors.url?.message === 'string' && (
            <div className="flex px-2">
              <span className="flex-none w-12" />
              <span className="text-red-500">{errors.url?.message}</span>
            </div>
          )}
        </label>
      </div>
      <div>
        <label htmlFor="form-alias" className="flex flex-col">
          <div className="flex items-center">
            <span className="flex-none w-12 text-right pr-1 font-bold">
              {chrome.i18n.getMessage('alias')}
            </span>
            <input
              ref={register}
              id="form-alias"
              name="alias"
              className="py-1 px-2 border rounded"
            />
          </div>
          {typeof errors.alias?.message === 'string' && (
            <div className="flex px-2">
              <span className="flex-none w-12" />
              <span className="text-red-500">{errors.alias?.message}</span>
            </div>
          )}
        </label>
      </div>
      <div className="flex">
        <span className="flex-none w-12"></span>
        <div className="flex w-full justify-between">
          <button className="px-2 py-1 border border-gray-400 bg-gray-200 rounded duration-100">
            {chrome.i18n.getMessage('reset')}
          </button>
          <button
            className="px-2 py-1 border border-green-400 bg-green-200 rounded duration-100"
            type="submit">
            <i className="far fa-plus mr-1"></i>
            {chrome.i18n.getMessage('add')}
          </button>
        </div>
      </div>
      {error instanceof StorageError && (
        <div className="flex justify-end">
          <span className="text-red-500">{error.message}</span>
        </div>
      )}
      {typeof message === 'string' && (
        <div className="flex justify-end">
          <span className="text-green-500">{message}</span>
        </div>
      )}
    </form>
  )
}

const Popup = (): React.ReactElement => {
  return (
    <div className="p-2 space-y-2">
      <div className="flex justify-end">
        <a
          className="cursor-pointer"
          onClick={() => {
            chrome.tabs.create({
              url: chrome.runtime.getURL('edit.html')
            })
          }}>
          {chrome.i18n.getMessage('goToEditPage')}
          <i className="far fa-arrow-right ml-1"></i>
        </a>
      </div>
      <Form />
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

render(<Popup />, document.getElementById('app'))
