const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../db')

const isStrongPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
  return strongPasswordRegex.test(password)
}

// Driver self-register
const registerDriver = async (req, res) => {
  const full_name = req.body.full_name?.trim()
  const email = req.body.email?.trim()
  const password = req.body.password

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const sql = `
      INSERT INTO users (full_name, email, password, role, approval_status)
      VALUES (?, ?, ?, 'Driver', 'Pending')
    `

    db.query(sql, [full_name, email, hashedPassword], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists' })
        }

        return res.status(500).json({ message: 'Database error', error: err })
      }

      res.status(201).json({
        message: 'Driver registered successfully. Waiting for admin approval.'
      })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

// Admin creates staff user
const addUser = async (req, res) => {
  const full_name = req.body.full_name?.trim()
  const email = req.body.email?.trim()
  const password = req.body.password
  const role = req.body.role?.trim()

  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character'
    })
  }

  if (role === 'Admin') {
    return res.status(400).json({ message: 'Admin cannot be created from this form' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const sql = `
      INSERT INTO users (full_name, email, password, role, approval_status)
      VALUES (?, ?, ?, ?, 'Approved')
    `

    db.query(sql, [full_name, email, hashedPassword, role], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists' })
        }

        return res.status(500).json({ message: 'Database error', error: err })
      }

      res.status(201).json({ message: 'User created successfully' })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

// Login
const login = (req, res) => {
  const email = req.body.email?.trim()
  const password = req.body.password
  const role = req.body.role?.trim()

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password and role are required' })
  }

  const sql = 'SELECT * FROM users WHERE email = ? AND role = ?'

  db.query(sql, [email, role], async (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email, password or role' })
    }

    const user = results[0]

    if (user.status !== 'Active') {
      return res.status(403).json({ message: 'Your account is inactive' })
    }

    if (user.approval_status !== 'Approved') {
      return res.status(403).json({
        message: `Your account is ${user.approval_status}. Please contact admin.`
      })
    }

    const isPasswordMatch = await bcrypt.compare(password, String(user.password))

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid email, password or role' })
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    })
  })
}

const getPendingDrivers = (req, res) => {
  const sql = `
    SELECT user_id, full_name, email, role, approval_status, created_at
    FROM users
    WHERE role = 'Driver' AND approval_status = 'Pending'
  `

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results)
  })
}

const approveDriver = (req, res) => {
  const { id } = req.params

  const sql = `
    UPDATE users
    SET approval_status = 'Approved'
    WHERE user_id = ? AND role = 'Driver'
  `

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json({ message: 'Driver approved successfully' })
  })
}

const rejectDriver = (req, res) => {
  const { id } = req.params

  const sql = `
    UPDATE users
    SET approval_status = 'Rejected'
    WHERE user_id = ? AND role = 'Driver'
  `

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json({ message: 'Driver rejected successfully' })
  })
}

module.exports = {
  registerDriver,
  addUser,
  login,
  getPendingDrivers,
  approveDriver,
  rejectDriver
}