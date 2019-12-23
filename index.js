const crypto = require('crypto')
const axios = require('axios')

class Kucoin {
  constructor({ SECRET, KEY }) {
    this.SECRET = SECRET
    this.KEY = KEY
    this.prefix = '/v1'
    this.sandbox = 'https://openapi-sandbox.kucoin.com'

    this.Axios = axios.create({
      baseURL: 'https://openapi-v2.kucoin.com/api',
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': this.KEY,
      },
    })

    this.axiosReducer = {
      GET: async (endpoint, params, options) => {
        const response = await this.Axios.get(endpoint, { params }, options)
        return this.tryCatch(response, endpoint)
      },
      PUT: async (endpoint, params, options) => {
        const response = await this.Axios.put(endpoint, params, options)
        return this.tryCatch(response, endpoint)
      },
      POST: async (endpoint, params, options) => {
        const response = await this.Axios.post(endpoint, params, options)
        return this.tryCatch(response, endpoint)
      },
      DELETE: async (endpoint, options) => {
        const response = await this.Axios.delete(endpoint, options)
        return this.tryCatch(response, endpoint)
      },
    }
  }

  /*
   * Try catch on Axios request
   * response Object
   * url String
   */
  tryCatch(response, url) {
    try {
      return response.data
    } catch (e) {
      console.log(`Error making request to ${url}! Stacktrace: ${e}.`, e)
    }
  }

  /*
   * Create authorization signature
   * path String
   * queryString String
   * timestamp DATETIME
   */
  getSignature(path, queryString, timestamp) {
    const strForSign = path + '/' + timestamp + '/' + queryString
    const signatureStr = new Buffer(strForSign).toString('base64')
    const signatureResult = crypto
      .createHmac('sha256', this.SECRET)
      .update(signatureStr)
      .digest('hex')
    return signatureResult
  }

  /*
   * Get Signature queryString
   * params Object
   */
  getQueryString(params) {
    let queryString
    if (params !== undefined) {
      queryString = []
      for (let key in params) {
        queryString.push(key + '=' + params[key])
      }
      queryString.sort()
      queryString = queryString.join('&')
    } else {
      queryString = ''
    }
    return queryString
  }

  /*
   * Get Signature path
   */
  getPath(endpoint) {
    return this.prefix + endpoint
  }

  /*
   * Get NONCE timestamp
   */
  getTimestamp() {
    return new Date().getTime()
  }

  /*
   * Make unsigned request
   * method String
   * endpoint String
   * params Object [Optional]
   */
  async request(method, endpoint, params) {
    const path = this.getPath(endpoint)
    const requestAction = this.axiosReducer[method]
    const response = await requestAction(path, params, {})
    return response
  }

  /*
   * Make signed request
   * method String
   * endpoint String
   * params Object [Optional]
   */
  async signedRequest(method, endpoint, params) {
    const path = this.getPath(endpoint)
    const timestamp = this.getTimestamp()
    const queryString = this.getQueryString(params)
    const signature = this.getSignature(path, queryString, timestamp)
    const requestAction = this.axiosReducer[method]
    const response = await requestAction(path, params, {
      headers: {
        'KC-API-NONCE': timestamp,
        'KC-API-SIGNATURE': signature,
      },
    })
    return response
  }

  /*
   * GET /api/v1/currencies
   */
  async getCurrencies(params = {}) {
    return await this.request('GET', '/currencies', params)
  }

  /*
   * GET /api/v1/symbols
   * market String [Optional]
   */
  async getSymbolsList(params = {}) {
    return await this.request('GET', '/symbols', params)
  }

  /*
   * GET /api/v1/market/orderbook/level1
   * symbol String
   */
  async getTicker(params = {}) {
    return await this.request('GET', '/market/orderbook/level1', params)
  }

  /*
   * GET /api/v1/market/allTickers
   */
  async getAllTickers(params = {}) {
    return await this.request('GET', '/market/allTickers', params)
  }

  /*
   * GET /api/v1/market/stats
   * symbol String
   */
  async get24HourStats(params = {}) {
    return await this.request('GET', '/market/stats', params)
  }

  /*
   * GET /api/v1/markets
   */
  async getMarketList(params = {}) {
    return await this.request('GET', '/markets', params)
  }

  /*
   * GET /api/v1/market/orderbook/level2_20
   * GET /api/v1/market/orderbook/level2_100
   * level Int
   * symbol String
   */
  async getPartOrderBook(level, params = {}) {
    return await this.request('GET', '/market/orderbook/level2_' + level, params)
  }

  /*
   * GET /api/v1/market/orderbook/level2_20
   * GET /api/v1/market/orderbook/level2_100
   * symbol String
   */
  async getFullOrderBookAggregated(params = {}) {
    return await this.request('GET', '/market/orderbook/level2', params)
  }

  /*
   * GET /api/v1/market/orderbook/level3
   * symbol String
   */
  async getFullOrderBookAtomic(params = {}) {
    return await this.request('GET', '/market/orderbook/level3', params)
  }

  /*
   * GET /api/v1/market/histories
   * symbol String
   */
  async getTradeHistories(params = {}) {
    return await this.request('GET', '/market/histories', params)
  }

  /*
   * GET /api/v1/market/candles
   * symbol String
   * startAt long
   * endAt long
   * type String 1min, 3min, 5min, 15min, 30min, 1hour, 2hour, 4hour, 6hour, 8hour, 12hour, 1day, 1week
   */
  async getKlines(params = {}) {
    return await this.request('GET', '/market/candles', params)
  }

  /*
   * GET /api/v1/currencies/{currency}
   * chain String [Optional]
   */
  async getCurrencyDetail(currency, params = {}) {
    return await this.request('GET', '/currencies/' + currency, params)
  }

  /*
   * GET /api/v1/prices
   * base String
   * currencies String
   */
  async getFiatPrice(params = {}) {
    return await this.request('GET', '/prices', params)
  }
}

// Export class for use as
// new Kucoin({ Key, SECRET })
module.exports = Kucoin
