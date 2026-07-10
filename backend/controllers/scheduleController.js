const db = require('../db')

const getSchedules = (req, res) => {
  const { view, month, weekStart, weekEnd } = req.query

  let sql = `
    SELECT 
      s.schedule_id,
      s.route_id,
      s.vehicle_id,
      s.driver_id,
      s.schedule_date,
      s.departure_time,
      s.arrival_time,
      s.trip_status,
      r.route_name,
      v.registration_number,
      d.full_name AS driver_name
    FROM schedules s
    JOIN routes r ON s.route_id = r.route_id
    JOIN vehicles v ON s.vehicle_id = v.vehicle_id
    JOIN drivers d ON s.driver_id = d.driver_id
    WHERE 1 = 1
  `

  const params = []

  if (req.user && req.user.role === 'Driver') {
    sql += ' AND d.email = ?'
    params.push(req.user.email)
  }

  if (view === 'month' && month) {
    sql += ' AND DATE_FORMAT(s.schedule_date, "%Y-%m") = ?'
    params.push(month)
  }

  if (view === 'week' && weekStart && weekEnd) {
    sql += ' AND s.schedule_date BETWEEN ? AND ?'
    params.push(weekStart, weekEnd)
  }

  sql += ' ORDER BY s.schedule_date DESC, s.departure_time ASC'

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results)
  })
}

const checkScheduleConflict = (
  schedule_date,
  vehicle_id,
  driver_id,
  departure_time,
  arrival_time,
  excludeScheduleId,
  callback
) => {
  let conflictSql = `
    SELECT * FROM schedules
    WHERE schedule_date = ?
    AND (vehicle_id = ? OR driver_id = ?)
    AND (
      (? < arrival_time AND ? > departure_time)
    )
  `

  const params = [
    schedule_date,
    vehicle_id,
    driver_id,
    departure_time,
    arrival_time
  ]

  if (excludeScheduleId) {
    conflictSql += ' AND schedule_id != ?'
    params.push(excludeScheduleId)
  }

  db.query(conflictSql, params, callback)
}

const addSchedule = (req, res) => {
  const {
    route_id,
    vehicle_id,
    driver_id,
    schedule_date,
    departure_time,
    arrival_time,
    trip_status
  } = req.body

  if (!route_id || !vehicle_id || !driver_id || !schedule_date || !departure_time || !arrival_time) {
    return res.status(400).json({ message: 'All schedule fields are required' })
  }

  if (departure_time >= arrival_time) {
    return res.status(400).json({ message: 'Arrival time must be after departure time' })
  }

  checkScheduleConflict(
    schedule_date,
    vehicle_id,
    driver_id,
    departure_time,
    arrival_time,
    null,
    (conflictErr, conflictResults) => {
      if (conflictErr) {
        return res.status(500).json({ message: 'Conflict check failed', error: conflictErr })
      }

      if (conflictResults.length > 0) {
        return res.status(400).json({
          message: 'Schedule conflict detected. Same bus or driver is already assigned during this time.'
        })
      }

      const insertSql = `
        INSERT INTO schedules
        (route_id, vehicle_id, driver_id, schedule_date, departure_time, arrival_time, trip_status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `

      db.query(
        insertSql,
        [
          route_id,
          vehicle_id,
          driver_id,
          schedule_date,
          departure_time,
          arrival_time,
          trip_status || 'Scheduled'
        ],
        (insertErr) => {
          if (insertErr) {
            return res.status(500).json({ message: 'Database error', error: insertErr })
          }

          res.status(201).json({ message: 'Schedule added successfully' })
        }
      )
    }
  )
}

const updateSchedule = (req, res) => {
  const { id } = req.params

  const {
    route_id,
    vehicle_id,
    driver_id,
    schedule_date,
    departure_time,
    arrival_time,
    trip_status
  } = req.body

  if (!route_id || !vehicle_id || !driver_id || !schedule_date || !departure_time || !arrival_time) {
    return res.status(400).json({ message: 'All schedule fields are required' })
  }

  if (departure_time >= arrival_time) {
    return res.status(400).json({ message: 'Arrival time must be after departure time' })
  }

  checkScheduleConflict(
    schedule_date,
    vehicle_id,
    driver_id,
    departure_time,
    arrival_time,
    id,
    (conflictErr, conflictResults) => {
      if (conflictErr) {
        return res.status(500).json({ message: 'Conflict check failed', error: conflictErr })
      }

      if (conflictResults.length > 0) {
        return res.status(400).json({
          message: 'Schedule conflict detected. Same bus or driver is already assigned during this time.'
        })
      }

      const sql = `
        UPDATE schedules
        SET route_id = ?,
            vehicle_id = ?,
            driver_id = ?,
            schedule_date = ?,
            departure_time = ?,
            arrival_time = ?,
            trip_status = ?
        WHERE schedule_id = ?
      `

      db.query(
        sql,
        [
          route_id,
          vehicle_id,
          driver_id,
          schedule_date,
          departure_time,
          arrival_time,
          trip_status,
          id
        ],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: 'Schedule update failed',
              error: err
            })
          }

          res.json({
            message: 'Schedule updated successfully'
          })
        }
      )
    }
  )
}

const deleteSchedule = (req, res) => {
  const { id } = req.params

  const sql = 'DELETE FROM schedules WHERE schedule_id = ?'

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Delete failed', error: err })
    }

    res.json({ message: 'Schedule deleted successfully' })
  })
}

module.exports = {
  getSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule
}