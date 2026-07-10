const db = require('../db')

// Get all routes
const getRoutes = (req, res) => {
  const sql = 'SELECT * FROM routes ORDER BY route_id DESC'

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results)
  })
}

// Add new route
const addRoute = (req, res) => {
  const {
    route_name,
    start_point,
    end_point,
    intermediate_stops,
    total_distance,
    service_type,
    status
  } = req.body

  if (!route_name || !start_point || !end_point) {
    return res.status(400).json({ message: 'Route name, start point and end point are required' })
  }

  const sql = `
    INSERT INTO routes
    (route_name, start_point, end_point, intermediate_stops, total_distance, service_type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  db.query(
    sql,
    [
      route_name,
      start_point,
      end_point,
      intermediate_stops,
      total_distance,
      service_type,
      status || 'Active'
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err })
      }

      res.status(201).json({ message: 'Route added successfully' })
    }
  )
}

// Delete route
const deleteRoute = (req, res) => {
  const { id } = req.params

  const sql = 'DELETE FROM routes WHERE route_id = ?'

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: 'Cannot delete route. It may be used in schedules.', error: err })
    }

    res.json({ message: 'Route deleted successfully' })
  })
}

const updateRoute = (req, res) => {
  const { id } = req.params

  const {
    route_name,
    start_point,
    end_point,
    intermediate_stops,
    total_distance,
    service_type,
    status
  } = req.body

  const sql = `
    UPDATE routes
    SET route_name = ?,
        start_point = ?,
        end_point = ?,
        intermediate_stops = ?,
        total_distance = ?,
        service_type = ?,
        status = ?
    WHERE route_id = ?
  `

  db.query(
    sql,
    [
      route_name,
      start_point,
      end_point,
      intermediate_stops,
      total_distance,
      service_type,
      status,
      id
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Route update failed', error: err })
      }

      res.json({ message: 'Route updated successfully' })
    }
  )
}

module.exports = {
  getRoutes,
  addRoute,
  updateRoute,
  deleteRoute
}