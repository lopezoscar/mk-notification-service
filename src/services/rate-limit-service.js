const ValidationError = require('../errors/ValidationError')
const TooManyRequestsError = require('../errors/TooManyRequestsError')

class RateLimitService {
  constructor (models) {
    this.models = models

    this.limitByNotificationType = {
      status: {
        limit: 2,
        frequencyInMinutes: 1
      },
      news: {
        limit: 1,
        frequencyInMinutes: 24 * 60
      },
      marketing: {
        limit: 3,
        frequencyInMinutes: 60
      }
    }
  }

  async checkLimit ({ type, recipient }) {
    const { notificationModel } = this.models

    const rateLimitRule = this.limitByNotificationType[type]
    console.log('checking limit for', type, recipient, rateLimitRule)
    if (!rateLimitRule) {
      throw new ValidationError('invalid notification type')
    }

    const startTS = Date.now() - rateLimitRule.frequencyInMinutes * 60 * 1000

    const notifications = await notificationModel.getNotificationsByRecipientAndTypeSorteByCreatedAt({ recipient, type, createdAt: startTS })
    console.log('notifications', notifications)
    if (!notifications || notifications.length === 0) {
      // no notifications - valid limit
      return
    }

    if (notifications.length === rateLimitRule.limit) {
      throw new TooManyRequestsError(`request limit reached ${rateLimitRule.limit} in ${rateLimitRule.frequencyInMinutes} minutes`)
    }
  }
}

module.exports = RateLimitService
