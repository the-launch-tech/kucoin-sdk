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
  const unused: string[] = params
    ? (Object.keys(params) || []).filter((param: string): boolean => {
        return (
          map.findIndex((item: KucoinSDK.Request.MapItem): boolean => {
            return item.key === param
          }) === -1
        )
      })
    : []

  const missing: (string | undefined)[] = (map || [])
    .map((item: KucoinSDK.Request.MapItem) => {
      return (!params && item.required) || (params && !params[item.key] && item.required)
        ? item.key
        : undefined
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
  timestamp: string,
  method: string
): string {
  const strForSign: string = `${timestamp}${method}${path}${queryString}`
  const signatureResult: string = crypto
    .createHmac('sha256', secret)
    .update(strForSign)
    .digest('base64')
  return signatureResult
}

export function getPath(prefix: string, endpoint: string): string {
  return prefix + endpoint
}

export function getTimestamp(): string {
  return Date.now() + ''
}
