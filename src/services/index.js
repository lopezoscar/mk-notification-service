const NotificationService = require('./notification-service')
const NotificationEventService = require('./notification-event-service')

const EmailService = require('./topic-services/email-service')
const PushNotificationService = require('./topic-services/push-notification-service')

const RateLimitService = require('./rate-limit-service')

module.exports = function (models) {
  const emailService = new EmailService()
  const pushNotificationService = new PushNotificationService()
  const rateLimitService = new RateLimitService(models)

  return {
    notificationService: new NotificationService({ models, emailService, pushNotificationService, rateLimitService }),
    notificationEventService: new NotificationEventService(models)
  }
}
