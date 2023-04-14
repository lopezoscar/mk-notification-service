const { PutItemCommand } = require('@aws-sdk/client-dynamodb')
const NOTIFICATIONS_TABLE = `${process.env.TABLE_PREFIX}-notifications`

class NotificationModel {
  constructor (db) {
    this.db = db
  }

  async saveNotification ({ id, type, message, sender, recipient, topicType, createdAt = Date.now() }) {
    const command = new PutItemCommand({
      TableName: NOTIFICATIONS_TABLE,
      Item: {
        id: { S: id },
        type: { S: type },
        sender: { S: sender },
        recipient: { S: recipient },
        message: { S: message },
        topicType: { S: topicType },
        createdAt: { N: createdAt }
      }
    })
    return this.db.send(command)
  }
}

module.exports = NotificationModel
