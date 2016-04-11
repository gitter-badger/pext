# pext <small>Promise Extensions</small>

```js

import {deadline, asyncMap} from 'pext'

// query user ids (redis style)
const users = await db.keys('users:*')
// for every user id - query user data
::asyncMap(key => db.get(key))
// parse JSON
::asyncMap(JSON.parse)
// throw if it takes longer than 3 seconds
::deadline(3000)

console.log(users)
// [
//   {name: '…', email: '…'},
//   {name: '…', email: '…'},
//   …
// ]

```
