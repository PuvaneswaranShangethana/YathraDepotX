const express = require('express')
const router = express.Router()

const {
  getRoutes,
  addRoute,
  updateRoute,
  deleteRoute
} = require('../controllers/routeController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

router.get(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager', 'Supervisor', 'Driver'),
  getRoutes
)

router.post(
  '/',
  verifyToken,
  allowRoles('Admin', 'Depot Manager'),
  addRoute
)

router.put(
  '/:id',
  verifyToken,
  allowRoles('Admin', 'Depot Manager'),
  updateRoute
)

router.delete(
  '/:id',
  verifyToken,
  allowRoles('Admin'),
  deleteRoute
)

module.exports = router