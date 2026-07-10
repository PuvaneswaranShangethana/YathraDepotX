const express = require('express')
const router = express.Router()

const {
  getReportSummary,
  getReports
} = require('../controllers/reportController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

router.get(
  '/summary',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor', 'Driver'),
  getReportSummary
)

router.get(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor', 'Driver'),
  getReports
)

module.exports = router