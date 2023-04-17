const RateLimitService = require('../../src/services/rate-limit-service')
const timeMock = require('timekeeper')

describe('RateLimitService', () => {
  let service

  beforeAll(() => {
    const time = new Date(1681748223475)
    timeMock.freeze(time)
    // dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => 1681748223475)

    service = new RateLimitService({
      notificationModel: {
        getNotificationsByRecipientAndTypeSortedByCreatedAt: jest.fn().mockResolvedValue([])
      }
    })
  })

  afterAll(() => {
    // dateNowSpy.mockRestore()
    timeMock.reset()
  })

  describe('checkLimit', () => {
    test('should throw ValidationError when it passed an invalid notification type', async () => {
      const type = 'invalid_type'
      const recipient = 'recipient@email.com'
      await expect(service.checkLimit({ type, recipient })).rejects.toThrow('invalid notification type')
    })

    test('should return valid status when there aren`t notifications for this recipient and type', async () => {
      const type = 'news' // 1 in 24 * 60 minutes
      const recipient = 'recipient@email.com'

      const frequencyInMinutes = 24 * 60
      const startTS = Date.now() - frequencyInMinutes * 60 * 1000

      await expect(service.checkLimit({ type, recipient })).resolves.toHaveProperty('valid', true)

      expect(service.models.notificationModel.getNotificationsByRecipientAndTypeSortedByCreatedAt).toHaveBeenCalledTimes(1)
      expect(service.models.notificationModel.getNotificationsByRecipientAndTypeSortedByCreatedAt).toHaveBeenCalledWith({ recipient, type, createdAt: startTS })
    })

    test('should throw TooManyRequestsError when there it passed the request limit for this notification type', async () => {
      const notificationsInPeriod = [{}, {}, {}]

      service = new RateLimitService({
        notificationModel: {
          getNotificationsByRecipientAndTypeSortedByCreatedAt: jest.fn().mockResolvedValue(notificationsInPeriod)
        }
      })

      const type = 'status'
      const recipient = 'recipient@email.com'

      await expect(service.checkLimit({ type, recipient })).rejects.toThrow('request limit reached 2 in 1 minutes')
    })

    test('should return valid status when the request is inside of limits', async () => {
      const notificationsInPeriod = [{}]

      service = new RateLimitService({
        notificationModel: {
          getNotificationsByRecipientAndTypeSortedByCreatedAt: jest.fn().mockResolvedValue(notificationsInPeriod)
        }
      })

      const type = 'marketing' // limit for marketing is 3 in 60 minutes
      const recipient = 'recipient@email.com'

      const frequencyInMinutes = 60
      const startTS = Date.now() - frequencyInMinutes * 60 * 1000

      await expect(service.checkLimit({ type, recipient })).resolves.toHaveProperty('valid', true)

      expect(service.models.notificationModel.getNotificationsByRecipientAndTypeSortedByCreatedAt).toHaveBeenCalledTimes(1)
      expect(service.models.notificationModel.getNotificationsByRecipientAndTypeSortedByCreatedAt).toHaveBeenCalledWith({ recipient, type, createdAt: startTS })
    })
  })
})
