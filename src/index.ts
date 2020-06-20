import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'

import { KucoinSDK } from './types'

import * as Utils from './utils'
import Http from './Http'

const GET: string = 'GET'
const POST: string = 'POST'
const PUT: string = 'PUT'
const DELETE: string = 'DELETE'

class Kucoin {
  private SECRET: string
  private KEY: string
  private PASSPHRASE: string
  private axios: AxiosInstance
  public prefix: string

  constructor({ SECRET, KEY, PASSPHRASE, isTest }: KucoinSDK.Params) {
    this.SECRET = SECRET
    this.KEY = KEY
    this.PASSPHRASE = PASSPHRASE
    this.prefix = '/api/v1'
    this.axios = axios.create({
      baseURL: isTest ? 'https://openapi-sandbox.kucoin.com' : 'https://openapi-v2.kucoin.com',
      headers: {
        'Content-Type': 'application/json',
        'KC-API-PASSPHRASE': this.PASSPHRASE,
        'KC-API-KEY': this.KEY,
      },
    })
  }

  /**
   * @docs https://github.com/axios/axios
   * @description You can intercept requests or responses before they are handled by then or catch.
   */
  addRequestInterceptor(
    onBeforeCallback: (
      value: AxiosRequestConfig
    ) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
    onErrorCallback: (error: AxiosError) => AxiosError | Promise<AxiosError>
  ): any {
    return this.axios.interceptors.request.use(onBeforeCallback, onErrorCallback)
  }

  /**
   * @docs https://github.com/axios/axios
   * @description If you need to remove an interceptor later you can.
   */
  removeRequestInterceptor(interceptor: any): void {
    this.axios.interceptors.request.eject(interceptor)
  }

  /**
   * @docs https://github.com/axios/axios
   * @description You can intercept requests or responses before they are handled by then or catch.
   */
  addResponseInterceptor(
    onSuccessCallback: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
    onErrorCallback: (error: AxiosError) => AxiosError | Promise<AxiosError>
  ): any {
    return this.axios.interceptors.response.use(onSuccessCallback, onErrorCallback)
  }

  /**
   * @docs https://github.com/axios/axios
   * @description If you need to remove an interceptor later you can.
   */
  removeResponseInterceptor(interceptor: any): void {
    this.axios.interceptors.request.eject(interceptor)
  }

