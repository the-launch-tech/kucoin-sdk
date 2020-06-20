# Kucoin SDK

Version 1.x.x Endpoints match the API documentation semantically.

Version 2.x.x is Typescript integrated, partially unit tested, and contains copied docstrings and documentation references for IDE hinting.

Version 3.x.x will contain a WebSocket implementation.

## 1.x.x - 2.x.x User Changes

1. `PASSPHRASE?: string` can be added as a parameter to the class instantiation. It is you API creation passphrase, and is required for signing authenticated requests for private endpoints.
2. `isTest?: boolean` can be addedas a parameter to the class instantiation to indicate sandbox usage.

## 2.x.x Installation

`npm i --save kucoin-sdk`

## Import Package(s)

- `const Kucoin = require('kucoin-sdk')`
- Or ES6 imports: `import Kucoin from 'kucoin-sdk'`

## Usage

- Instantiate: `const KucoinInstance = new Kucoin({ SECRET, KEY, PASSPHRASE, isTest: false })`

## Auxillary Helper Methods

#### `addRequestInterceptor`

- Docs

  - Callback to access Axios interceptor.
  - `const interceptor = KucoinInstance.addRequestInterceptor(onBeforeCallback, onErrorCallback)`

- Types

```
(
  onBeforeCallback (value: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>,
  onErrorCallback: (error: AxiosError) => AxiosError | Promise<AxiosError>
) => any
```

---

#### `removeRequestInterceptor`

- Docs

  - Callback to access Axios interceptor.
  - `KucoinInstance.removeRequestInterceptor(interceptor)`

- Types

```
(interceptor: any) => void
```

---

#### `addResponseInterceptor`

- Docs

  - Callback to access Axios interceptor.
  - `const interceptor = KucoinInstance.addResponseInterceptor(onSuccessCallback, onErrorCallback)`

- Types

```
(
  onSuccessCallback: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
  onErrorCallback: (error: AxiosError) => AxiosError | Promise<AxiosError>
) => any
```

---

#### `removeResponseInterceptor`

- Docs

  - Callback to access Axios interceptor.
  - `KucoinInstance.removeResponseInterceptor(interceptor)`

- Types

```
(interceptor: any) => void
```

---

### (Public) API Endpoint Methods

#### `async getSymbolsList`

- Docs

  - https://docs.kucoin.com/#get-symbols-list
  - Request via this endpoint to get a list of available currency pairs for trading. If you want to get the market information of the trading symbol, please use Get All Tickers.
  - `KucoinInstance.getSymbolsList().then(console.log).catch(console.error)`

- Types

```
(params: KucoinSDK.Http.Params<{ market?: string }>) => Promise<
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
>
```

---

#### `async getTicker`

- Docs

  - https://docs.kucoin.com/#get-ticker
  - Request via this endpoint to get Level 1 Market Data. The returned value includes the best bid price and size, the best ask price and size as well as the last traded price and the last traded size.
  - `KucoinInstance.getTicker({ symbol: 'BTC-USDT' }).then(console.log).catch(console.error)`

- Types

```
(params: KucoinSDK.Http.Params<{ symbol: string }>) => Promise<
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
>
```

---

#### `async getAllTickers`

- Docs

  - https://docs.kucoin.com/#get-all-tickers
  - Request market tickers for all the trading pairs in the market (including 24h volume). On the rare occasion that we will change the currency name, if you still want the changed symbol name, you can use the symbolName field instead of the symbol field via “Get all tickers” endpoint.
  - `KucoinInstance.getAllTickers().then(console.log).catch(console.error)`

- Types

```
() => Promise<
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
>
```

---

#### `async get24HourStats`

- Docs

  - https://docs.kucoin.com/#get-24hr-stats
  - Request via this endpoint to get the statistics of the specified ticker in the last 24 hours.
  - `KucoinInstance.get24HourStats({ symbol: 'BTC-USDT' }).then(console.log).catch(console.error)`

- Types

```
(params: KucoinSDK.Http.Params<{ symbol: string }>) => Promise<
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
>
```

---

#### `async getMarketList`

- Docs

  - https://docs.kucoin.com/#get-market-list
  - Request via this endpoint to get the transaction currency for the entire trading market.
  - `KucoinInstance.getMarketList().then(console.log).catch(console.error)`

