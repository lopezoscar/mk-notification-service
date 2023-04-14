
const { connect } = require('./src/db')
const db = connect()

const modelsLayer = require('./src/models')
const servicesLayer = require('./src/services')

const models = modelsLayer(db)
const services = servicesLayer(models)

const NotificationController = require('./src/controllers/notification-controller')
const notificationController = new NotificationController(services)

exports.processNotifications = (event) => notificationController.processNotifications(event)
