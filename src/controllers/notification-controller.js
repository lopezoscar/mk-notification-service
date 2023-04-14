class NotificationController {
  constructor (services) {
    this.services = services
  }

  async processNotifications (newNotificationList) {
    console.log('sending notifications', newNotificationList)
    const promises = newNotificationList.Records.map((newNotification) => this.sendNotification(newNotification))
    const result = await Promise.all(promises)
    return result
  }

  async sendNotification (newNotification) {
    const { notificationService, notificationEventService } = this.services
    try {
      newNotification.body = JSON.parse(newNotification.body)
      return notificationService.sendNotification(newNotification)
    } catch (error) {
      console.log(error)
      await notificationEventService.publish(error)
      return error
    }
  }

}

module.exports = NotificationController