- Types

```
() => Promise<
  KucoinSDK.Http.Data<{
    data: string[]
  }>
>
```

---

#### `async getCurrencies`

- Docs

  - https://docs.kucoin.com/#get-currencies
  - Request via this endpoint to get the currency list.
  - `KucoinInstance.getCurrencies().then(console.log).catch(console.error)`

- Types

```
() => Promise<
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
>
```

---

#### `async getCurrencyDetail`

- Docs

  - https://docs.kucoin.com/#get-currency-detail
  - Request via this endpoint to get the currency details of a specified currency.
  - `KucoinInstance.getCurrencyDetail('BTC').then(console.log).catch(console.error)`

- Types

```
(currency: string, params: KucoinSDK.Http.Params<{ chain?: string[] }>) => Promise<
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
>
```

---

#### `async getFiatPrice`

- Docs

  - https://docs.kucoin.com/#get-fiat-price
  - Request via this endpoint to get the fiat price of the currencies for the available trading pairs.
  - `KucoinInstance.getFiatPrice({ base: 'USD', currencies: ['BTC', 'ETH'] }).then(console.log).catch(console.error)`

- Types

```
(params: KucoinSDK.Http.Params<{ base?: string; currencies?: string[] }>) => Promise<
  KucoinSDK.Http.Data<{
    code: number
    data: {
      [currency: string]: number
    }
  }>
>
```

---

#### `async getPartOrderBook`

- Docs

  - https://docs.kucoin.com/#get-part-order-book-aggregated
  - Request via this endpoint to get a list of open orders for a symbol. Level-2 order book includes all bids and asks (aggregated by price), this level returns only one size for each active price (as if there was only a single order for that price). Query via this endpoint and the system will return only part of the order book to you. If you request level2_20, the system will return you 20 pieces of data (ask and bid data) on the order book. If you request level_100, the system will return 100 pieces of data (ask and bid data) on the order book to you. You are recommended to request via this endpoint as the system reponse would be faster and cosume less traffic. To maintain up-to-date Order Book, please use Websocket incremental feed after retrieving the Level 2 snapshot.
  - `KucoinInstance.getPartOrderBook(level: 20, { symbol: 'USDT-BTC' }).then(console.log).catch(console.error)`

- Types

```
(level: 20 | 100, params: KucoinSDK.Http.Params<{ symbol: string }>) => Promise<
  KucoinSDK.Http.Data<{
    sequence: number
    time: number
    bids: number[][]
    asks: number[][]
  }>
>
```

---

#### `async getFullOrderBookAggregated`

- Docs

  - https://docs.kucoin.com/#get-full-order-book-aggregated
  - Request via this endpoint to get the order book of the specified symbol. Level 2 order book includes all bids and asks (aggregated by price). This level returns only one aggregated size for each price (as if there was only one single order for that price). This API will return data with full depth. It is generally used by professional traders because it uses more server resources and traffic, and we have strict access frequency control. To maintain up-to-date Order Book, please use Websocket incremental feed after retrieving the Level 2 snapshot.
  - `KucoinInstance.getFullOrderBookAggregated({ symbol: 'USDT-BTC' }).then(console.log).catch(console.error)`

- Types

```
(params: KucoinSDK.Http.Params<{ symbol: string }>) => Promise<
  KucoinSDK.Http.Data<{
    sequence: number
    time: number
    bids: number[][]
    asks: number[][]
  }>
>
```

---

#### `async getFullOrderBookAtomic`

- Docs

  - https://docs.kucoin.com/#get-full-order-book-atomic
  - Request via this endpoint to get the Level 3 order book of the specified trading pari. Level 3 order book includes all bids and asks (the data is non-aggregated, and each item means a single order). This API is generally used by professional traders because it uses more server resources and traffic, and we have strict access frequency control. To maintain up-to-date order book, please use Websocket incremental feed after retrieving the Level 3 snapshot. In the orderbook, the selling data is sorted low to high by price and orders with the same price are sorted in time sequence. The buying data is sorted high to low by price and orders with the same price are sorted in time sequence. The matching engine will match the orders according to the price and time sequence.
  - `KucoinInstance.getFullOrderBookAtomic({ symbol: 'USDT-BTC' }).then(console.log).catch(console.error)`

