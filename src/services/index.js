const NotificationService = require('./notification-service')
const NotificationEventService = require('./notification-event-service')

const EmailService = require('./topic-services/email-service')
const PushNotificationService = require('./topic-services/push-notification-service')

module.exports = function (models) {
  const emailService = new EmailService()
  const pushNotificationService = new PushNotificationService()

  return {
    notificationService: new NotificationService({ models, emailService, pushNotificationService }),
    notificationEventService: new NotificationEventService(models)
  }
}
