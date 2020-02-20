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
        try {
          const { data } = await this.Axios.get(endpoint, { params }, options)
          return data
        } catch (e) {
          throw e
        }
      },
      PUT: async (endpoint, params, options) => {
        try {
          const { data } = await this.Axios.put(endpoint, params, options)
          return data
        } catch (e) {
          throw e
        }
      },
      POST: async (endpoint, params, options) => {
        try {
          const { data } = await this.Axios.post(endpoint, params, options)
          return data
        } catch (e) {
          throw e
        }
      },
      DELETE: async (endpoint, options) => {
        try {
          const { data } = await this.Axios.delete(endpoint, options)
          return data
        } catch (e) {
          throw e
        }
      },
    }

    const bindings = [
      'request',
      'signedRequest',
      'getCurrencies',
      'getSymbolsList',
      'getTicker',
      'getAllTickers',
      'get24HourStats',
      'getMarketList',
      'getPartOrderBook',
      'getFullOrderBookAggregated',
      'getFullOrderBookAtomic',
      'getTradeHistories',
      'getKlines',
      'getCurrencyDetail',
      'getFiatPrice',
      'listAccounts',
      'getUserSubInfo',
      'createAnAccount',
      'getAnAccount',
      'getAccountLedgers',
      'getHolds',
      'getSubAccountBalance',
      'getAggregatedSubAccountBalance',
      'getTheTransferable',
      'transferBetweenMasterAndSubUser',
      'innerTransfer',
      'createDepositAddress',
      'getDepositAddress',
      'getDepositList',
      'getHistoricalDepositsList',
      'getWithdrawalsList',
      'getHistoricalWithdrawalsList',
      'getWithdrawalQuotas',
      'applyWithdrawal',
      'cancelWithdrawal',
      'placeANewOrder',
      'cancelAnOrder',
      'cancelAllOrders',
      'listOrders',
      'getHistoricalOrdersList',
      'recentOrders',
      'getAnOrder',
      'listFills',
      'recentFills',
      'getMarkPrice',
      'getMarginConfigurationInfo',
      'getMarginAccount',
      'postBorrowOrder',
      'getBorrowOrder',
      'getRepayRecord',
      'getRepaymentRecord',
      'oneClickRepayment',
      'marginTradeData',
    ].map(binding => (this[binding] = this[binding].bind(this)))
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
   * @docs https://docs.kucoin.com/#get-symbols-list
   * @request GET /api/v1/symbols
   * @param market String [Optional]
   */
  async getSymbolsList(params = {}) {
    return await this.request('GET', '/symbols', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-ticker
   * @request GET /api/v1/market/orderbook/level1
   * @param symbol String
   */
  async getTicker(params = {}) {
    return await this.request('GET', '/market/orderbook/level1', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-all-tickers
   * @request GET /api/v1/market/allTickers
   */
  async getAllTickers(params = {}) {
    return await this.request('GET', '/market/allTickers', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-24hr-stats
   * @request GET /api/v1/market/stats
   * @param symbol String
   */
  async get24HourStats(params = {}) {
    return await this.request('GET', '/market/stats', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-market-list
   * @request GET /api/v1/markets
   */
  async getMarketList(params = {}) {
    return await this.request('GET', '/markets', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-currencies
   * @request GET /api/v1/currencies
   */
  async getCurrencies(params = {}) {
    return await this.request('GET', '/currencies', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-currency-detail
   * @request GET /api/v1/currencies/{currency}
   * @param chain String [Optional]
   */
  async getCurrencyDetail(currency, params = {}) {
    return await this.request('GET', '/currencies/' + currency, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-fiat-price
   * @request GET /api/v1/prices
   * @param base String
   * @param currencies String
   */
  async getFiatPrice(params = {}) {
    return await this.request('GET', '/prices', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-part-order-book-aggregated
   * @request GET /api/v1/market/orderbook/level2_20
   * @request GET /api/v1/market/orderbook/level2_100
   * @param level Int
   * @param symbol String
   */
  async getPartOrderBook(level, params = {}) {
    return await this.request('GET', '/market/orderbook/level2_' + level, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-full-order-book-aggregated
   * @request GET /api/v1/market/orderbook/level2_20
   * @request GET /api/v1/market/orderbook/level2_100
   * @param symbol String
   */
  async getFullOrderBookAggregated(params = {}) {
    return await this.request('GET', '/market/orderbook/level2', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-full-order-book-atomic
   * @request GET /api/v1/market/orderbook/level3
   * @param symbol String
   */
  async getFullOrderBookAtomic(params = {}) {
    return await this.request('GET', '/market/orderbook/level3', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-trade-histories
   * @request GET /api/v1/market/histories
   * @param symbol String
   */
  async getTradeHistories(params = {}) {
    return await this.request('GET', '/market/histories', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-klines
   * @request GET /api/v1/market/candles
   * @param symbol String
   * @param startAt long
   * @param endAt long
   * @param type String 1min, 3min, 5min, 15min, 30min, 1hour, 2hour, 4hour, 6hour, 8hour, 12hour, 1day, 1week
   */
  async getKlines(params = {}) {
    return await this.request('GET', '/market/candles', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-user-info-of-all-sub-accounts
   * @request GET /api/v1/sub/user
   */
  async getUserSubInfo(params = {}) {
    return await this.request('GET', '/sub/user', params)
  }

  /*
   * @docs https://docs.kucoin.com/#create-an-account
   * @request POST /api/v1/accounts
   * @param currency String [optional]
   * @param type (main, trade or margin) [optional]
   */
  async createAnAccount(params = {}) {
    return await this.request('POST', '/accounts', params)
  }

  /*
   * @docs https://docs.kucoin.com/#list-accounts
   * @request GET /api/v1/accounts
   * @param currency String [optional]
   * @param type (main, trade or margin) [optional]
   */
  async listAccounts(params = {}) {
    return await this.request('GET', '/accounts', params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-an-account
   * @request GET /api/v1/accounts/:accountId
   * @param accountId String
   */
  async getAnAccount(params = {}) {
    return await this.request('GET', `/accounts/${params.accountId}`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-account-ledgers
   * @request GET /api/v1/accounts/:accountId/ledgers
   * @param accountId String
   * @param startAt DateTime [optional]
   * @param nedAt DateTime [optional]
   */
  async getAccountLedgers(params = {}) {
    return await this.request('GET', `/accounts/${params.accountId}/ledgers`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-holds
   * @request GET /api/v1/accounts/:accountId/holds
   * @param accountId String
   */
  async getHolds(params = {}) {
    return await this.request('GET', `/accounts/${params.accountId}/holds`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-account-balance-of-a-sub-account
   * @request GET /api/v1/sub-accounts/:subUserId
   * @param subUserId String
   */
  async getSubAccountBalance(params = {}) {
    return await this.request('GET', `/sub-accounts/${params.subUserId}`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-the-aggregated-balance-of-all-sub-accounts
   * @request GET /api/v1/sub-accounts
   */
  async getAggregatedSubAccountBalance(params = {}) {
    return await this.request('GET', `/sub-accounts`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-the-transferable
   * @request GET /api/v1/accounts/transferable
   * @param currency String
   * @param type String [MAIN, TRADE, MARGIN]
   */
  async getTheTransferable(params = {}) {
    return await this.request('GET', `/accounts/transferable`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#transfer-between-master-user-and-sub-user
   * @request GET /api/v1/accounts/sub-transfer
   * @param clientOid String
   * @param currency String
   * @param amount String/Int
   * @param direction String [OUT, IN]
   * @param accountType String [optional | MAIN]
   * @param subAccountType String [optional | MAIN, TRADE, MARGIN]
   * @param subUserId String
   */
  async transferBetweenMasterAndSubUser(params = {}) {
    return await this.request('GET', `/accounts/sub-transfer`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#inner-transfer
   * @request GET /api/v1/accounts/inner-transfer
   * @param clientOid String
   * @param currency String
   * @param from String [MAIN, TRADE, MARGIN]
   * @param to String [MAIN, TRADE, MARGIN]
   * @param amount String/Int
   */
  async innerTransfer(params = {}) {
    return await this.request('GET', `/accounts/inner-transfer`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#create-deposit-address
   * @request POST /api/v1/deposit-addresses
   * @param currency String
   * @param chain String [optional]
   */
  async createDepositAddress(params = {}) {
    return await this.request('POST', `/deposit-addresses`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-deposit-address
   * @request GET /api/v1/deposit-addresses
   * @param currency String
   * @param chain String [optional]
   */
  async getDepositAddress(params = {}) {
    return await this.request('GET', `/deposit-addresses`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-deposit-list
   * @request GET /api/v1/deposits
   * @param currency String [optional]
   * @param startAt Long [optional]
   * @param endAt Long [optional]
   * @param status String [optional]
   */
  async getDepositList(params = {}) {
    return await this.request('GET', `/deposits`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-v1-historical-deposits-list
   * @request GET /api/v1/hist-deposits
   * @param currency String [optional]
   * @param startAt Long [optional]
   * @param endAt Long [optional]
   * @param status String [optional]
   */
  async getHistoricalDepositsList(params = {}) {
    return await this.request('GET', `/hist-deposits`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-withdrawals-list
   * @request GET /api/v1/withdrawals
   * @param currency String [optional]
   * @param startAt Long [optional]
   * @param endAt Long [optional]
   * @param status String [optional]
   */
  async getWithdrawalsList(params = {}) {
    return await this.request('GET', `/withdrawals`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-v1-historical-withdrawals-list
   * @request GET /api/v1/hist-withdrawals
   * @param currency String [optional]
   * @param startAt Long [optional]
   * @param endAt Long [optional]
   * @param status String [optional]
   * @param currentPage Int [optional]
   * @param pageSize Int [optional]
   */
  async getHistoricalWithdrawalsList(params = {}) {
    return await this.request('GET', `/hist-withdrawals`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-withdrawal-quotas
   * @request GET /api/v1/withdrawals/quotas
   * @param currency String [optional]
   * @param chain String [optional]
   */
  async getWithdrawalQuotas(params = {}) {
    return await this.request('GET', `/withdrawals/quotas`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#apply-withdraw-2
   * @request POST /api/v1/withdrawals
   * @param currency String
   * @param address String
   * @param amount Number
   * @param memo String [optional]
   * @param isInner Boolean [optional]
   * @param remark String [optional]
   * @param chain String [optional]
   */
  async applyWithdrawal(params = {}) {
    return await this.request('POST', `/withdrawals`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#cancel-withdrawal
   * @request DELETE /api/v1/withdrawals/:withdrawalId
   * @param withdrawalId String
   */
  async cancelWithdrawal(params = {}) {
    return await this.request('DELETE', `/withdrawals/${params.withdrawalId}`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#place-a-new-order
   * @request POST /api/v1/orders
   * @param clientOid String
   * @param side String
   * @param symbol String
   * @param type String [optional]
   * @param remark String [optional]
   * @param stop String [optional]
   * @param stopPrice String [optional]
   * @param stp String [optional]
   * @param tradeType String [optional]
   *
   * LIMIT ORDER PARAMETERS
   * @param price String
   * @param size String
   * @param timeInForce String [optional]
   * @param cancelAfter Long [optional]
   * @param postOnly Boolean [optional]
   * @param hidden Boolean [optional]
   * @param iceberg Boolean [optional]
   * @param visibleSize String [optional]
   *
   * MARKET ORDER PARAMETERS
   * @param size String [optional]
   * @param funds String [optional]
   */
  async placeANewOrder(params = {}) {
    return await this.request('POST', `/orders`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#cancel-an-order
   * @request DELETE /api/v1/orders/:orderId
   * @param orderId String
   */
  async cancelAnOrder(params = {}) {
    return await this.request('DELETE', `/orders/${params.orderId}`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#cancel-all-orders
   * @request DELETE /api/v1/orders
   * @param symbol String [optional]
   * @param tradeType String [optional]
   */
  async cancelAllOrders(params = {}) {
    return await this.request('DELETE', `/orders`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#list-orders
   * @request GET /api/v1/orders
   * @param status String [optional]
   * @param symbol String [optional]
   * @param side String [optional]
   * @param type String [optional]
   * @param tradeType String [optional]
   * @param startAt Long [optional]
   * @param endAt Long [optional]
   */
  async listOrders(params = {}) {
    return await this.request('GET', `/orders`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-v1-historical-orders-list
   * @request GET /api/v1/hist-orders
   * @param currentPage Int [optional]
   * @param pageSize Int [optional]
   * @param symbol String [optional]
   * @param side String [optional]
   * @param startAt Long [optional]
   * @param endAt Long [optional]
   */
  async getHistoricalOrdersList(params = {}) {
    return await this.request('GET', `/hist-orders`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#recent-orders
   * @request GET /api/v1/limit/orders
   */
  async recentOrders(params = {}) {
    return await this.request('GET', `/limit/orders`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-an-order
   * @request GET /api/v1/orders/:orderId
   * @param orderId String
   */
  async getAnOrder(params = {}) {
    return await this.request('GET', `/orders/${params.orderId}`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#list-fills
   * @request GET /api/v1/fills
   * @param orderId String [optional]
   * @param symbol String [optional]
   * @param side String [optional]
   * @param type String [optional]
   * @param startAt Long [optional]
   * @param endAt Long [optional]
   * @param tradeType String
   */
  async listFills(params = {}) {
    return await this.request('GET', `/fills`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#recent-fills
   * @request GET /api/v1/limit/fills
   */
  async recentFills(params = {}) {
    return await this.request('GET', `/limit/fills`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-mark-price
   * @request GET /api/v1/mark-price/:symbol/current
   * @param symbol String
   */
  async getMarkPrice(params = {}) {
    return await this.request('GET', `/mark-price/${params.symbol}/current`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-margin-configuration-info
   * @request GET /api/v1/margin/config
   */
  async getMarginConfigurationInfo(params = {}) {
    return await this.request('GET', `/margin/config`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-margin-account
   * @request GET /api/v1/margin/account
   */
  async getMarginAccount(params = {}) {
    return await this.request('GET', `/margin/account`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#post-borrow-order
   * @request POST /api/v1/margin/borrow
   * @param currency String
   * @param type String
   * @param size BigDecimal
   * @param maxRate BigDecimal
   * @param term String
   */
  async postBorrowOrder(params = {}) {
    return await this.request('POST', `/margin/borrow`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-borrow-order
   * @request GET /api/v1/margin/borrow
   * @param orderId String
   */
  async getBorrowOrder(params = {}) {
    return await this.request('GET', `/margin/borrow`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-repay-record
   * @request GET /api/v1/margin/borrow/outstanding
   * @param currency String [optional]
   */
  async getRepayRecord(params = {}) {
    return await this.request('GET', `/margin/borrow/outstanding`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#get-repayment-record
   * @request GET /api/v1/margin/borrow/repaid
   * @param currency String [optional]
   */
  async getRepaymentRecord(params = {}) {
    return await this.request('GET', `/margin/borrow/repaid`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#one-click-repayment
   * @request POST /api/v1/margin/repay/all
   * @param currency String
   * @param sequence String
   * @param size BigDecimal
   */
  async oneClickRepayment(params = {}) {
    return await this.request('POST', `/margin/repay/all`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#repay-a-single-order
   * @request POST /api/v1/margin/repay/single
   * @param currency String
   * @param tradeId String
   * @param size BigDecimal
   */
  async repayASingleOrder(params = {}) {
    return await this.request('POST', `/margin/repay/single`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#margin-trade-data
   * @request GET /api/v1/margin/trade/last
   * @param currency String
   */
  async marginTradeData(params = {}) {
    return await this.request('GET', `/margin/trade/last`, params)
  }

  /*
   * @docs https://docs.kucoin.com/#server-time
   * @request GET /api/v1/timestamp
   */
  async serverTime(params = {}) {
    return await this.request('GET', `/timestamp`, params)
  }
}

// Export class for use as
// new Kucoin({ Key, SECRET })
module.exports = Kucoin