- Types

```
(params: KucoinSDK.Http.Params<{ symbol: string }>) => Promise<
  KucoinSDK.Http.Data<{
    sequence: number
    time: number
    bids: number[][]
    asks: number[][]
  }>
>
```

---

#### `async getTradeHistories`

- Docs

  - https://docs.kucoin.com/#get-trade-histories
  - Request via this endpoint to get the trade history of the specified symbol.
  - `KucoinInstance.getTradeHistories({ symbol: 'USDT-BTC' }).then(console.log).catch(console.error)`

- Types

```
(params: KucoinSDK.Http.Params<{ symbol: string }>) => Promise<
  KucoinSDK.Http.Data<
    {
      sequence: number
      price: number
      size: number
      side: string
      time: number
    }[]
  >
>
```

---

#### `async getKlines`

- Docs

  - https://docs.kucoin.com/#get-klines
  - Request via this endpoint to get the kline of the specified symbol. Data are returned in grouped buckets based on requested type.
  - `KucoinInstance.getKlines({ symbol: 'USDT-BTC', type: '1min' }).then...`

- Types

```
(
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
): Promise<KucoinSDK.Http.Data<number[][]>>
```

---

## (Private) API Endpoint Methods

#### `async getUserSubInfo`

- Docs

  - https://docs.kucoin.com/#get-user-info-of-all-sub-accounts
  - You can get the user info of all sub-users via this interface.
  - `KucoinInstance.getUserSubInfo().then...`

- Types

```
() => Promise<
  KucoinSDK.Http.Data<
    {
      userId: string
      subName: string
      remarks: string
    }[]
  >
>
```

---

#### `async createAnAccount`

- Docs

  - https://docs.kucoin.com/#create-an-account
  - Create account.
  - `KucoinInstance.createAnAccount({ currency: 'BTC', type: 'main' }).then...`

- Types

```
(params: KucoinSDK.Http.Params<{ currency: string; type: 'main' | 'trade' | 'margin' }>) => Promise<
  KucoinSDK.Http.Data<{
    id: string
  }>
>
```

---

#### `async listAccounts`

- Docs

  - https://docs.kucoin.com/#list-accounts
  - Get a list of accounts. Please deposit funds to the main account firstly, then transfer the funds to the trade account via Inner Transfer before transaction.
  - `KucoinInstance.listAccounts().then...`

- Types

```
(params: KucoinSDK.Http.Params<{ currency?: string; type?: 'main' | 'trade' | 'margin' | 'pool' }>) => Promise<
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
>
```

---

#### `async getAnAccount`

- Docs

  - https://docs.kucoin.com/#get-an-account
  - Information for a single account. Use this endpoint when you know the accountId.
  - `KucoinInstance.getAnAccount({ accountId: 'xxxxxx' }).then...`

- Types

```
(params: KucoinSDK.Http.Params<{ accountId: string }>) => Promise<
  KucoinSDK.Http.Data<{
    currency: string
    balance: number
    available: number
    holds: number
  }>
>
```

---

#### `async getAccountLedgers`

- Docs

  - https://docs.kucoin.com/#get-account-ledgers
  - Request via this endpoint to get the account ledgers. Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.
  - `KucoinInstance.getAccountLedgers({ accountId: 'xxxxxx' }).then...`

- Types

```
(params: KucoinSDK.Http.Params<{
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
  }>) => Promise<
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
>
```

---

#### `async getHolds`

- Docs

  - https://docs.kucoin.com/#get-holds
  - Holds are placed on an account for any active orders or pending withdraw requests. As an order is filled, the hold amount is updated. If an order is canceled, any remaining hold is removed. For a withdraw, once it is completed, the hold is removed.

- Types

```
(params: KucoinSDK.Http.Params<{ accountId: string }>) => Promise<
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
>
```

---

#### `async getSubAccountBalance`

- Docs

  - https://docs.kucoin.com/#get-account-balance-of-a-sub-account
  - This endpoint returns the account info of a sub-user specified by the subUserId.

- Types

```
(params: KucoinSDK.Http.Params<{ subUserId: string }>) => Promise<
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
>
```

---

#### `async getAggregatedSubAccountBalance`

- Docs

  - https://docs.kucoin.com/#get-the-aggregated-balance-of-all-sub-accounts
  - This endpoint returns the account info of all sub-users.

