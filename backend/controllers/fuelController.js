const db = require('../db')

const getFuelLogs = (req, res) => {
  const sql = `
    SELECT 
      f.fuel_id,
      f.vehicle_id,
      v.registration_number,
      f.fuel_date,
      f.fuel_litres,
      f.fuel_cost,
      f.odometer_reading,
      f.notes
    FROM fuel_logs f
    JOIN vehicles v ON f.vehicle_id = v.vehicle_id
    ORDER BY f.fuel_id DESC
  `

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results)
  })
}

const addFuelLog = (req, res) => {
  const {
    vehicle_id,
    fuel_date,
    fuel_litres,
    fuel_cost,
    odometer_reading,
    notes
  } = req.body

  if (!vehicle_id || !fuel_date || !fuel_litres || !fuel_cost) {
    return res.status(400).json({
      message: 'Vehicle, fuel date, fuel litres and fuel cost are required'
    })
  }

  const sql = `
    INSERT INTO fuel_logs
    (vehicle_id, fuel_date, fuel_litres, fuel_cost, odometer_reading, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [vehicle_id, fuel_date, fuel_litres, fuel_cost, odometer_reading, notes],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err })
      }

      res.status(201).json({ message: 'Fuel log added successfully' })
    }
  )
}

const deleteFuelLog = (req, res) => {
  const { id } = req.params

  const sql = 'DELETE FROM fuel_logs WHERE fuel_id = ?'

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Delete failed', error: err })
    }

    res.json({ message: 'Fuel log deleted successfully' })
  })
}

const updateFuelLog = (req, res) => {
  const { id } = req.params

  const {
    vehicle_id,
    fuel_date,
    fuel_litres,
    fuel_cost,
    odometer_reading,
    notes
  } = req.body

  const sql = `
    UPDATE fuel_logs
    SET vehicle_id = ?,
        fuel_date = ?,
        fuel_litres = ?,
        fuel_cost = ?,
        odometer_reading = ?,
        notes = ?
    WHERE fuel_id = ?
  `

  db.query(
    sql,
    [
      vehicle_id,
      fuel_date,
      fuel_litres,
      fuel_cost,
      odometer_reading,
      notes,
      id
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: 'Fuel log update failed',
          error: err
        })
      }

      res.json({
        message: 'Fuel log updated successfully'
      })
    }
  )
}

module.exports = {
  getFuelLogs,
  addFuelLog,
  updateFuelLog,
  deleteFuelLog
}