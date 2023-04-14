const NotificationController = require('../../src/controllers/notification-controller')

function createSQSMessage (body) {
  const queueMessage = {
    Records: [
      {
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
    ]
  }
  console.log(JSON.stringify(queueMessage, null, 4))
  return queueMessage
}

describe('notification-controller', () => {
  let controller

  beforeAll(() => {
    controller = new NotificationController()
  })

  describe('sendNotification', () => {
    test('should send a notification of type status when there is no limit', async () => {
      const newNotification = { type: 'status', message: 'new status', sender: 'no-reply@modak.live', recipient: 'ada@modak.live', topicType: 'email' }
      const queueMessage = createSQSMessage(newNotification)

      const result = await controller.processNotifications(queueMessage)

      expect(result).toHaveProperty('ok')
    })
  })
})
