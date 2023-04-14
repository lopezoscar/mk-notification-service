const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')

const dbOpts = { apiVersion: '2012-08-10', region: process.env.REGION || 'us-east-1' }

if (process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'development') {
  dbOpts.endpoint = 'http://localhost:8000'
}

if (process.env.AWS_SAM_LOCAL) {
  console.log('SAM LOCAL')
  dbOpts.endpoint = 'http://host.docker.internal:8000'
}

module.exports.connect = () => {
  console.log(dbOpts)
  return new DynamoDBClient(dbOpts)
}
