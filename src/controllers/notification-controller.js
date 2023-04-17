class NotificationController {
  constructor ({ services, notificationsQueue }) {
    this.services = services
    this.notificationsQueue = notificationsQueue
  }

  /**
   * If a Lambda function returns a success response, SQS will delete all the messages
   * but if some of the messages are ok and others fail, you have to delete the success messages from the queue
   * to not enter again those messages to the queue
   * and return an error to enter only the failed messages
   *
   * https://docs.aws.amazon.com/en_gb/lambda/latest/dg/with-sqs.html
   */
  async processNotifications ({ Records: records }) {
    console.log('sending notifications', records)

    const promises = records.map((newNotification) => this.sendNotification(newNotification))
    const results = await Promise.allSettled(promises)

    const rejectedNotifications = results.filter(result => result.status.rejected)

    if (rejectedNotifications.length > 0) {
      throw new Error(`process partially completed. ${rejectedNotifications.length} failed - Failed messages will re enter to the SQS queue`)
    }
    return { processStatus: 'finished' }
  }

  async sendNotification (newNotification) {
    const { notificationService, notificationEventService } = this.services
    try {
      newNotification.body = JSON.parse(newNotification.body)
      const notification = await notificationService.sendNotification(newNotification)

      console.log('sending event to SNS Topic')
      await notificationEventService.publish({ event: 'notification-created', notification })

      await this.notificationsQueue.deleteMessage(newNotification.receiptHandle)
      console.log('event sent')
    } catch (error) {
      console.log('send notification error', error)
      await notificationEventService.publish({ event: 'notification-error', error: error.getCode(), data: newNotification })
    }
  }
}

module.exports = NotificationController
