const express = require('express')
const router = express.Router()

const {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

router.get(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor'),
  getVehicles
)

router.post(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager'),
  addVehicle
)

router.put(
  '/:id',
  verifyToken,
  allowRoles('Admin', 'Depot Manager'),
  updateVehicle
)

router.delete(
  '/:id',
  verifyToken,
  allowRoles('Admin'),
  deleteVehicle
)

module.exports = router