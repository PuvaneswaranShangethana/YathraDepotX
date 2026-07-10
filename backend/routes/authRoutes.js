const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')

const {
  verifyToken,
  allowRoles
} = require('../middleware/authMiddleware')

// Public routes
router.post('/register-driver', authController.registerDriver)
router.post('/login', authController.login)

// Admin-only routes
router.post(
  '/add-user',
  verifyToken,
  allowRoles('Admin'),
  authController.addUser
)

router.get(
  '/pending-drivers',
  verifyToken,
  allowRoles('Admin'),
  authController.getPendingDrivers
)

router.put(
  '/approve-driver/:id',
  verifyToken,
  allowRoles('Admin'),
  authController.approveDriver
)

router.put(
  '/reject-driver/:id',
  verifyToken,
  allowRoles('Admin'),
  authController.rejectDriver
)

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working' })
})

module.exports = router