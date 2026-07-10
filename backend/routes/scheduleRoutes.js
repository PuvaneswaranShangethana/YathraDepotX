const express = require('express')
const router = express.Router()

const {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

router.get(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor', 'Driver'),
  getSchedules
)

router.post(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager'),
  addSchedule
)

router.put(
  '/:id',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor'),
  updateSchedule
)

router.delete(
  '/:id',
  verifyToken,
  allowRoles('Admin', 'Depot Manager'),
  deleteSchedule
)

module.exports = router