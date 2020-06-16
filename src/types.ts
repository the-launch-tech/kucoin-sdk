export namespace KucoinSDK {
  export type MapItem = {
    key: string
    required?: boolean
  }

  export type Map = MapItem[]

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
  }

  export type Kucoin = {
    SECRET: string
    KEY: string
    prefix: string
  }
}
