# Kucoin SDK

This is a growing SDK for the Kucoin cryptocurrency exchange. Currently handles 14 endpoints. More coming very soon.

Endpoints match the API documentation semantically.

## Installation

`npm i --save kucoin-sdk`

### Import Package(s)

- `const Kucoin = require('kucoin-sdk')`
- `import Kucoin from 'kucoin-sdk'`

## Usage

- `const KucoinInstance = new Kucoin({SECRET, KEY})`
- `KucoinInstance.initialize()`

- `KucoinInstance.getCurrencies().then(data => console.log(data))`
- `KucoinInstance.getTicker({symbol: 'BTC-USDT'}).then(data => console.log(data))`

## History

- Initial Commit

## Credits

- Company: ©2019 The Launch
- Author: Daniel Griffiths
- Role: Founder and Engineer
- Project: ©2020 CryptoDock

## License

MIT Licence ©2020 Daniel Griffiths
