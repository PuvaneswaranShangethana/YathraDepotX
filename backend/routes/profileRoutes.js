const express = require('express')
const router = express.Router()

const {
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/profileController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

router.get(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor', 'Driver'),
  getProfile
)

router.put(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor', 'Driver'),
  updateProfile
)

router.put(
  '/change-password',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor', 'Driver'),
  changePassword
)

module.exports = router