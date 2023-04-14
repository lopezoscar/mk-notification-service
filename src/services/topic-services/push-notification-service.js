const ValidationError = require('../../errors/ValidationError')

class PushNotificationService {
  send (message) {
    if (!message) {
      throw new ValidationError('message is required')
    }
    console.log('SIMULATING sending push notification to SNS', message)
    return Promise.resolve({ message, topic: 'sns-push-notifications-topic' })
  }
}

module.exports = PushNotificationService
