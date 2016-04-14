const P = Promise

const pify = p =>
  typeof p == 'object' && typeof p.then == 'function' ? p : P.resolve()

export function delay(time) {
  return pify(this).then(result =>
    new P(fulfill =>
      setTimeout(() => fulfill(result), time)
    )
  )
}

export function deadline(time, message = 'Operation timed out') {
  return P.race([
    delay(time).then(() => { throw new Error(message) }),
    this,
  ])
}

export function rethrow(message) {
  return this.catch(err => {
    throw new Error(`${message}: ${err}`)
  })
}

export function asyncMap(iteratee) {
  return P.resolve(this).then(arr =>
    P.all(arr.map((el, i) =>
      P.resolve(el)
      .then(el => P.resolve(iteratee(el, i)))
    ))
  )
}

export function asyncReduce(iteratee, ...rest) {
  return P.resolve(this).then(arr =>
    arr.reduce((acc, el) =>
      P.resolve(acc).then(acc =>
        P.resolve(el).then(el =>
          P.resolve(iteratee(acc, el))
        )
      )
    , ...rest)
  )
}

export function asyncFlatten() {
  return this::asyncReduce((acc, el) => acc.concat(el), [])
}

export function asyncFlatMap(iteratee) {
  return this::asyncMap(iteratee)::asyncFlatten()
}
