const express = require('express')
const router = express.Router()

const {
  getDashboardSummary,
  getRecentTrips
} = require('../controllers/dashboardController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

router.get(
  '/summary',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor', 'Driver'),
  getDashboardSummary
)

router.get(
  '/recent-trips',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor', 'Driver'),
  getRecentTrips
)

module.exports = router