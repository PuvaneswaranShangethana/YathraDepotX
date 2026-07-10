const db = require('../db')

const getVehicles = (req, res) => {
  const sql = 'SELECT * FROM vehicles ORDER BY vehicle_id DESC'

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results)
  })
}

const addVehicle = (req, res) => {
  const {
    registration_number,
    vehicle_type,
    seating_capacity,
    mileage,
    service_type,
    status
  } = req.body

  if (!registration_number || !seating_capacity) {
    return res.status(400).json({
      message: 'Registration number and seating capacity are required'
    })
  }

  const sql = `
    INSERT INTO vehicles
    (registration_number, vehicle_type, seating_capacity, mileage, service_type, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [
      registration_number,
      vehicle_type,
      seating_capacity,
      mileage,
      service_type,
      status || 'Available'
    ],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Vehicle registration number already exists' })
        }

        return res.status(500).json({ message: 'Database error', error: err })
      }

      res.status(201).json({ message: 'Vehicle added successfully' })
    }
  )
}

const deleteVehicle = (req, res) => {
  const { id } = req.params

  const sql = 'DELETE FROM vehicles WHERE vehicle_id = ?'

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Cannot delete vehicle. It may be used in schedules, fuel logs, or maintenance logs.',
        error: err
      })
    }

    res.json({ message: 'Vehicle deleted successfully' })
  })
}

const updateVehicle = (req, res) => {
  const { id } = req.params

  const {
    registration_number,
    vehicle_type,
    seating_capacity,
    mileage,
    service_type,
    status
  } = req.body

  const sql = `
    UPDATE vehicles
    SET registration_number = ?,
        vehicle_type = ?,
        seating_capacity = ?,
        mileage = ?,
        service_type = ?,
        status = ?
    WHERE vehicle_id = ?
  `

  db.query(
    sql,
    [
      registration_number,
      vehicle_type,
      seating_capacity,
      mileage,
      service_type,
      status,
      id
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: 'Vehicle update failed',
          error: err
        })
      }

      res.json({
        message: 'Vehicle updated successfully'
      })
    }
  )
}

module.exports = {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle
}