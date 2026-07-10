const db = require('../db')

const getReportSummary = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM routes WHERE status = 'Active') AS active_routes,
      (SELECT COUNT(*) FROM vehicles) AS total_vehicles,
      (SELECT COUNT(*) FROM drivers) AS total_drivers,
      (SELECT COUNT(*) FROM schedules WHERE trip_status = 'Completed') AS completed_trips,
      (SELECT IFNULL(SUM(fuel_litres), 0) FROM fuel_logs) AS total_fuel_litres,
      (SELECT IFNULL(SUM(fuel_cost), 0) FROM fuel_logs) AS total_fuel_cost,
      (SELECT IFNULL(SUM(cost), 0) FROM maintenance_logs) AS total_maintenance_cost
  `

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results[0])
  })
}

const getReports = (req, res) => {
  const sql = `
    SELECT 
      r.report_id,
      r.report_type,
      r.generated_date,
      r.report_description,
      u.full_name AS generated_by
    FROM reports r
    LEFT JOIN users u ON r.generated_by = u.user_id
    ORDER BY r.report_id DESC
  `

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error', error: err })
    }

    res.json(results)
  })
}

module.exports = {
  getReportSummary,
  getReports
}