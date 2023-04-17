class InternalServerError extends Error {
  constructor (message) {
    super(message)
    this.code = 'INTERNAL_SERVER_ERROR'
    this.message = message
  }
}
module.exports = InternalServerError
