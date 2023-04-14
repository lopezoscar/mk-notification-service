class UnauthorizedError extends Error {
  constructor (message) {
    super(message)
    this.code = 'UNAUTHORIZED_ERROR'
    this.message = message
  }
}

module.exports = UnauthorizedError
