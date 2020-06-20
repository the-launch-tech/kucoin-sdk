import * as Utils from '../src/utils'

import { KucoinSDK } from '../src/types'

function test_getQueryString(): void {
  test('Build simple valid query string', (): void => {
    const params: KucoinSDK.Http.Params<{ argument: string }> = { argument: 'response' }
    expect(Utils.getQueryString(params)).toBe(`?argument=response`)
  })
  test('Build complex valid query string', (): void => {
    const params: KucoinSDK.Http.Params<{
      argument: string
      list: (string | number)[]
      lastParam: number
    }> = {
      argument: 'response',
      list: ['string', 516, 'test', 23],
      lastParam: 12,
    }
    expect(Utils.getQueryString(params)).toBe(
      `?argument=response&list=string%2C516%2Ctest%2C23&lastParam=12`
    )
  })
  test('Build null query string', (): void => {
    const params: KucoinSDK.Http.Params<{}> = {}
    expect(Utils.getQueryString(params)).toBe('')
  })
}

function test_checkParameters() {
  test('Check parameters with empty query map', (): void => {
    const params: KucoinSDK.Http.Params<{}> = {}
    const map: KucoinSDK.Request.Map = []
    expect(Utils.checkParameters(params, map)).toBeFalsy()
  })
  test('Check for missing non-required paramters', (): void => {
    const params: KucoinSDK.Http.Params<{}> = {}
    const map: KucoinSDK.Request.Map = [{ key: 'param' }]
    expect(Utils.checkParameters(params, map)).toBeFalsy()
  })
  test('Check for missing required paramters', (): void => {
    const params: KucoinSDK.Http.Params<{}> = {}
    const map: KucoinSDK.Request.Map = [{ key: 'param', required: true }]
    expect(Utils.checkParameters(params, map)).toBeTruthy()
  })
  test('Check for unused paramters', (): void => {
    const params: KucoinSDK.Http.Params<{ param: string }> = { param: 'test' }
    const map: KucoinSDK.Request.Map = []
    expect(Utils.checkParameters(params, map)).toBeFalsy()
  })
  test('Check with valid paramters', (): void => {
    const params: KucoinSDK.Http.Params<{ param: string; object: object }> = {
      param: 'test',
      object: { prop: 2 },
    }
    const map: KucoinSDK.Request.Map = [
      { key: 'param', required: true },
      { key: 'object', required: true },
      { key: 'non' },
    ]
    expect(Utils.checkParameters(params, map)).toBeFalsy()
  })
}

test_getQueryString()
test_checkParameters()
