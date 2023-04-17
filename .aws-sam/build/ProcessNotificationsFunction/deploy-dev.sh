#!/bin/bash

sam build
sam package --output-template-file output.yaml
sam deploy --template-file output.yaml --stack-name mk-notification-service-dev --capabilities CAPABILITY_IAM --parameter-overrides ParameterKey=Environment,ParameterValue=dev ParameterKey=MicroserviceName,ParameterValue="NotificationService"