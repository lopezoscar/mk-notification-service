const NotificationModel = require('./notification-model')

module.exports = function (db) {
  return {
    notificationModel: new NotificationModel(db)
  }
}
