const { SQSClient, DeleteMessageCommand } = require('@aws-sdk/client-sqs')
const ValidationError = require('./errors/ValidationError')

class Queue {
  constructor (queueUrl) {
    this.queue = new SQSClient({
      region: process.env.REGION || 'us-east-1'
    })
    this.queueUrl = queueUrl
  }

  deleteMessage (receiptHandle) {
    if (!receiptHandle) {
      throw new ValidationError('receiptHandle is required')
    }
    const input = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle
    }
    const command = new DeleteMessageCommand(input)
    return this.queue.send(command)
  }
}

module.exports = Queue
