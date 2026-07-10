const db = require('../db')

const getDrivers = (req, res) => {
  const sql = 'SELECT * FROM drivers ORDER BY driver_id DESC'

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results)
  })
}

const addDriver = (req, res) => {
  const {
    full_name,
    phone,
    license_number,
    license_expiry,
    working_hours,
    status
  } = req.body

  if (!full_name || !license_number || !license_expiry) {
    return res.status(400).json({
      message: 'Full name, licence number and licence expiry are required'
    })
  }

  const sql = `
    INSERT INTO drivers
    (full_name, phone, license_number, license_expiry, working_hours, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [
      full_name,
      phone,
      license_number,
      license_expiry,
      working_hours,
      status || 'Available'
    ],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Driver licence number already exists' })
        }

        return res.status(500).json({ message: 'Database error', error: err })
      }

      res.status(201).json({ message: 'Driver added successfully' })
    }
  )
}

const deleteDriver = (req, res) => {
  const { id } = req.params

  const sql = 'DELETE FROM drivers WHERE driver_id = ?'

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Cannot delete driver. Driver may be assigned to schedules.',
        error: err
      })
    }

    res.json({ message: 'Driver deleted successfully' })
  })
}

const updateDriver = (req, res) => {
  const { id } = req.params

  const {
    full_name,
    phone,
    license_number,
    license_expiry,
    working_hours,
    status
  } = req.body

  const sql = `
    UPDATE drivers
    SET full_name = ?,
        phone = ?,
        license_number = ?,
        license_expiry = ?,
        working_hours = ?,
        status = ?
    WHERE driver_id = ?
  `

  db.query(
    sql,
    [
      full_name,
      phone,
      license_number,
      license_expiry,
      working_hours,
      status,
      id
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: 'Driver update failed',
          error: err
        })
      }

      res.json({
        message: 'Driver updated successfully'
      })
    }
  )
}

module.exports = {
  getDrivers,
  addDriver,
  updateDriver,
  deleteDriver
}