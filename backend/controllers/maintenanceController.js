const db = require('../db')

const getMaintenanceLogs = (req, res) => {
  const sql = `
    SELECT 
      m.maintenance_id,
      m.vehicle_id,
      v.registration_number,
      m.maintenance_type,
      m.maintenance_date,
      m.description,
      m.cost,
      m.next_service_date,
      m.status
    FROM maintenance_logs m
    JOIN vehicles v ON m.vehicle_id = v.vehicle_id
    ORDER BY m.maintenance_id DESC
  `

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results)
  })
}

const addMaintenanceLog = (req, res) => {
  const {
    vehicle_id,
    maintenance_type,
    maintenance_date,
    description,
    cost,
    next_service_date,
    status
  } = req.body

  if (!vehicle_id || !maintenance_type || !maintenance_date) {
    return res.status(400).json({
      message: 'Vehicle, maintenance type and date are required'
    })
  }

  const sql = `
    INSERT INTO maintenance_logs
    (vehicle_id, maintenance_type, maintenance_date, description, cost, next_service_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [
      vehicle_id,
      maintenance_type,
      maintenance_date,
      description,
      cost,
      next_service_date,
      status || 'Pending'
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err })
      }

      res.status(201).json({ message: 'Maintenance log added successfully' })
    }
  )
}

const deleteMaintenanceLog = (req, res) => {
  const { id } = req.params

  const sql = 'DELETE FROM maintenance_logs WHERE maintenance_id = ?'

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Delete failed', error: err })
    }

    res.json({ message: 'Maintenance log deleted successfully' })
  })
}

const updateMaintenanceLog = (req, res) => {
  const { id } = req.params

  const {
    vehicle_id,
    maintenance_type,
    maintenance_date,
    description,
    cost,
    next_service_date,
    status
  } = req.body

  const sql = `
    UPDATE maintenance_logs
    SET vehicle_id = ?,
        maintenance_type = ?,
        maintenance_date = ?,
        description = ?,
        cost = ?,
        next_service_date = ?,
        status = ?
    WHERE maintenance_id = ?
  `

  db.query(
    sql,
    [
      vehicle_id,
      maintenance_type,
      maintenance_date,
      description,
      cost,
      next_service_date,
      status,
      id
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: 'Maintenance log update failed',
          error: err
        })
      }

      res.json({
        message: 'Maintenance log updated successfully'
      })
    }
  )
}

module.exports = {
  getMaintenanceLogs,
  addMaintenanceLog,
  updateMaintenanceLog,
  deleteMaintenanceLog
}