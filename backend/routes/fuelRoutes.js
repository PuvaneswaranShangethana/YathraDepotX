const express = require('express')
const router = express.Router()

const {
  getFuelLogs,
  addFuelLog,
  updateFuelLog,
  deleteFuelLog
} = require('../controllers/fuelController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

router.get(
  '/',
  verifyToken,
  allowRoles('Admin', 'Supervisor'),
  getFuelLogs
)

router.post(
  '/',
  verifyToken,
  allowRoles('Admin', 'Supervisor'),
  addFuelLog
)

router.put(
  '/:id',
  verifyToken,
  allowRoles('Admin', 'Supervisor'),
  updateFuelLog
)

router.delete(
  '/:id',
  verifyToken,
  allowRoles('Admin'),
  deleteFuelLog
)

module.exports = router