  private async makeRequest(
    { type, method, endpoint }: KucoinSDK.Request.Args,
    params: KucoinSDK.Http.Params<any>,
    map?: KucoinSDK.Request.Map
  ) {
    const paramError: KucoinSDK.Http.ParamError = Utils.checkParameters(params, map || [])

    if (!!paramError) {
      throw paramError
    }

    try {
      let config: KucoinSDK.Http.Config = {}
      const path: string = Utils.getPath(this.prefix, endpoint)
      if (type === 'private') {
        const timestamp: string = Utils.getTimestamp()
        const queryString: string =
          method === 'GET' || method === 'DELETE'
            ? Utils.getQueryString(params)
            : JSON.stringify(params)
        config = {
          headers: {
            'KC-API-TIMESTAMP': timestamp,
            'KC-API-SIGN': Utils.getSignature(this.SECRET, path, queryString, timestamp, method),
          },
        }
      }

      return await Http(this.axios, method, path, params, config)
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-symbols-list
   * @description Request via this endpoint to get a list of available currency pairs for trading. If you want to get the market information of the trading symbol, please use Get All Tickers.
   */
  async getSymbolsList(
    params: KucoinSDK.Http.Params<{ market?: string }> = {}
  ): Promise<
    KucoinSDK.Http.Data<
      {
        symbol: string
        name: string
        baseCurrency: string
        quoteCurrency: string
        baseMinSize: number
        quoteMinSize: number
        baseMaxSize: number
        quoteMaxSize: number
        baseIncrement: number
        quoteIncrement: number
        priceIncrement: number
        feeCurrency: string
        enableTrading: boolean
        isMarginEnabled: boolean
        priceLimitRate: number
      }[]
    >
  > {
    try {
      return await this.makeRequest({ method: 'GET', endpoint: '/symbols' }, params, [
        { key: 'market' },
      ])
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-ticker
   * @description Request via this endpoint to get Level 1 Market Data. The returned value includes the best bid price and size, the best ask price and size as well as the last traded price and the last traded size.
   */
  async getTicker(
    params: KucoinSDK.Http.Params<{ symbol: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      sequence: number
      bestAsk: number
      size: number
      price: number
      bestBidSize: number
      bestBid: number
      bestAskSize: number
      time: number
    }>
  > {
    try {
      return await this.makeRequest(
        { method: 'GET', endpoint: '/market/orderbook/level1' },
        params,
        [{ key: 'symbol', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-all-tickers
   * @description Request market tickers for all the trading pairs in the market (including 24h volume). On the rare occasion that we will change the currency name, if you still want the changed symbol name, you can use the symbolName field instead of the symbol field via “Get all tickers” endpoint.
   */
  async getAllTickers(): Promise<
    KucoinSDK.Http.Data<{
      time: number
      ticker: {
        symbol: string
        symbolName: string
        buy: number
        sell: number
        changeRate: number
        changePrice: number
        high: number
        low: number
        vol: number
        volValue: number
        last: number
      }[]
    }>
  > {
    try {
      return await this.makeRequest({ method: 'GET', endpoint: '/market/allTickers' }, {})
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-24hr-stats
   * @description Request via this endpoint to get the statistics of the specified ticker in the last 24 hours.
   */
  async get24HourStats(
    params: KucoinSDK.Http.Params<{ symbol: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      symbol: string
      high: number
      vol: number
      volValue: number
      last: number
      low: number
      buy: number
      sell: number
      changePrice: number
      averagePrice: number
      time: number
      changeRate: number
    }>
  > {
    try {
      return await this.makeRequest({ method: 'GET', endpoint: '/market/stats' }, params, [
        { key: 'symbol', required: true },
      ])
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-market-list
   * @description Request via this endpoint to get the transaction currency for the entire trading market.
   */
  async getMarketList(): Promise<
    KucoinSDK.Http.Data<{
      data: string[]
    }>
  > {
    try {
      return await this.makeRequest({ method: 'GET', endpoint: '/markets' }, {})
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-currencies
   * @description Request via this endpoint to get the currency list.
   */
  async getCurrencies(): Promise<
    KucoinSDK.Http.Data<
      {
        currency: string
        name: string
        fullName: string
        precision: number
        withdrawalMinSize: number
        withdrawalMinFee: number
        isWithdrawEnabled: boolean
        isDepositEnabled: boolean
        isMarginEnabled: boolean
        isDebitEnabled: boolean
      }[]
    >
  > {
    try {
      return await this.makeRequest({ method: 'GET', endpoint: '/currencies' }, {})
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-currency-detail
   * @description Request via this endpoint to get the currency details of a specified currency.
   */
  async getCurrencyDetail(
    currency: string,
    params: KucoinSDK.Http.Params<{ chain?: string }> = {}
  ): Promise<
    KucoinSDK.Http.Data<{
      currency: string
      name: string
      fullName: string
      precision: number
      withdrawalMinSize: number
      withdrawalMinFee: number
      isWithdrawEnabled: boolean
      isDepositEnabled: boolean
      isMarginEnabled: boolean
      isDebitEnabled: boolean
    }>
  > {
    try {
      return await this.makeRequest(
        { method: 'GET', endpoint: `/currencies/${currency}` },
        params,
        [{ key: 'chain' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-fiat-price
   * @description Request via this endpoint to get the fiat price of the currencies for the available trading pairs.
   */
  async getFiatPrice(
    params: KucoinSDK.Http.Params<{ base: string; currencies: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      code: number
      data: {
        [currency: string]: number
      }
    }>
  > {
    try {
      return await this.makeRequest({ method: 'GET', endpoint: '/prices' }, params, [
        { key: 'base', required: true },
        { key: 'currencies', required: true },
      ])
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-part-order-book-aggregated
   * @description Request via this endpoint to get a list of open orders for a symbol. Level-2 order book includes all bids and asks (aggregated by price), this level returns only one size for each active price (as if there was only a single order for that price). Query via this endpoint and the system will return only part of the order book to you. If you request level2_20, the system will return you 20 pieces of data (ask and bid data) on the order book. If you request level_100, the system will return 100 pieces of data (ask and bid data) on the order book to you. You are recommended to request via this endpoint as the system reponse would be faster and cosume less traffic. To maintain up-to-date Order Book, please use Websocket incremental feed after retrieving the Level 2 snapshot.
   */
  async getPartOrderBook(
    level: number,
    params: KucoinSDK.Http.Params<{ symbol: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      sequence: number
      time: number
      bids: number[][]
      asks: number[][]
    }>
  > {
    try {
      return await this.makeRequest(
        { method: 'GET', endpoint: `/market/orderbook/level2_${level}` },
        params,
        [{ key: 'symbol', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-full-order-book-aggregated
   * @description Request via this endpoint to get the order book of the specified symbol. Level 2 order book includes all bids and asks (aggregated by price). This level returns only one aggregated size for each price (as if there was only one single order for that price). This API will return data with full depth. It is generally used by professional traders because it uses more server resources and traffic, and we have strict access frequency control. To maintain up-to-date Order Book, please use Websocket incremental feed after retrieving the Level 2 snapshot.
   */
  async getFullOrderBookAggregated(
    params: KucoinSDK.Http.Params<{ symbol: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      sequence: number
      time: number
      bids: number[][]
      asks: number[][]
    }>
  > {
    try {
      return await this.makeRequest(
        { method: 'GET', endpoint: '/market/orderbook/level2' },
        params,
        [{ key: 'symbol', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-full-order-book-atomic
   * @description Request via this endpoint to get the Level 3 order book of the specified trading pari. Level 3 order book includes all bids and asks (the data is non-aggregated, and each item means a single order). This API is generally used by professional traders because it uses more server resources and traffic, and we have strict access frequency control. To maintain up-to-date order book, please use Websocket incremental feed after retrieving the Level 3 snapshot. In the orderbook, the selling data is sorted low to high by price and orders with the same price are sorted in time sequence. The buying data is sorted high to low by price and orders with the same price are sorted in time sequence. The matching engine will match the orders according to the price and time sequence.
   */
  async getFullOrderBookAtomic(
    params: KucoinSDK.Http.Params<{ symbol: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      sequence: number
      time: number
      bids: number[][]
      asks: number[][]
    }>
  > {
    try {
      return await this.makeRequest(
        { method: 'GET', endpoint: '/market/orderbook/level3' },
        params,
        [{ key: 'symbol', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-trade-histories
   * @description Request via this endpoint to get the trade history of the specified symbol.
   */
  async getTradeHistories(
    params: KucoinSDK.Http.Params<{ symbol: string }>
  ): Promise<
    KucoinSDK.Http.Data<
      {
        sequence: number
        price: number
        size: number
        side: string
        time: number
      }[]
    >
  > {
    try {
      return await this.makeRequest({ method: 'GET', endpoint: '/market/histories' }, params, [
        { key: 'symbol', required: true },
      ])
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-klines
   * @description Request via this endpoint to get the kline of the specified symbol. Data are returned in grouped buckets based on requested type.
   */
  async getKlines(
    params: KucoinSDK.Http.Params<{
      symbol: string
      startAt?: string
      endAt?: string
      type:
        | '1min'
        | '3min'
        | '5min'
        | '15min'
        | '30min'
        | '1hour'
        | '2hour'
        | '4hour'
        | '6hour'
        | '8hour'
        | '12hour'
        | '1day'
        | '1week'
    }>
  ): Promise<KucoinSDK.Http.Data<number[][]>> {
    try {
      return await this.makeRequest({ method: 'GET', endpoint: '/market/candles' }, params, [
        { key: 'symbol', required: true },
        { key: 'startAt' },
        { key: 'endAt' },
        { key: 'type', required: true },
      ])
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-user-info-of-all-sub-accounts
   * @description You can get the user info of all sub-users via this interface.
   */
  async getUserSubInfo(): Promise<
    KucoinSDK.Http.Data<
      {
        userId: string
        subName: string
        remarks: string
      }[]
    >
  > {
    try {
      return await this.makeRequest({ type: 'private', method: 'GET', endpoint: '/sub/user' }, {})
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#create-an-account
   * @description Create account.
   */
  async createAnAccount(
    params: KucoinSDK.Http.Params<{ currency: string; type: 'main' | 'trade' | 'margin' }>
  ): Promise<
    KucoinSDK.Http.Data<{
      id: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'POST', endpoint: '/accounts' },
        params,
        [{ key: 'currency', required: true }, { key: 'type', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#list-accounts
   * @description Get a list of accounts. Please deposit funds to the main account firstly, then transfer the funds to the trade account via Inner Transfer before transaction
   */
  async listAccounts(
    params: KucoinSDK.Http.Params<{ currency?: string; type?: 'main' | 'trade' | 'margin' }> = {}
  ): Promise<
    KucoinSDK.Http.Data<
      {
        id: string
        currency: string
        type: string
        balance: number
        available: number
        holds: number
      }[]
    >
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/accounts' },
        params,
        [{ key: 'currency' }, { key: 'type' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-an-account
   * @description Information for a single account. Use this endpoint when you know the accountId.
   */
  async getAnAccount(
    params: KucoinSDK.Http.Params<{ accountId: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currency: string
      balance: number
      available: number
      holds: number
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: `/accounts/${params.accountId}` },
        params,
        [{ key: 'accountId', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-account-ledgers
   * @description Request via this endpoint to get the account ledgers. Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.
   */
  async getAccountLedgers(
    params: KucoinSDK.Http.Params<{
      accountId: string
      startAt?: string
      endAt?: string
      direction?: 'in' | 'out'
      bizType?:
        | 'DEPOSIT'
        | 'WITHDRAW'
        | 'TRANSFER'
        | 'SUB_TRANSFER'
        | 'TRADE_EXCHANGE'
        | 'MARGIN_EXCHANGE'
        | 'KUCOIN_BONUS'
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      pageSize: number
      totalNum: number
      totalPage: number
      items: {
        id: string
        currency: string
        amount: number
        fee: number
        balance: number
        bizType: string
        direction: string
        createdAt: number
        context: {
          orderId: string
          txId: string
        }
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: `/accounts/${params.accountId}/ledgers` },
        params,
        [
          { key: 'accountId', required: true },
          { key: 'startAt' },
          { key: 'endAt' },
          { key: 'direction' },
          { key: 'bizType' },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-holds
   * @description Holds are placed on an account for any active orders or pending withdraw requests. As an order is filled, the hold amount is updated. If an order is canceled, any remaining hold is removed. For a withdraw, once it is completed, the hold is removed.
   */
  async getHolds(
    params: KucoinSDK.Http.Params<{ accountId: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      pageSize: number
      totalNum: number
      totalPage: number
      items: {
        currency: string
        holdAmount: number
        bizType: string
        orderId: string
        createdAt: number
        updatedAt: number
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: `/accounts/${params.accountId}/holds` },
        params,
        [{ key: 'accountId', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-account-balance-of-a-sub-account
   * @description This endpoint returns the account info of a sub-user specified by the subUserId.
   */
  async getSubAccountBalance(
    params: KucoinSDK.Http.Params<{ subUserId: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      subUserId: string
      subName: string
      mainAccounts: {
        currency: string
        balance: number
        available: number
        holds: number
        baseCurrency: string
        baseCurrencyPrice: number
        baseAmount: number
      }[]
      tradeAccounts?: {
        currency: string
        balance: number
        available: number
        holds: number
        baseCurrency: string
        baseCurrencyPrice: number
        baseAmount: number
      }[]
      marginAccounts?: {
        currency: string
        balance: number
        available: number
        holds: number
        baseCurrency: string
        baseCurrencyPrice: number
        baseAmount: number
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: `/sub-accounts/${params.subUserId}` },
        params,
        [{ key: 'subUserId', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-the-aggregated-balance-of-all-sub-accounts
   * @description This endpoint returns the account info of all sub-users.
   */
  async getAggregatedSubAccountBalance(): Promise<
    KucoinSDK.Http.Data<
      {
        subUserId: string
        subName: string
        mainAccounts: {
          currency: string
          balance: number
          available: number
          holds: number
          baseCurrency: string
          baseCurrencyPrice: number
          baseAmount: number
        }[]
        tradeAccounts?: {
          currency: string
          balance: number
          available: number
          holds: number
          baseCurrency: string
          baseCurrencyPrice: number
          baseAmount: number
        }[]
        marginAccounts?: {
          currency: string
          balance: number
          available: number
          holds: number
          baseCurrency: string
          baseCurrencyPrice: number
          baseAmount: number
        }[]
      }[]
    >
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/sub-accounts' },
        {}
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-the-transferable
   * @description This endpoint returns the transferable balance of a specified account.
   */
  async getTheTransferable(
    params: KucoinSDK.Http.Params<{ currency: string; type: 'MAIN' | 'TRADE' | 'MARGIN' | 'POOL' }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currency: string
      balance: number
      available: number
      holds: number
      transferable: number
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/accounts/transferable' },
        params,
        [{ key: 'currency', required: true }, { key: 'type', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#transfer-between-master-user-and-sub-user
   * @description This endpoint is used for transferring the assets between the master user and the sub-user. The main account of the master user supports the transfer to the main account or trade account of the sub-user.
   */
  async transferBetweenMasterAndSubUser(
    params: KucoinSDK.Http.Params<{
      clientOid: string
      currency: string
      amount: string | number
      direction: 'OUT' | 'IN'
      accountType?: 'MAIN'
      subAccountType?: 'MAIN' | 'TRADE' | 'MARGIN'
      subUserId: string
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      orderId: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/accounts/sub-transfer' },
        params,
        [
          { key: 'clientOid', required: true },
          { key: 'currency', required: true },
          { key: 'amount', required: true },
          { key: 'direction', required: true },
          { key: 'accountType' },
          { key: 'subAccountType' },
          { key: 'subUserId', required: true },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#inner-transfer
   * @description The inner transfer interface is used for transferring assets between the accounts of a user and is free of charges. For example, a user could transfer assets from their main account to their trading account on the platform. Support transfer between main account and pool account.
   */
  async innerTransfer(
    params: KucoinSDK.Http.Params<{
      clientOid: string
      currency: string
      from: 'main' | 'trade' | 'margin' | 'pool'
      to: 'main' | 'trade' | 'margin' | 'pool'
      amount: string | number
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      orderId: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/accounts/inner-transfer' },
        params,
        [
          { key: 'clientOid', required: true },
          { key: 'currency', required: true },
          { key: 'amount', required: true },
          { key: 'from', required: true },
          { key: 'to', required: true },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#create-deposit-address
   * @description Request via this endpoint to create a deposit address for a currency you intend to deposit.
   */
  async createDepositAddress(
    params: KucoinSDK.Http.Params<{ currency: string; chain?: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      address: string
      memo: string
      chain: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'POST', endpoint: '/deposit-addresses' },
        params,
        [{ key: 'currency', required: true }, { key: 'chain' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-deposit-address
   * @description Get a deposit address for the currency you intend to deposit. If the returned data is null, you may need to create a deposit address first.
   */
  async getDepositAddress(
    params: KucoinSDK.Http.Params<{ currency: string; chain?: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      address: string
      memo: string
      chain: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/deposit-addresses' },
        params,
        [{ key: 'currency', required: true }, { key: 'chain' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-deposit-list
   * @description Request via this endpoint to get deposit list Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.
   */
  async getDepositList(
    params: KucoinSDK.Http.Params<{
      currency?: string
      startAt?: string
      endAt?: string
      status?: string
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      pageSize: number
      totalNum: number
      totalPage: number
      items: {
        address: string
        memo: string
        amount: number
        fee: number
        currency: string
        isInner: boolean
        walletTxId: string
        status: string
        remark: string
        createdAt: number
        updatedAt: number
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/deposits' },
        params,
        [{ key: 'currency' }, { key: 'startAt' }, { key: 'endAt' }, { key: 'status' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-v1-historical-deposits-list
   * @description Request via this endpoint to get the V1 historical deposits list on KuCoin.
   */
  async getHistoricalDepositsList(
    params: KucoinSDK.Http.Params<{
      currency?: string
      startAt?: string
      endAt?: string
      status?: string
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      pageSize: number
      totalNum: number
      totalPage: number
      items: {
        currency: string
        createAt: number
        amount: number
        walletTxId: string
        isInner: boolean
        status: string
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/hist-deposits' },
        params,
        [{ key: 'currency' }, { key: 'startAt' }, { key: 'endAt' }, { key: 'status' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-withdrawals-list
   * @description Get withdrawals list
   */
  async getWithdrawalsList(
    params: KucoinSDK.Http.Params<{
      currency?: string
      startAt?: string
      endAt?: string
      status?: string
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      pageSize: number
      totalNum: number
      totalPage: number
      items: {
        id: string
        address: string
        memo: string
        currency: string
        amount: number
        fee: number
        walletTxId: string
        isInner: boolean
        status: string
        remark: string
        createdAt: number
        updatedAt: number
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/withdrawals' },
        params,
        [{ key: 'currency' }, { key: 'startAt' }, { key: 'endAt' }, { key: 'status' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-v1-historical-withdrawals-list
   * @description List of KuCoin V1 historical withdrawals.
   */
  async getHistoricalWithdrawalsList(
    params: KucoinSDK.Http.Params<{
      currency?: string
      startAt?: string
      endAt?: string
      status?: 'PROCESSING' | 'SUCCESS' | 'FAILURE'
      currentPage?: number
      pageSize?: number
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      pageSize: number
      totalNum: number
      totalPage: number
      items: {
        currency: string
        createAt: number
        amount: number
        address: string
        walletTxId: string
        isInner: boolean
        status: string
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/hist-withdrawals' },
        params,
        [
          { key: 'currency' },
          { key: 'startAt' },
          { key: 'endAt' },
          { key: 'status' },
          { key: 'currentPage' },
          { key: 'pageSize' },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-withdrawal-quotas
   * @description Get withdrawal quotas
   */
  async getWithdrawalQuotas(
    params: KucoinSDK.Http.Params<{ currency: string; chain?: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currency: string
      limitBTCAmount: number
      usedBTCAmount: number
      limitAmount: number
      remainAmount: number
      availableAmount: number
      withdrawMinFee: number
      innerWithdrawMinFee: number
      withdrawMinSize: number
      isWithdrawEnabled: boolean
      precision: number
      chain: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/withdrawals/quotas' },
        params,
        [{ key: 'currency', required: true }, { key: 'chain' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#apply-withdraw-2
   * @description Apply withdraw
   */
  async applyWithdrawal(
    params: KucoinSDK.Http.Params<{
      currency: string
      address: string
      amount: number
      memo?: string
      isInner?: boolean
      remark?: string
      chain?: string
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      withdrawalId: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'POST', endpoint: '/withdrawals' },
        params,
        [
          { key: 'currency', required: true },
          { key: 'address', required: true },
          { key: 'amount', required: true },
          { key: 'memo' },
          { key: 'isInner' },
          { key: 'remark' },
          { key: 'chain' },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#cancel-withdrawal
   * @description Only withdrawals requests of PROCESSING status could be canceled.
   */
  async cancelWithdrawal(
    params: KucoinSDK.Http.Params<{ withdrawalId: string }>
  ): Promise<KucoinSDK.Http.Data<{}>> {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'DELETE', endpoint: `/withdrawals/${params.withdrawalId}` },
        {}
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#place-a-new-order
   * @description You can place two types of orders: limit and market. Orders can only be placed if your account has sufficient funds. Once an order is placed, your account funds will be put on hold for the duration of the order. How much and which funds are put on hold depends on the order type and parameters specified. See the Holds details below.
   */
  async placeANewOrder(
    params: KucoinSDK.Http.Params<{
      clientOId: string
      side: 'buy' | 'sell'
      symbol: string
      type?: 'limit' | 'market'
      remark?: string
      stop?: 'loss' | 'entry'
      stopPrice?: string
      stp?: 'CN' | 'CO' | 'CB' | 'DC'
      tradeType?: 'TRADE' | 'MARGIN_TRADE'
      price?: string
      size?: string
      timeInForce?: string
      cancelAfter?: string
      postOnly?: boolean
      hidden?: boolean
      iceberg?: boolean
      visibleSize?: string
      funds?: string
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      orderId: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'POST', endpoint: '/orders' },
        params,
        [
          { key: 'clientOid', required: true },
          { key: 'side', required: true },
          { key: 'symbol', required: true },
          { key: 'size', required: !!params.price || (!params.price && !params.funds) },
          { key: 'funds', required: !params.price && !params.size },
          { key: 'type' },
          { key: 'remark' },
          { key: 'stop' },
          { key: 'stopPrice' },
          { key: 'stp' },
          { key: 'tradeType' },
          { key: 'price' },
          { key: 'timeInForce' },
          { key: 'cancelAfter' },
          { key: 'postOnly' },
          { key: 'hidden' },
          { key: 'iceberg' },
          { key: 'visibleSize' },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#cancel-an-order
   * @description Request via this endpoint to cancel a single order previously placed. You will receive cancelledOrderIds field once the system has received the cancellation request. The cancellation request will be processed by the matching engine in sequence. To know if the request is processed (successfully or not), you may check the order status or the update message from the pushes.
   */
  async cancelAnOrder(
    params: KucoinSDK.Http.Params<{ orderId: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      cancelledOrderIds: string[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'DELETE', endpoint: `/orders/${params.orderId}` },
        params,
        [{ key: 'orderId', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#cancel-all-orders
   * @description Request via this endpoint to cancel all open orders. The response is a list of ids of the canceled orders.
   */
  async cancelAllOrders(
    params: KucoinSDK.Http.Params<{
      symbol?: string
      tradeType?: 'TRADE' | 'MARGIN_TRADE' | string
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      cancelledOrderIds: string[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'DELETE', endpoint: '/orders' },
        params,
        [{ key: 'symbol' }, { key: 'tradeType' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#list-orders
   * @description Request via this endpoint to get your current order list. Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.
   */
  async listOrders(
    params: KucoinSDK.Http.Params<{
      status?: 'active' | 'done'
      symbol?: string
      side?: 'buy' | 'sell'
      type?: 'limit' | 'market' | 'limit_stop' | 'market_stop'
      tradeType: 'TRADE' | 'MARGIN_TRADE'
      startAt?: string
      endAt?: string
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      pageSize: number
      totalNum: number
      totalPage: number
      items: {
        id: string
        symbol: string
        opType: string
        type: string
        side: string
        price: number
        size: number
        funds: number
        dealFunds: number
        dealSize: number
        fee: number
        feeCurrency: string
        stp: string
        stop: string
        stopTriggered: boolean
        stopPrice: number
        timeInForce: string
        postOnly: boolean
        hidden: boolean
        iceberg: boolean
        visibleSize: number
        cancelAfter: number
        channel: string
        clientOid: string
        remark: string
        tags: string
        isActive: boolean
        cancelExist: boolean
        createdAt: number
        tradeType: string
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/orders' },
        params,
        [
          { key: 'status' },
          { key: 'symbol' },
          { key: 'side' },
          { key: 'type' },
          { key: 'tradeType', required: true },
          { key: 'startAt' },
          { key: 'endAt' },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-v1-historical-orders-list
   * @description Request via this endpoint to get your historical orders list of the KuCoin V1. Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.
   */
  async getHistoricalOrdersList(
    params: KucoinSDK.Http.Params<{
      currentPage?: number
      pageSize?: number
      symbol?: string
      side?: 'buy' | 'sell'
      startAt?: string
      endAt?: string
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      pageSize: number
      totalNum: number
      totalPage: number
      items: {
        symbol: string
        dealPrice: number
        dealValue: number
        amount: number
        fee: number
        side: string
        createdAt: number
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/hist-orders' },
        params,
        [
          { key: 'currentPage' },
          { key: 'pageSize' },
          { key: 'symbol' },
          { key: 'side' },
          { key: 'startAt' },
          { key: 'endAt' },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#recent-orders
   * @description Request via this endpoint to get 1000 orders in the last 24 hours. Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.
   */
  async recentOrders(): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      pageSize: number
      totalNum: number
      totalPage: number
      items: {
        id: string
        symbol: string
        opType: string
        type: string
        side: string
        price: number
        size: number
        funds: number
        dealFunds: number
        dealSize: number
        fee: number
        feeCurrency: string
        stp: string
        stop: string
        stopTriggered: boolean
        stopPrice: number
        timeInForce: string
        postOnly: boolean
        hidden: boolean
        iceberg: boolean
        visibleSize: number
        cancelAfter: number
        channel: string
        clientOid: string
        remark: string
        tags: string
        isActive: boolean
        cancelExist: boolean
        createdAt: number
        tradeType: string
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/limit/orders' },
        {}
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-an-order
   * @description Request via this endpoint to get a single order info by order ID.
   */
  async getAnOrder(
    params: KucoinSDK.Http.Params<{ orderId: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      id: string
      symbol: string
      opType: string
      type: string
      side: string
      price: number
      size: number
      funds: number
      dealFunds: number
      dealSize: number
      fee: number
      feeCurrency: string
      stp: string
      stop: string
      stopTriggered: boolean
      stopPrice: number
      timeInForce: string
      postOnly: boolean
      hidden: boolean
      iceberg: boolean
      visibleSize: number
      cancelAfter: number
      channel: string
      clientOid: string
      remark: string
      tags: string
      isActive: boolean
      cancelExist: boolean
      createdAt: number
      tradeType: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: `/orders/${params.orderId}` },
        {}
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#list-fills
   * @description Request via this endpoint to get the recent fills. Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.
   */
  async listFills(
    params: KucoinSDK.Http.Params<{
      orderId?: string
      symbol?: string
      side?: 'buy' | 'sell'
      type?: 'limit' | 'market' | 'limit_stop' | 'market_stop'
      startAt?: string
      endAt?: string
      tradeType: 'TRADE' | 'MARGIN_TRADE'
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      pageSize: number
      totalNum: number
      totalPage: number
      items: {
        symbol: string
        tradeId: string
        orderId: string
        counterOrderId: string
        side: string
        liquidity: string
        forceTaker: boolean
        price: number
        size: number
        funds: number
        fee: number
        feeRate: number
        feeCurrency: string
        stop: string
        type: string
        createdAt: number
        tradeType: string
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/fills' },
        params,
        [
          { key: 'orderId' },
          { key: 'symbol' },
          { key: 'side' },
          { key: 'type' },
          { key: 'startAt' },
          { key: 'endAt' },
          { key: 'tradeType', required: true },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#recent-fills
   * @description Request via this endpoint to get a list of 1000 fills in the last 24 hours.
   */
  async recentFills(): Promise<
    KucoinSDK.Http.Data<{
      code: number
      data: {
        counterOrderId: string
        createdAt: number
        fee: number
        feeCurrency: string
        feeRate: number
        forceTaker: boolean
        funds: number
        liquidity: string
        orderId: string
        price: number
        side: string
        size: number
        stop: string
        symbol: string
        tradeId: string
        tradeType: string
        type: string
      }[]
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/limit/fills' },
        {}
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-mark-price
   * @description Request via this endpoint to get the index price of the specified symbol.
   */
  async getMarkPrice(
    params: KucoinSDK.Http.Params<{ symbol: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      symbol: string
      granularity: number
      timePoint: number
      value: number
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: `/mark-price/${params.symbol}/current` },
        {}
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-margin-configuration-info
   * @description Request via this endpoint to get the configure info of the margin.
   */
  async getMarginConfigurationInfo(): Promise<
    KucoinSDK.Http.Data<{
      currencyList: string[]
      warningDebtRatio: number
      liqDebtRatio: number
      maxLeverage: number
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/margin/config' },
        {}
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-margin-account
   * @description Request via this endpoint to get the info of the margin account.
   */
  async getMarginAccount(): Promise<
    KucoinSDK.Http.Data<{
      accounts: {
        availableBalance: number
        currency: string
        holdBalance: number
        liability: number
        maxBorrowSize: number
        totalBalance: number
      }[]
      debtRatio: number
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/margin/account' },
        {}
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#post-borrow-order
   * @description Post borrow order
   */
  async postBorrowOrder(
    params: KucoinSDK.Http.Params<{
      currency: string
      type: string
      size: number
      maxRate?: number
      term?: string
    }>
  ): Promise<
    KucoinSDK.Http.Data<{
      orderId: string
      currency: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'POST', endpoint: '/margin/borrow' },
        params,
        [
          { key: 'currency', required: true },
          { key: 'type', required: true },
          { key: 'size', required: true },
          { key: 'maxRate' },
          { key: 'term' },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-borrow-order
   * @description Request via this endpoint to get the info of the borrow order through the orderId retrieved from Post Borrow Order .
   */
  async getBorrowOrder(
    params: KucoinSDK.Http.Params<{ orderId: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currency: string
      filled: number
      matchList: {
        currency: string
        dailyIntRate: number
        size: number
        term: number
        timestamp: number
        tradeId: number
      }[]
      orderId: string
      size: number
      status: string
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/margin/borrow' },
        params,
        [{ key: 'orderId', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-repay-record
   * @description Get repay record
   */
  async getRepayRecord(
    params: KucoinSDK.Http.Params<{ currency?: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      items: {
        accruedInterest: number
        createdAt: number
        currency: string
        dailyIntRate: number
        liability: number
        maturityTime: number
        principal: number
        repaidSize: number
        term: number
        tradeId: number
      }[]
      pageSize: number
      totalNum: number
      totalPage: number
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/margin/borrow/outstanding' },
        params,
        [{ key: 'currency' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#get-repayment-record
   * @description Get repayment record
   */
  async getRepaymentRecord(
    params: KucoinSDK.Http.Params<{ currency?: string }>
  ): Promise<
    KucoinSDK.Http.Data<{
      currentPage: number
      items: {
        currency: string
        dailyIntRate: number
        interest: number
        principal: number
        repaidSize: number
        repayTime: number
        term: number
        tradeId: number
      }[]
      pageSize: number
      totalNum: number
      totalPage: number
    }>
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/margin/borrow/repaid' },
        params,
        [{ key: 'currency' }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#one-click-repayment
   * @description One-click repayment
   */
  async oneClickRepayment(
    params: KucoinSDK.Http.Params<{
      currency: string
      sequence: 'RECENTLY_EXPIRE_FIRST' | 'HIGHEST_RATE_FIRST'
      size: number
    }>
  ): Promise<KucoinSDK.Http.Data<{}>> {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'POST', endpoint: '/margin/repay/all' },
        params,
        [
          { key: 'currency', required: true },
          { key: 'sequence', required: true },
          { key: 'size', required: true },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#repay-a-single-order
   * @description Request via this endpoint to repay a single order.
   */
  async repayASingleOrder(
    params: KucoinSDK.Http.Params<{ currency: string; tradeId: string; size: number }>
  ): Promise<KucoinSDK.Http.Data<{}>> {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'POST', endpoint: '/margin/repay/single' },
        params,
        [
          { key: 'currency', required: true },
          { key: 'tradeId', required: true },
          { key: 'size', required: true },
        ]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#margin-trade-data
   * @description Request via this endpoint to get the last 300 fills in the lending and borrowing market. The returned value is sorted based on the descending sequence of the order execution time.
   */
  async marginTradeData(
    params: KucoinSDK.Http.Params<{ currency: string }>
  ): Promise<
    KucoinSDK.Http.Data<
      {
        tradeId: string
        currency: string
        size: number
        dailyIntRate: number
        term: number
        timestamp: number
      }[]
    >
  > {
    try {
      return await this.makeRequest(
        { type: 'private', method: 'GET', endpoint: '/margin/trade/last' },
        params,
        [{ key: 'currency', required: true }]
      )
    } catch (e) {
      throw e
    }
  }

  /**
   * @docs https://docs.kucoin.com/#server-time
   * @description Get the server time.
   */
  async serverTime(): Promise<
    KucoinSDK.Http.Data<{
      code: number
      msg: string
      data: number
    }>
  > {
    try {
      return await this.makeRequest({ method: 'GET', endpoint: '/timestamp' }, {})
    } catch (e) {
      throw e
    }
  }
}

export default Kucoin
