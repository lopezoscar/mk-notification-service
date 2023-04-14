const ValidationError = require('../../errors/ValidationError')

class EmailService {
  send ({ sender, recipient, message }) {
    if (!sender) {
      throw new ValidationError('sender is required')
    }
    if (!recipient) {
      throw new ValidationError('recipient is required')
    }
    if (!message) {
      throw new ValidationError('message is required')
    }
    console.log('SIMLATING sending email to SNS Email Service', sender, recipient, message)
    return Promise.resolve({ message, topic: 'sns-email-topic' })
  }
}

module.exports = EmailService
