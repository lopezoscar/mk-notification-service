const { v4: uuid } = require('uuid')
const ValidationError = require('../errors/ValidationError')

class NotificationService {
  constructor ({ models, emailService, pushNotificationService, rateLimitService }) {
    this.models = models

    this.notificationServiceByTopicType = {
      email: emailService,
      push: pushNotificationService
    }
    this.rateLimitService = rateLimitService
  }

  async sendNotification (newNotification) {
    const { notificationModel } = this.models
    const notification = newNotification.body

    const topicService = this.notificationServiceByTopicType[notification.topicType]

    if (!topicService) {
      throw new ValidationError('invalid topic type', notification.topicType)
    }

    await this.rateLimitService.checkLimit(notification)
    console.log('RATE LIMIT PASSED')

    await topicService.send(notification)
    console.log('notification sent')

    console.log('saving notification')
    const notificationId = uuid()
    await notificationModel.saveNotification({ id: notificationId, ...notification, createdAt: Date.now() })
    console.log('notification created')

    return { id: notificationId }
  }
}

module.exports = NotificationService
