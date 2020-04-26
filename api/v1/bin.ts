import { NowRequest, NowResponse } from '@now/node'
import fetch from 'cross-fetch'
import log4js from 'log4js'

const COLLECTION_ID =
  process.env.NODE_ENV === 'production'
    ? '5e9dc4532940c704e1db89d3' /* chrome-ll */
    : '5d6c0e135c04dd327acf9704' /* tmp */

const NJU33_JSON_BIN_URL = 'https://nju33-jsonbin-api.now.sh'

const AVAILABLE_METHOD = Object.freeze({
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
})

interface LLItem {
  alias: string
  url: string
}

interface LLRecord {
  items: LLItem[]
}

interface JsonbinBinsGetResult {
  record: LLRecord
  metadata: {
    id: string
    private: boolean
    collectionId: string
  }
}

interface JsonbinBinsPostResult {
  record: LLRecord
  metadata: {
    id: string
    createdAt: string
    private: boolean
    collectionId: string
  }
}

interface JsonbinBinsPutResult {
  record: LLRecord
  metadata: {
    parentId: string
    private: boolean
  }
}

interface JsonbinBinsDeleteResult {
  metadata: {
    id: string
    versionsDeleted: number
  }
  message: string
}

interface JsonbinApiImpl {
  get(binId: string): Promise<JsonbinBinsGetResult>
  post(name: string, record: LLRecord): Promise<JsonbinBinsPostResult>
  put(binId: string, record: LLRecord): Promise<JsonbinBinsPutResult>
  delete(binId: string): Promise<JsonbinBinsDeleteResult>
}

class JsonbinApi implements JsonbinApiImpl {
  private readonly url = `${NJU33_JSON_BIN_URL}/api/v3/b`

  private async handleErrors(response: Response): Promise<Response> {
    if (response.ok) {
      return response
    }

    // ref: https://jsonbin.io/api-reference/v3/bins/read#request-response
    // They have an error message in JSON
    if ([400, 401, 403, 404].includes(response.status)) {
      const result = await response.json()
      throw new Error(result.message)
    }

    throw new Error(response.statusText)
  }

  async get(binId: string): Promise<JsonbinBinsGetResult> {
    return await fetch(`${this.url}?binId=${binId}`, {
      method: AVAILABLE_METHOD.GET
    })
      .catch((errorResponse) => {
        throw errorResponse
      })
      .then(this.handleErrors)
      .then(async (successResponse: Response) => {
        return await successResponse.json()
      })
  }

  async post(name: string, record: LLRecord): Promise<JsonbinBinsPostResult> {
    return await fetch(this.url, {
      method: AVAILABLE_METHOD.POST,
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        collectionId: COLLECTION_ID,
        record,
        name
      })
    })
      .catch((errorResponse) => {
        throw errorResponse
      })
      .then(this.handleErrors)
      .then(async (successResponse: Response) => {
        return await successResponse.json()
      })
  }

  async put(binId: string, record: LLRecord): Promise<JsonbinBinsPutResult> {
    return await fetch(this.url, {
      method: AVAILABLE_METHOD.PUT,
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ binId, record })
    })
      .catch((errorResponse) => {
        throw errorResponse
      })
      .then(this.handleErrors)
      .then(async (successResponse: Response) => {
        return await successResponse.json()
      })
  }

  async delete(binId: string): Promise<JsonbinBinsDeleteResult> {
    return await fetch(this.url, {
      method: AVAILABLE_METHOD.DELETE,
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({ binId })
    })
      .catch((errorResponse) => {
        throw errorResponse
      })
      .then(this.handleErrors)
      .then(async (successResponse: Response) => {
        return await successResponse.json()
      })
  }
}