- Types

```
() => Promise<
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
>
```

---

#### `async getTheTransferable`

- Docs

  - https://docs.kucoin.com/#get-the-transferable
  - This endpoint returns the transferable balance of a specified account.

- Types

```
(params: KucoinSDK.Http.Params<{ currency: string; type: 'MAIN' | 'TRADE' | 'MARGIN' | 'POOL' }>) => Promise<
  KucoinSDK.Http.Data<{
    currency: string
    balance: number
    available: number
    holds: number
    transferable: number
  }>
>
```

---

#### `async transferBetweenMasterAndSubUser`

- Docs

  - https://docs.kucoin.com/#transfer-between-master-user-and-sub-user
  - This endpoint is used for transferring the assets between the master user and the sub-user. The main account of the master user supports the transfer to the main account or trade account of the sub-user.

- Types

```
(
  params: KucoinSDK.Http.Params<{
    clientOid: string
    currency: string
    amount: string | number
    direction: 'OUT' | 'IN'
    accountType?: 'MAIN'
    subAccountType?: 'MAIN' | 'TRADE' | 'MARGIN'
    subUserId: string
  }>
) => Promise<
  KucoinSDK.Http.Data<{
    orderId: string
  }>
>
```

---

#### `async innerTransfer`

- Docs

  - https://docs.kucoin.com/#inner-transfer
  - The inner transfer interface is used for transferring assets between the accounts of a user and is free of charges. For example, a user could transfer assets from their main account to their trading account on the platform. Support transfer between main account and pool account.

- Types

```
(
  params: KucoinSDK.Http.Params<{
    clientOid: string
    currency: string
    from: 'main' | 'trade' | 'margin' | 'pool'
    to: 'main' | 'trade' | 'margin' | 'pool'
    amount: string | number
  }>
) => Promise<
  KucoinSDK.Http.Data<{
    orderId: string
  }>
>
```

---

#### `async createDepositAddress`

- Docs

  - https://docs.kucoin.com/#create-deposit-address
  - Request via this endpoint to create a deposit address for a currency you intend to deposit.

- Types

```
(params: KucoinSDK.Http.Params<{ currency: string; chain?: string }>) => Promise<
  KucoinSDK.Http.Data<{
    address: string
    memo: string
    chain: string
  }>
>
```

---

#### `async getDepositAddress`

- Docs

  - https://docs.kucoin.com/#get-deposit-address
  - Get a deposit address for the currency you intend to deposit. If the returned data is null, you may need to create a deposit address first.

- Types

```
(params: KucoinSDK.Http.Params<{ currency: string; chain?: string }>) => Promise<
  KucoinSDK.Http.Data<{
    address: string
    memo: string
    chain: string
  }>
>
```

---

#### `async getDepositList`

- Docs

  - https://docs.kucoin.com/#get-deposit-list
  - Request via this endpoint to get deposit list Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.

- Types

```
(
  params: KucoinSDK.Http.Params<{
    currency?: string
    startAt?: string
    endAt?: string
    status?: string
  }>
) => Promise<
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
>
```

---

#### `async getHistoricalDepositsList`

- Docs

  - https://docs.kucoin.com/#get-v1-historical-deposits-list
  - Request via this endpoint to get the V1 historical deposits list on KuCoin.

- Types

```
(
  params: KucoinSDK.Http.Params<{
    currency?: string
    startAt?: string
    endAt?: string
    status?: string
  }>
) => Promise<
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
>
```

---

#### `async getWithdrawalsList`

- Docs

  - https://docs.kucoin.com/#get-withdrawals-list
  - Get withdrawals list

- Types

```
(
  params: KucoinSDK.Http.Params<{
    currency?: string
    startAt?: string
    endAt?: string
    status?: string
  }>
) => Promise<
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
>
```

---

#### `async getHistoricalWithdrawalsList`

- Docs

  - https://docs.kucoin.com/#get-v1-historical-withdrawals-list
  - List of KuCoin V1 historical withdrawals.

- Types

```
(
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
>
```

---

#### `async getWithdrawalQuotas`

- Docs

  - https://docs.kucoin.com/#get-withdrawal-quotas
  - Get withdrawal quotas

- Types

