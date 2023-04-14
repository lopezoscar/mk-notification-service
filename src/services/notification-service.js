const InternalServerError = require('../errors/InternalServerError')
const { v4: uuid } = require('uuid')

class NotificationService {
  constructor ({ models, emailService, pushNotificationService }) {
    this.models = models

    this.notificationServiceByTopicType = {
      email: emailService,
      push: pushNotificationService
    }
  }

  async sendNotification (newNotification) {
    const { notificationModel } = this.models
    const notification = newNotification.body

    const topicService = this.notificationServiceByTopicType[notification.topicType]
    try {
      console.log('saving notification')
      await notificationModel.saveNotification({ id: uuid(), ...notification, createdAt: Date.now() })
      console.log('notification stored')
      console.log('sending event to SNS Topic')
      await topicService.send(notification)
      console.log('event sent')
    } catch (error) {
      console.log('TODO send by SNS error', error)
      throw new InternalServerError(error)
    }
  }
}

module.exports = NotificationService
