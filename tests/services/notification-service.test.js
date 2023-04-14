const { describe } = require('yargs')
const NotificationService = require('../../src/services/notification-service')

describe('notification-service', () => {
  let service

  beforeAll(() => {
    service = new NotificationService()
  })

  describe('sendNotification', () => {
    test('should send a notification of type status when there is no limit', async () => {
      const newNotification = { type: 'status', message: 'new status', sender: 'no-reply@modak.live', recipient: 'ada@modak.live', topicType: 'email' }
      const result = await service.sendNotification(newNotification)

      expect(result).toBe('ok')
    })
  })
})
