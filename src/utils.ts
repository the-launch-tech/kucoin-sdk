import crypto from 'crypto'

import { KucoinSDK } from './types'

export function getQueryString(params: KucoinSDK.Http.Params<any>): string {
  const keys: string[] = Object.keys(params)
  return !!keys.length
    ? `?${keys.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')}`
    : ''
}

export function checkParameters(
  params: KucoinSDK.Http.Params<any>,
  map: KucoinSDK.Request.Map
): string | boolean {
  const unused: string[] = Object.keys(params).filter((param: string): boolean => {
    return (
      map.findIndex((item: KucoinSDK.Request.MapItem): boolean => {
        return item.key === param
      }) === -1
    )
  })

  const missing: (string | undefined)[] = map
    .map((item: KucoinSDK.Request.MapItem) => {
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

export function req(param: { key: string }): KucoinSDK.Request.MapItem {
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
