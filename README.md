# mk-notification-service

# Requirements
* Docker
* Node.js 18
* DynamoDB Docker Image
* AWS SAM

# System Design
![System Design](system-design.png "Notification Service System Design")

> notification-service receives a batch of messages from a SQS queue, store notifications in a DynamoDB Table then send notifications to the email service or the push notification service. After that, the notification-service send an event to SNS Topic to notify all the microservices subscribed if the notification was processed ok or not. Lastly, notification-service deletes SQS messages and re enter to the queue failed messages.

## Getting started

Install dependencies

```bash
npm install
```

Start docker locally

Start dynamodb locally
```bash
./src/scripts/start-dynamo-local
```

Run create-db.js script
```bash
NODE_ENV=development node src/scripts/create-db.js
```

You can simulate queue messages with (docker running is required)
```
npm run invokeProcessNotifications
```

## Tests

You can run tests with
```bash
npm test
npm run test:coverage
```
