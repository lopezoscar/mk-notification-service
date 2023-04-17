const NotificationController = require('../../src/controllers/notification-controller')
const TooManyRequestsError = require('../../src/errors/TooManyRequestsError')

jest.mock('@aws-sdk/client-sqs')

const Queue = require('../../src/queue')

const { connect } = require('../../src/db')

const modelsLayer = require('../../src/models')
const servicesLayer = require('../../src/services')
const { TagQueueCommand } = require('@aws-sdk/client-sqs')

jest.mock('../../src/models/notification-model', () => {
  return jest.fn().mockImplementation(() => {
    return {
      saveNotification: jest.fn().mockResolvedValue({}),
      getNotificationsByRecipientAndTypeSorteByCreatedAt: jest.fn().mockResolvedValue([])
    }
  })
})

jest.mock('../../src/services/notification-service', () => {
  return jest.fn().mockImplementation(() => {
    return {
      sendNotification: jest.fn().mockResolvedValue({})
    }
  })
})

function createSQSMessage (body) {
  return {
    messageId: '19dd0b57-b21e-4ac1-bd88-01bbb068cb78',
    receiptHandle: 'MessageReceiptHandle',
    body: JSON.stringify(body),
    attributes: {
      ApproximateReceiveCount: '1',
      SentTimestamp: '1523232000000',
      SenderId: '123456789012',
      ApproximateFirstReceiveTimestamp: '1523232000001'
    },
    messageAttributes: {},
    md5OfBody: '7b270e59b47ff90a553787216d55d91d',
    eventSource: 'aws:sqs',
    eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:MyQueue',
    awsRegion: 'us-east-1'
  }
}

describe('notification-controller', () => {
  let controller

  beforeAll(() => {
    const db = connect()
    const notificationsQueue = new Queue()
    const models = modelsLayer(db)
    const services = servicesLayer(models)

    controller = new NotificationController({ services, notificationsQueue })
  })

  describe('sendNotification', () => {
    test('should send a notification of type status when there is no limit', async () => {
      const newNotification = { type: 'status', message: 'new status', sender: 'no-reply@modak.live', recipient: 'ada@modak.live', topicType: 'email' }
      const queueMessage = createSQSMessage(newNotification)

      const result = await controller.processNotifications({ Records: [queueMessage] })

      expect(result).toHaveProperty('processStatus', 'finished')
    })

    test('should fail sending a notification of type status when reach the rate limit ', async () => {
      controller = new NotificationController({
        services: {
          notificationService: {
            sendNotification: jest.fn().mockRejectedValue(new TooManyRequestsError())
          },
          notificationEventService: {
            publish: jest.fn().mockResolvedValue()
          }
        },
        notificationsQueue: {
          deleteMessage: jest.fn().mockResolvedValue()
        }
      })

      const newNotification = { type: 'status', message: 'new status', sender: 'no-reply@modak.live', recipient: 'ada@modak.live', topicType: 'email' }

      const records = []
      records.push(createSQSMessage(newNotification))

      await expect(controller.processNotifications({ Records: records })).resolves.toEqual({ processStatus: 'finished' })

      expect(controller.services.notificationEventService.publish).toHaveBeenCalledTimes(1)
      expect(controller.services.notificationEventService.publish).toHaveBeenCalledWith({ event: 'notification-error', error: 'TOO_MANY_REQUESTS_ERROR', data: records[0] })
    })

    test('should return processStatus "finished" if all messages were sent', async () => {
      const newNotification = { type: 'status', message: 'new status', sender: 'no-reply@modak.live', recipient: 'ada@modak.live', topicType: 'email' }

      controller = new NotificationController({
        services: {
          notificationService: {
            sendNotification: jest.fn().mockResolvedValue()
          },
          notificationEventService: {
            publish: jest.fn().mockResolvedValue()
          }
        },
        notificationsQueue: {
          deleteMessage: jest.fn(() => Promise.resolve())
        }
      })

      const records = []
      records.push(createSQSMessage(newNotification))
      records.push(createSQSMessage(newNotification))
      records.push(createSQSMessage(newNotification))

      await expect(controller.processNotifications({ Records: records })).resolves.toEqual({ processStatus: 'finished' })

      expect(controller.services.notificationService.sendNotification).toHaveBeenCalledTimes(3)
      expect(controller.services.notificationEventService.publish).toHaveBeenCalledTimes(3)
      expect(controller.notificationsQueue.deleteMessage).toHaveBeenCalledTimes(3)
    })

    test('should delete success messages and throw an error if some messages fail', async () => {
      controller = new NotificationController({
        services: {
          notificationService: {
            sendNotification: jest.fn().mockImplementation((newNotification) => {
              if (newNotification.body?.error) {
                throw new TooManyRequestsError()
              }
              return {}
            })
          },
          notificationEventService: {
            publish: jest.fn().mockResolvedValue()
          }
        },
        notificationsQueue: {
          deleteMessage: jest.fn().mockResolvedValue()
        }
      })
      const records = [
        createSQSMessage({}),
        createSQSMessage({ error: true }),
        createSQSMessage({})
      ]

      await expect(controller.processNotifications({ Records: records })).resolves.toEqual({ processStatus: 'finished' })

      expect(controller.notificationsQueue.deleteMessage).toHaveBeenCalledTimes(2)
      expect(controller.services.notificationService.sendNotification).toHaveBeenCalledTimes(3)
      expect(controller.services.notificationEventService.publish).toHaveBeenCalledTimes(3)
    })
  })
})
