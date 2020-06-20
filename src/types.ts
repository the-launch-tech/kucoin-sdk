import { AxiosInstance, AxiosRequestConfig } from 'axios'

export namespace KucoinSDK {
  export type Params = {
    SECRET: string
    KEY: string
    PASSPHRASE: string
    isTest: boolean
  }

  export type Instance = {
    SECRET: string
    KEY: string
    prefix: string
    axios: AxiosInstance
  }

  export namespace Request {
    export type Args = {
      type?: 'private'
      method: 'GET' | 'POST' | 'PUT' | 'DELETE'
      endpoint: string
    }

    export type MapItem = {
      key: string
      required?: boolean
    }

    export type Map = MapItem[]
  }

  export namespace Http {
    export type Params<KV> = KV

    export type Config = {
      [key: string]: any
    }

    export type Data<D> = D

    export type Response<R> = R & {
      parsedBody?: Data<any>
    }

    export type ParamError = boolean | string

    export type Action = (
      endpoint: string,
      params: KucoinSDK.Http.Params<any>,
      config: AxiosRequestConfig
    ) => Promise<any>

    export type Reducer = {
      [key: string]: Action
    }
  }
}
