const { PutItemCommand, QueryCommand } = require('@aws-sdk/client-dynamodb')

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
        recipientAndType: { S: `${recipient}#${type}` },
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

  async getNotificationsByRecipientAndTypeSortedByCreatedAt ({ recipient, type, createdAt }) {
    const command = new QueryCommand({
      TableName: NOTIFICATIONS_TABLE,
      IndexName: 'RecipientAndTypeAndCreatedAtIndex',
      KeyConditionExpression: 'recipientAndType=:recipientAndType and createdAt >= :createdAt',
      ExpressionAttributeValues: { ':recipientAndType': { S: `${recipient}#${type}` }, ':createdAt': { N: createdAt } }
    })
    const { Items } = await this.db.send(command)
    return Items
  }
}

module.exports = NotificationModel
