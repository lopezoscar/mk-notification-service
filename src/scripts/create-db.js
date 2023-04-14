const { connect } = require('../db')
const db = connect()
const { CreateTableCommand, DeleteTableCommand } = require('@aws-sdk/client-dynamodb')

const notificationsTable = {
  TableName: 'notification-service-development-notifications',
  BillingMode: 'PAY_PER_REQUEST',
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S'
    },
    {
      AttributeName: 'recipientAndType',
      AttributeType: 'S'
    },
    // {
    //   AttributeName: 'type',
    //   AttributeType: 'S'
    // },
    // {
    //   AttributeName: 'sender',
    //   AttributeType: 'S'
    // },
    // {
    //   AttributeName: 'recipient',
    //   AttributeType: 'S'
    // },
    // {
    //   AttributeName: 'message',
    //   AttributeType: 'S'
    // },
    // {
    //   AttributeName: 'topicType',
    //   AttributeType: 'S'
    // },
    {
      AttributeName: 'createdAt',
      AttributeType: 'N'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH'
    }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'RecipientAndTypeAndCreatedAtIndex',
      KeySchema: [
        {
          AttributeName: 'recipientAndType',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'createdAt',
          KeyType: 'RANGE'
        }
      ],
      Projection: {
        ProjectionType: 'ALL'
      }
    }
  ]
}

async function createTable (schema) {
  const command = new CreateTableCommand(schema)
  const result = await db.send(command)
  console.log(result)
}

async function deleteTable (tableName) {
  const deleteTableCMD = new DeleteTableCommand({
    TableName: tableName
  })
  const result = await db.send(deleteTableCMD)
  console.log(result)
  return result
}

// deleteTable('notification-service-development-notifications')
createTable(notificationsTable)
