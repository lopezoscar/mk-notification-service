const { connect } = require('../db')
const db = connect()
const { CreateTableCommand } = require('@aws-sdk/client-dynamodb')

const notificationsTable = {
  TableName: 'notification-service-development-notifications',
  BillingMode: 'PAY_PER_REQUEST',
  AttributeDefinitions: [
    {
      AttributeName: 'id',
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
    {
      AttributeName: 'recipient',
      AttributeType: 'S'
    },
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
      IndexName: 'RecipientAndCreatedAtIndex',
      KeySchema: [
        {
          AttributeName: 'recipient',
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

createTable(notificationsTable)
