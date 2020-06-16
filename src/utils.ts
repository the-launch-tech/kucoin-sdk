import crypto from 'crypto'

import { KucoinSDK } from './types'

export function merge(
  obj1: KucoinSDK.Http.Config,
  obj2: KucoinSDK.Http.Config
): KucoinSDK.Http.Config {
  for (let p in obj2) {
    try {
      if (obj2[p].constructor == Object) {
        obj1[p] = merge(obj1[p], obj2[p])
      } else {
        obj1[p] = obj2[p]
      }
    } catch (e) {
      obj1[p] = obj2[p]
    }
  }
  return obj1
}

export function getQueryString(params: KucoinSDK.Http.Params<any>): string {
  const keys: string[] = Object.keys(params)
  return !!keys.length
    ? `?${keys.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')}`
    : ''
}

export function uri(endpoint: string): string {
  return `https://openapi-v2.kucoin.com/api${endpoint}`
}

export function checkParameters(
  params: KucoinSDK.Http.Params<any>,
  map: KucoinSDK.Map
): string | boolean {
  const unused: string[] = Object.keys(params).filter((param: string): boolean => {
    return (
      map.findIndex((item: KucoinSDK.MapItem): boolean => {
        return item.key === param
      }) === -1
    )
  })

  const missing: (string | undefined)[] = map
    .map((item: KucoinSDK.MapItem) => {
      return !params[item.key] && item.required ? item.key : undefined
    })
    .filter(Boolean)

  if (!!unused.length) {
    console.warn(`These are questionable parameters that may be unused: ${unused.join(', ')}.`)
  }

  if (!!missing.length) {
    return `You are missing the following required parameters: ${missing.join(', ')}.`
  }

  return false
}

export function getSignature(
  secret: string,
  path: string,
  queryString: string,
  timestamp: number
): string {
  const strForSign: string = `${path}/${timestamp}/${queryString}`
  const signatureStr: string = new Buffer(strForSign).toString('base64')
  const signatureResult: string = crypto
    .createHmac('sha256', this.SECRET)
    .update(signatureStr)
    .digest('hex')
  return signatureResult
}

export function getPath(prefix: string, endpoint: string): string {
  return prefix + endpoint
}

export function getTimestamp(): number {
  return new Date().getTime()
}

export function req(param: { key: string }): KucoinSDK.MapItem {
  return { ...param, required: true }
}

export const bindings: string[] = [
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
]
