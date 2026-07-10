const db = require('../db')

const getNotifications = (req, res) => {
  const role = req.user.role

  const sql = `
    SELECT 
      notification_id,
      user_id,
      title,
      message,
      target_roles,
      is_read,
      created_at
    FROM notifications
    WHERE target_roles LIKE ?
    ORDER BY created_at DESC
  `

  db.query(sql, [`%${role}%`], (err, results) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to load notifications',
        error: err
      })
    }

    res.json(results)
  })
}

const markNotificationAsRead = (req, res) => {
  const { id } = req.params

  const sql = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE notification_id = ?
  `

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to update notification',
        error: err
      })
    }

    res.json({
      message: 'Notification marked as read'
    })
  })
}

const deleteNotification = (req, res) => {
  const { id } = req.params

  const sql = `
    DELETE FROM notifications
    WHERE notification_id = ?
  `

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Failed to delete notification',
        error: err
      })
    }

    res.json({
      message: 'Notification deleted successfully'
    })
  })
}

module.exports = {
  getNotifications,
  markNotificationAsRead,
  deleteNotification
}