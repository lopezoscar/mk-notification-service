class TooManyRequestsError extends Error {
  constructor (message) {
    super(message)
    this.code = 'TOO_MANY_REQUESTS_ERROR'
    this.message = message
  }

  getCode () {
    return this.code
  }
}

module.exports = TooManyRequestsError
