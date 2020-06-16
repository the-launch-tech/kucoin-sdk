# Kucoin SDK

**_ Current version 2.0.0 is unpublished on NPM. When 2.0.0 is complete with unit tests this Github repository will be re-published as 2.0.0 on NPM _**

Endpoints match the API documentation semantically.

Version 2.0.0 will be Typescript integrated, unit tested, and will contain copied documentation from Kucoin for inline comments in IDE.

## Installation

`npm i --save kucoin-sdk`

### Import Package(s)

- `const Kucoin = require('kucoin-sdk')`
- Or ES6 imports: `import Kucoin from 'kucoin-sdk'`

## Usage

- `const KucoinInstance = new Kucoin({ SECRET, KEY })`
- `KucoinInstance.initialize()`

- `KucoinInstance.getCurrencies().then(console.log).catch(console.error)`
- `KucoinInstance.getTicker({symbol: 'BTC-USDT'}).then(console.log).catch(console.error)`

- Example Methods

```
/**
 * @docs https://docs.kucoin.com/#list-accounts
 * @description Get a list of accounts. Please deposit funds to the main account firstly, then transfer the funds to the trade account via Inner Transfer before transaction
 */
async listAccounts(
  params: KucoinSDK.Http.Params<{ currency?: string; type?: 'MAIN' | 'TRADE' | 'MARGIN' }>
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
  return await this.makeRequest(
    { type: 'private', method: 'GET', endpoint: '/accounts' },
    params,
    [{ key: 'currency' }, { key: 'type' }]
  )
}
```

```
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
  return await this.makeRequest({ method: 'GET', endpoint: '/market/orderbook/level1' }, params, [
    { key: 'symbol', required: true },
  ])
}
```

## History

- Initial Commit
- Added untested routes for Deposits, Withdrawals, Margin Trading, Account Info, Orders, and Fills
- Building 2.0.0, not published to NPM yet.

## Credits

- Company: ©2019 The Launch
- Author: Daniel Griffiths
- Role: Founder and Engineer
- Project: ©2020 CryptoDock

## License

MIT Licence ©2020 Daniel Griffiths
