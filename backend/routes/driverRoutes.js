const express = require('express')
const router = express.Router()

const {
  getDrivers,
  addDriver,
  updateDriver,
  deleteDriver
} = require('../controllers/driverController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

router.get(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor'),
  getDrivers
)

router.post(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager'),
  addDriver
)

router.put(
  '/:id',
  verifyToken,
  allowRoles('Admin', 'Depot Manager'),
  updateDriver
)

router.delete(
  '/:id',
  verifyToken,
  allowRoles('Admin'),
  deleteDriver
)

module.exports = router