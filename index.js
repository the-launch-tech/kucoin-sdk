const crypto = require('crypto')
const axios = require('axios')

class Kucoin {
  constructor({ SECRET, KEY, PASSPHRASE }) {
    this.SECRET = SECRET
    this.KEY = KEY
    this.PASSPHRASE = PASSPHRASE
    this.base = 'https://api.kucoin.com'
    this.prefix = '/v1'

    this.Axios = axios.create({
      baseURL: 'https://api.kucoin.com',
      headers: {
        'Content-Type': 'application/json',
        'KC-API-KEY': this.KEY,
      },
    })

    this.axiosReducer = {
      GET: async (endpoint, coinfig) => {
        const response = await this.Axios.get(endpoint, config)
        return this.tryCatch(response, endpoint)
      },
      PUT: async (endpoint, data, coinfig) => {
        const response = await this.Axios.put(endpoint, data, config)
        return this.tryCatch(response, endpoint)
      },
      POST: async (endpoint, data, coinfig) => {
        const response = await this.Axios.post(endpoint, data, config)
        return this.tryCatch(response, endpoint)
      },
      DELETE: async (endpoint, coinfig) => {
        const response = await this.Axios.delete(endpoint, config)
        return this.tryCatch(response, endpoint)
      },
    }
  }

  tryCatch(response, url) {
    try {
      return response.data
    } catch (e) {
      console.log(`Error making request to ${url}! Stacktrace: ${e}.`, e)
    }
  }

  signature(path, queryString, timestamp) {
    const strForSign = path + '/' + timestamp + '/' + queryString
    const signatureStr = new Buffer(strForSign).toString('base64')
    const signatureResult = crypto
      .createHmac('sha256', this.SECRET)
      .update(signatureStr)
      .digest('hex')
    return signatureResult
  }

  getQueryString() {
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

  getPath(endpoint) {
    return this.prefix + endpoint
  }

  getTimestamp() {
    return new Date().getTime()
  }

  async request(method, endpoint, params) {
    const path = this.getPath(endpoint)
    const requestAction = this.axiosReducer[method]
    const response = await requestAction(path, params, {})
    return response
  }

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

  async getExchangeRates(params = {}) {
    return await this.request('GET', '/open/currencies', params)
  }
}

module.exports = Kucoin
