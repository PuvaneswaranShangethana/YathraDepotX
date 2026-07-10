const express = require('express')
const router = express.Router()

const {
  getNotifications,
  markNotificationAsRead,
  deleteNotification
} = require('../controllers/notificationController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

router.get(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor'),
  getNotifications
)

router.put(
  '/:id/read',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor'),
  markNotificationAsRead
)

router.delete(
  '/:id',
  verifyToken,
  allowRoles('Admin'),
  deleteNotification
)

module.exports = router