```
(params: KucoinSDK.Http.Params<{ currency: string; chain?: string }>) => Promise<
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
>
```

---

#### `async applyWithdrawal`

- Docs

  - https://docs.kucoin.com/#apply-withdraw-2
  - Apply withdraw

- Types

```
(
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
>
```

---

#### `async cancelWithdrawal`

- Docs

  - https://docs.kucoin.com/#cancel-withdrawal
  - Only withdrawals requests of PROCESSING status could be canceled.

- Types

```
(params: KucoinSDK.Http.Params<{ withdrawalId: string }>) => Promise<KucoinSDK.Http.Data<{}>>
```

---

#### `async placeANewOrder`

- Docs

  - https://docs.kucoin.com/#place-a-new-order
  - You can place two types of orders: limit and market. Orders can only be placed if your account has sufficient funds. Once an order is placed, your account funds will be put on hold for the duration of the order. How much and which funds are put on hold depends on the order type and parameters specified. See the Holds details below.

- Types

```
(
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
) => Promise<
  KucoinSDK.Http.Data<{
    orderId: string
  }>
>
```

---

#### `async cancelAnOrder`

- Docs

  - https://docs.kucoin.com/#cancel-an-order
  - Request via this endpoint to cancel a single order previously placed. You will receive cancelledOrderIds field once the system has received the cancellation request. The cancellation request will be processed by the matching engine in sequence. To know if the request is processed (successfully or not), you may check the order status or the update message from the pushes.

- Types

```
(params: KucoinSDK.Http.Params<{ orderId: string }>): Promise<
  KucoinSDK.Http.Data<{
    cancelledOrderIds: string[]
  }>
>
```

---

#### `async cancelAllOrders`

- Docs

  - https://docs.kucoin.com/#cancel-all-orders
  - Request via this endpoint to cancel all open orders. The response is a list of ids of the canceled orders.

- Types

```
(params: KucoinSDK.Http.Params<{ symbol?: string; tradeType?: 'TRADE' | 'MARGIN_TRADE' | string }>) => Promise<
  KucoinSDK.Http.Data<{
    cancelledOrderIds: string[]
  }>
>
```

---

#### `async listOrders`

- Docs

  - https://docs.kucoin.com/#list-orders
  - Request via this endpoint to get your current order list. Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.

- Types

```
(
  params: KucoinSDK.Http.Params<{
    status?: 'active' | 'done'
    symbol?: string
    side?: 'buy' | 'sell'
    type?: 'limit' | 'market' | 'limit_stop' | 'market_stop'
    tradeType: 'TRADE' | 'MARGIN_TRADE'
    startAt?: string
    endAt?: string
  }>
) => Promise<
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
>
```

---

#### `async getHistoricalOrdersList`

- Docs

  - https://docs.kucoin.com/#get-v1-historical-orders-list
  - Request via this endpoint to get your historical orders list of the KuCoin V1. Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.

- Types

```
(
  params: KucoinSDK.Http.Params<{
    currentPage?: number
    pageSize?: number
    symbol?: string
    side?: 'buy' | 'sell'
    startAt?: string
    endAt?: string
  }>
) => Promise<
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
>
```

---

#### `async recentOrders`

- Docs

  - https://docs.kucoin.com/#recent-orders
  - Request via this endpoint to get 1000 orders in the last 24 hours. Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.

- Types

```
() => Promise<
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
>
```

---

#### `async getAnOrder`

- Docs

  - https://docs.kucoin.com/#get-an-order
  - Request via this endpoint to get a single order info by order ID.

- Types

```
(
  params: KucoinSDK.Http.Params<{ orderId: string }>
) => Promise<
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
>
```

---

#### `async listFills`

- Docs

  - https://docs.kucoin.com/#list-fills
  - Request via this endpoint to get the recent fills. Items are paginated and sorted to show the latest first. See the Pagination section for retrieving additional entries after the first page.

- Types

```
(
  params: KucoinSDK.Http.Params<{
    orderId?: string
    symbol?: string
    side?: 'buy' | 'sell'
    type?: 'limit' | 'market' | 'limit_stop' | 'market_stop'
    startAt?: string
    endAt?: string
    tradeType: 'TRADE' | 'MARGIN_TRADE'
  }>
) => Promise<
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
>
```

---

#### `async recentFills`

