# pext <small>Promise Extensions</small>

[![Build Status](https://api.travis-ci.org/phaux/pext.svg)](https://travis-ci.org/phaux/pext)

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
// if it failed, rethrow with a more descriptive message
::rethrow("Couldn't load user data")

console.log(users)
// [
//   {name: '…', email: '…'},
//   {name: '…', email: '…'},
//   …
// ]

```

## API

### `delay(time)`

Returns a promise that resolves in `time` milliseconds
counted from the moment of calling the function or - if called on a promise -
from the moment the original promise resolves.

```js
console.log("Hello")
await delay(1000)
console.log("world.")

const json = await getJSON('…')::delay(1000).then(JSON.parse)
```

### `Promise::deadline(time, message?)`

Returns a promise that either resolves normally or rejects
if it takes longer than `time` milliseconds after calling the function.
`message` is the error message ("Operation timed out" by default).
Consider chaining `::rethrow()` after it instead of specifying message.

```js
const json = await fetch('…').then(res => res.json())::deadline(1000)
```

### `Promise::rethrow(message)`

Catches a rejected promise and rethrows it with more descriptive error.

```js
const cfg = await promisify(fs.readFile)('config.json', 'utf8')
.then(JSON.parse)
::deadline(1000)
::rethrow("Can't load config")
// Can't load config: No such file or directory
// Can't load config: Invalid JSON
// Can't load config: Operation timed out
```

### `Array::asyncMap(elem => newValue)`

Returns a promise for an array of new values. `newValue` can be a promise.
It can be called on a regular array as well as on a promise for an array,
an array of promises or a promise for an array of promises.

See also [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) on MDN.

```js
const jsons = await ['a.json', 'b.json']
::asyncMap(f => promisify(fs.readFile)(f, 'utf8'))
::asyncMap(JSON.parse)
```

### `Array::asyncReduce((lastVal, elem) => newVal, initVal?)`

Returns a promise for the final accumulator value (final `newVal`).
`newVal` and `initVal` can be promises.
It can be called on a regular array as well as on a promise for an array,
an array of promises or a promise for an array of promises.

See also [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) on MDN.

```js
const poem = ['verse1.txt', 'verse2.txt']
// it would be more wise to first map them to their contents
::asyncReduce(async (poem, file) => {
  const verse = await promisify(fs.readFile)(file, 'utf8')
  return poem + verse
}, '')
```
