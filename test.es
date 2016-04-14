//import 'babel-polyfill'
import vows from 'vows'
import assert from 'assert'
import {delay, asyncReduce, asyncFlatMap} from '.'

const p = v => Promise.resolve(v)
const time = f => () => p(Date.now()).then(t => p(f()).then(v => ({t, v})))
const pify = f => (...args) => delay(100).then(() => f(...args))
const took = time => ({t}) => assert.epsilon(10, t, Date.now - time)
const eq = val => ({v}) => assert.equal(v, val)
const len = val => ({v}) => assert.lengthOf(v, val)

export default vows.describe('pext')

.addBatch({

  "delay(1000)": {
    topic: time(() => delay(1000)),
    "took 1 sec": took(1000),
  },
  "[1, 2, 3]::asyncReduce(asyncSum, 0)": {
    topic: time(() => [1, 2, 3]::asyncReduce(pify((a, b) => a + b), 0)),
    "== 6": eq(6),
    "took 300ms": took(300),
  },
  "[2, 3, 4]::asyncReduce(asyncSum)": {
    topic: time(() => [2, 3, 4]::asyncReduce(pify((a, b) => a + b))),
    "== 9": eq(9),
    "took 200ms": took(200),
  },
  "[p(1), p(2), p(3)]::asyncReduce(sum, 0)": {
    topic: time(() => [p(1), p(2), p(3)]::asyncReduce((a, b) => a + b, 0)),
    "== 6": eq(6),
    "was instantenous": took(0),
  },
  "[1, 2, 3]::asyncFlatMap(asyncDuplicate)": {
    topic: time(() => [1, 2, 3]::asyncFlatMap(pify(x => [x, x]))),
    "length is 6": len(6),
    "took 100ms": took(100),
  },

})
