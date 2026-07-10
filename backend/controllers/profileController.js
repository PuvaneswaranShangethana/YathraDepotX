const bcrypt = require('bcryptjs')
const db = require('../db')

const getProfile = (req, res) => {
  const sql = `
    SELECT user_id, full_name, email, role, status, approval_status, created_at
    FROM users
    WHERE user_id = ?
  `

  db.query(sql, [req.user.user_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Profile not found' })
    }

    res.json(results[0])
  })
}

const updateProfile = (req, res) => {
  const { full_name } = req.body

  if (!full_name) {
    return res.status(400).json({ message: 'Full name is required' })
  }

  const sql = `
    UPDATE users
    SET full_name = ?
    WHERE user_id = ?
  `

  db.query(sql, [full_name, req.user.user_id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Profile update failed', error: err })
    }

    if (req.user.role === 'Driver') {
      const notifySql = `
        INSERT INTO notifications
        (user_id, title, message, target_roles)
        VALUES (?, ?, ?, ?)
      `

      db.query(notifySql, [
        req.user.user_id,
        'Driver Profile Updated',
        `${req.user.email} updated profile details.`,
        'Admin,Depot Manager,Supervisor'
      ])
    }

    res.json({ message: 'Profile updated successfully' })
  })
}

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current password and new password are required' })
  }

  try {
    const sql = 'SELECT password FROM users WHERE user_id = ?'

    db.query(sql, [req.user.user_id], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err })
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' })
      }

      const isMatch = await bcrypt.compare(currentPassword, results[0].password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      const updateSql = 'UPDATE users SET password = ? WHERE user_id = ?'

      db.query(updateSql, [hashedPassword, req.user.user_id], (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ message: 'Password update failed', error: updateErr })
        }

        res.json({ message: 'Password changed successfully' })
      })
    })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword
}