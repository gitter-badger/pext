import 'regenerator/runtime'

export function delay(time) {

  if (typeof this == 'object' && typeof this.then == 'function') {
    return this.then(result =>
      new Promise(fulfill =>
        setTimeout(() => fulfill(result), time)
      )
    )
  }
  else {
    return new Promise(fulfill =>
      setTimeout(fulfill, time)
    )
  }

}

export function deadline(time, message = 'Operation timed out') {
  return Promise.race([
    this,
    delay(time).then(() => {
      throw new Error(message)
    }),
  ])
}

export function awaitAll() {
  return Promise.all(this.map(el => Promise.resolve(el)))
}

export function asyncMap(f) {
  return Promise.resolve(this).then(arr =>
    Promise.all(arr.map(el =>
      Promise.resolve(el)
      .then(el => Promise.resolve(f(el)))
    ))
  )
}

export function rethrow(message) {
  return this.catch(err => {
    throw new Error(`${message}: ${err}`)
  })
}
