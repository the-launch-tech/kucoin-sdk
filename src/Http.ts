import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

import { KucoinSDK } from './types'

import * as Utils from './utils'

export default async function(
  axios: AxiosInstance,
  method: 'GET' | 'PUT' | 'POST' | 'DELETE',
  endpoint: string,
  params: KucoinSDK.Http.Params<any>,
  config: KucoinSDK.Http.Config
): Promise<KucoinSDK.Http.Data<any>> {
  const axiosReducer: KucoinSDK.Http.Reducer = {
    GET: async function(
      endpoint: string,
      params: KucoinSDK.Http.Params<any>,
      config: AxiosRequestConfig
    ): Promise<any> {
      try {
        return await axios.get(endpoint, { ...config, params })
      } catch (e) {
        throw e
      }
    },
    PUT: async function(
      endpoint: string,
      params: KucoinSDK.Http.Params<any>,
      config: AxiosRequestConfig
    ): Promise<any> {
      try {
        return await axios.put(endpoint, params, config)
      } catch (e) {
        throw e
      }
    },
    POST: async function(
      endpoint: string,
      params: KucoinSDK.Http.Params<any>,
      config: AxiosRequestConfig
    ): Promise<any> {
      try {
        return await axios.post(endpoint, params, config)
      } catch (e) {
        throw e
      }
    },
    DELETE: async function(
      endpoint: string,
      params: KucoinSDK.Http.Params<any>,
      config: AxiosRequestConfig
    ): Promise<any> {
      try {
        return await axios.delete(endpoint, { ...config, params })
      } catch (e) {
        throw e
      }
    },
  }

  const axiosAction: KucoinSDK.Http.Action = axiosReducer[method]

  if (!axiosAction) {
    throw `Invalid method: ${method}.`
  }

  const res: AxiosResponse<any> = await axiosAction(endpoint, params, config)

  if (!res) {
    throw 'Invalid Response'
  }

  return res.data
}
