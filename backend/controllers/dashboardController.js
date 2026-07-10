const db = require('../db')

const getDashboardSummary = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM routes WHERE status = 'Active') AS active_routes,
      (SELECT COUNT(*) FROM vehicles WHERE status = 'Available') AS available_buses,
      (SELECT COUNT(*) FROM drivers WHERE status = 'Available') AS available_drivers,
      (SELECT COUNT(*) FROM schedules WHERE trip_status = 'Completed') AS completed_trips,
      (SELECT COUNT(*) FROM schedules WHERE trip_status = 'Delayed') AS delayed_trips,
      (SELECT COUNT(*) FROM users WHERE role = 'Driver' AND approval_status = 'Pending') AS pending_drivers,
      (SELECT COUNT(*) FROM maintenance_logs WHERE status = 'Pending') AS pending_maintenance
  `

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results[0])
  })
}

const getRecentTrips = (req, res) => {
  const sql = `
    SELECT 
      s.schedule_id,
      r.route_name,
      v.registration_number,
      d.full_name AS driver_name,
      s.trip_status
    FROM schedules s
    JOIN routes r ON s.route_id = r.route_id
    JOIN vehicles v ON s.vehicle_id = v.vehicle_id
    JOIN drivers d ON s.driver_id = d.driver_id
    ORDER BY s.schedule_id DESC
    LIMIT 5
  `

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results)
  })
}

module.exports = {
  getDashboardSummary,
  getRecentTrips
}