- Docs

  - https://docs.kucoin.com/#recent-fills
  - Request via this endpoint to get a list of 1000 fills in the last 24 hours.

- Types

```
() => Promise<
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
>
```

---

#### `async getMarkPrice`

- Docs

  - https://docs.kucoin.com/#get-mark-price
  - Request via this endpoint to get the index price of the specified symbol.

- Types

```
(params: KucoinSDK.Http.Params<{ symbol: string }>) => Promise<
  KucoinSDK.Http.Data<{
    symbol: string
    granularity: number
    timePoint: number
    value: number
  }>
>
```

---

#### `async getMarginConfigurationInfo`

- Docs

  - https://docs.kucoin.com/#get-margin-configuration-info
  - Request via this endpoint to get the configure info of the margin.

- Types

```
() => Promise<
  KucoinSDK.Http.Data<{
    currencyList: string[]
    warningDebtRatio: number
    liqDebtRatio: number
    maxLeverage: number
  }>
>
```

---

#### `async getMarginAccount`

- Docs

  - https://docs.kucoin.com/#get-margin-account
  - Request via this endpoint to get the info of the margin account.

- Types

```
() => Promise<
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
>
```

---

#### `async postBorrowOrder`

- Docs

  - https://docs.kucoin.com/#post-borrow-order
  - Post borrow order

- Types

```
(
  params: KucoinSDK.Http.Params<{
    currency: string
    type: string
    size: number
    maxRate: number
    term: string
  }>
) => Promise<
  KucoinSDK.Http.Data<{
    orderId: string
    currency: string
  }>
>
```

---

#### `async getBorrowOrder`

- Docs

  - https://docs.kucoin.com/#get-borrow-order
  - Request via this endpoint to get the info of the borrow order through the orderId retrieved from Post Borrow Order.

- Types

```
(params: KucoinSDK.Http.Params<{ orderId: string }>) => Promise<
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
>
```

---

#### `async getRepayRecord`

- Docs

  - https://docs.kucoin.com/#get-repay-record
  - Get repay record

- Types

```
(params: KucoinSDK.Http.Params<{ currency?: string }>) => Promise<
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
>
```

---

#### `async getRepaymentRecord`

- Docs

  - https://docs.kucoin.com/#get-repayment-record
  - Get repayment record

- Types

```
(params: KucoinSDK.Http.Params<{ currency?: string }>) => Promise<
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
>
```

---

#### `async oneClickRepayment`

- Docs

  - https://docs.kucoin.com/#one-click-repayment
  - One-click repayment

- Types

```
(
  params: KucoinSDK.Http.Params<{
    currency: string
    sequence: 'RECENTLY_EXPIRE_FIRST' | 'HIGHEST_RATE_FIRST'
    size: number
  }>
) => Promise<KucoinSDK.Http.Data<{}>>
```

---

#### `async repayASingleOrder`

- Docs

  - https://docs.kucoin.com/#repay-a-single-order
  - Request via this endpoint to repay a single order.

- Types

```
(
  params: KucoinSDK.Http.Params<{ currency: string; tradeId: string; size: number }>
) => Promise<KucoinSDK.Http.Data<{}>>
```

---

#### `async marginTradeData`

- Docs

  - https://docs.kucoin.com/#margin-trade-data
  - Request via this endpoint to get the last 300 fills in the lending and borrowing market. The returned value is sorted based on the descending sequence of the order execution time.

- Types

```
(params: KucoinSDK.Http.Params<{ currency: string }>) => Promise<
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
>
```

---

#### `async serverTime`

- Docs

  - https://docs.kucoin.com/#server-time
  - Get the server time.

- Types

```
() => Promise<
  KucoinSDK.Http.Data<{
    code: number
    msg: string
    data: number
  }>
>
```

---

## History

- `1.0.0` Initial Commit
- `1.1.0` Added untested routes for Deposits, Withdrawals, Margin Trading, Account Info, Orders, and Fills
- `2.0.0` Integrate Typescript
- `2.0.0` Integrate Docstrings for IDE comment hinting

## Credits

- Company: ©2019 The Launch
- Author: Daniel Griffiths
- Role: Founder and Engineer
- Project: ©2020 CryptoDock

## License

MIT Licence ©2020 Daniel Griffiths