const createHandler = ({
  api,
  logger
}: {
  api: JsonbinApi
  logger: log4js.Logger
}) => async (request: NowRequest, response: NowResponse) => {
  logger.trace('request')
  logger.info('caught new request: ', {
    method: request.method,
    query: request.query,
    body: request.body
  })

  if (request.method === AVAILABLE_METHOD.GET) {
    logger.trace('method: GET')

    const { binId } = request.query as { binId?: string }

    if (binId === undefined) {
      const responseData = {
        ok: false,
        error: 'The query requires `binId`'
      }

      logger.info('rerurns 400 BadRequest: ', responseData)

      response.status(400).json(responseData)
      return
    }

    try {
      const data = await api.get(binId)

      logger.trace('the request succseed')
      logger.info('caught the response json: ', data)

      response.status(200).json(data)
    } catch (error) {
      const responseData = {
        ok: false,
        error: error.message
      }

      logger.trace('the response failed')
      logger.info('caught the response in error: ', responseData)

      response.status(400).json(responseData)
    }

    return
  }

  if (request.method === AVAILABLE_METHOD.POST) {
    logger.trace('method: POST')

    const { name, record } = request.body as {
      name?: string
      record?: Partial<LLRecord>
    }

    if (!(typeof name === 'string' && typeof record === 'object')) {
      const responseData = {
        ok: false,
        error: 'the body requires `name` as string and `record` as object'
      }

      logger.trace('bad request')
      logger.info('returns 400 BadRequest: ', responseData)

      response.status(400).json(responseData)
      return
    }

    try {
      const data = await api.post(name, record as LLRecord)

      logger.trace('the request succeed')
      logger.info('caught the request json: ', data)

      response.status(200).json(data)
    } catch (error) {
      const responseData = {
        ok: false,
        error: error.message
      }

      logger.trace('the request failed')
      logger.info('caught the request in error: ', responseData)

      response.status(400).json(responseData)
    }

    return
  }

  if (request.method === AVAILABLE_METHOD.PUT) {
    logger.trace('method: PUT')

    const { binId, record } = request.body as {
      binId?: string
      record?: Partial<LLItem>
    }

    if (!(typeof binId === 'string' && typeof record === 'object')) {
      const responseData = {
        ok: false,
        error: 'the body requires `binId` as string and `record` as object'
      }

      logger.trace('bad request')
      logger.info('returns 400 BadRequest: ', responseData)

      response.status(400).json({
        ok: false,
        error: 'the body requires `binId` as string and `record` as object'
      })
      return
    }

    try {
      const data = await api.put(binId, record as LLRecord)

      logger.trace('the request succeed')
      logger.info('caught the response jsno: ', data)

      response.status(200).json(data)
    } catch (error) {
      const responseData = {
        ok: false,
        error: error.message
      }

      logger.trace('the request failed')
      logger.info('caught the response in error : ', responseData)

      response.status(400).json(responseData)
    }

    return
  }

  if (request.method === AVAILABLE_METHOD.DELETE) {
    logger.trace('method: DELETE')

    const { binId } = request.body as {
      binId?: string
    }

    if (typeof binId !== 'string') {
      const responseData = {
        ok: false,
        error: 'the body requires `binId` as string'
      }

      logger.trace('bad request')
      logger.info('returns 400 BadRequest: ', responseData)

      response.status(400).json(responseData)
      return
    }

    try {
      const data = await api.delete(binId)

      logger.trace('the request succeed')
      logger.info('caught the response jsno: ', data)

      response.status(200).json(data)
    } catch (error) {
      const responseData = {
        ok: false,
        error: error.message
      }

      logger.trace('the request failed')
      logger.info('caught the response in error : ', responseData)

      response.status(400).json(responseData)
    }

    return
  }

  if (request.method === undefined) {
    response.status(405)
    return
  }

  response
    .status(405)
    .send({ ok: false, error: `${request.method} is not supported` })
}

log4js.addLayout('json', (config: { separator: string }) => {
  return (logEvent) => {
    return `${JSON.stringify(logEvent)}${config.separator}`
  }
})

log4js.configure({
  appenders: {
    out: { type: 'stdout', layout: { type: 'json', separator: ',' } }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'info'
    }
  }
})

const logger = log4js.getLogger('/api/v1/bin')

export default createHandler({ api: new JsonbinApi(), logger })
