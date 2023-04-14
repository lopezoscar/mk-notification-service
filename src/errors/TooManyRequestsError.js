class TooManyRequestsError extends Error {
  constructor (message) {
    super(message)
    this.code = 'TOO_MANY_REQUESTS_ERROR'
    this.message = message
  }
}

module.exports = TooManyRequestsError
