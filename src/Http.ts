import { KucoinSDK } from './types'

import { merge, getQueryString, uri } from './utils'

export default async function(
  key: string,
  method: 'GET' | 'PUT' | 'POST' | 'DELETE',
  endpoint: string,
  params: KucoinSDK.Http.Params<any>,
  config: KucoinSDK.Http.Config
): Promise<KucoinSDK.Http.Data<any>> {
  const sandbox = 'https://openapi-sandbox.kucoin.com'
  const fullUri: string = uri(endpoint + getQueryString(params))
  const fullConfig: KucoinSDK.Http.Config = {
    ...merge(
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-MBX-APIKEY': key,
        },
      },
      config
    ),
  }

  const response: KucoinSDK.Http.Response<Response> = await fetch(fullUri, fullConfig)

  try {
    response.parsedBody = await response.json()
  } catch (e) {}

  if (!response.ok) {
    throw response.statusText
  }

  return response.parsedBody
}
