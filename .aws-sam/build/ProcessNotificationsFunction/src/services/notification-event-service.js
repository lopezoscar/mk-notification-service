class NotificationEventService {
  publish (message) {
    console.log('SIMULATING publising message on SNS TOPIC notification-service-events', message)
    return Promise.resolve({})
  }
}

module.exports = NotificationEventService
