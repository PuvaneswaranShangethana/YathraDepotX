const express = require('express')
const router = express.Router()

const {
  getMaintenanceLogs,
  addMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog
} = require('../controllers/maintenanceController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

router.get(
  '/',
  verifyToken,
  allowRoles('Admin', 'Supervisor'),
  getMaintenanceLogs
)

router.post(
  '/',
  verifyToken,
  allowRoles('Admin', 'Supervisor'),
  addMaintenanceLog
)

router.put(
  '/:id',
  verifyToken,
  allowRoles('Admin', 'Supervisor'),
  updateMaintenanceLog
)

router.delete(
  '/:id',
  verifyToken,
  allowRoles('Admin'),
  deleteMaintenanceLog
)

module.exports = router