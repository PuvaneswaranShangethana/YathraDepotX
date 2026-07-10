import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

function Reports() {
  const [summary, setSummary] = useState({})
  const [reports, setReports] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/reports/summary',
        config
      )

      setSummary(response.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load report summary')
    }
  }

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/reports',
        config
      )

      setReports(response.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load reports')
    }
  }

  useEffect(() => {
    fetchSummary()
    fetchReports()
  }, [])

  const filteredReports = reports.filter((report) =>
    report.report_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.generated_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.generated_date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.report_description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const chartData = [
    { name: 'Routes', value: summary.active_routes || 0 },
    { name: 'Vehicles', value: summary.total_vehicles || 0 },
    { name: 'Drivers', value: summary.total_drivers || 0 },
    { name: 'Trips', value: summary.completed_trips || 0 }
  ]

  const costChartData = [
    { name: 'Fuel Cost', value: summary.total_fuel_cost || 0 },
    { name: 'Maintenance Cost', value: summary.total_maintenance_cost || 0 }
  ]

  const handlePrint = () => {
    toast.info('Preparing report for print')

    setTimeout(() => {
      window.print()
    }, 500)
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Reports & Analytics</h2>
        <p>Generate operational reports and analyse depot performance</p>
      </div>

      <div className="report-print-area">
        <div className="row mt-4">
          <div className="col-md-3 mb-3">
            <div className="modern-card">
              <p>Active Routes</p>
              <h3>{summary.active_routes || 0}</h3>
              <small>Currently active</small>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="modern-card">
              <p>Total Vehicles</p>
              <h3>{summary.total_vehicles || 0}</h3>
              <small>Fleet records</small>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="modern-card">
              <p>Total Drivers</p>
              <h3>{summary.total_drivers || 0}</h3>
              <small>Driver records</small>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="modern-card">
              <p>Completed Trips</p>
              <h3>{summary.completed_trips || 0}</h3>
              <small>Completed schedules</small>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-4 mb-3">
            <div className="modern-card">
              <p>Total Fuel Usage</p>
              <h3>{summary.total_fuel_litres || 0} L</h3>
              <small>All fuel logs</small>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="modern-card">
              <p>Total Fuel Cost</p>
              <h3>Rs. {summary.total_fuel_cost || 0}</h3>
              <small>Fuel expenses</small>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="modern-card">
              <p>Maintenance Cost</p>
              <h3>Rs. {summary.total_maintenance_cost || 0}</h3>
              <small>Maintenance expenses</small>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6 mb-3">
            <div className="panel-card">
              <h5>Operational Summary Chart</h5>

              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="panel-card">
              <h5>Cost Summary Chart</h5>

              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={costChartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="panel-card mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3 no-print">
            <div>
              <h5>Generated Reports</h5>
              <small className="text-muted">
                Total Reports: {filteredReports.length}
              </small>
            </div>

            <button className="btn btn-primary" onClick={handlePrint}>
              Print / Export PDF
            </button>
          </div>

          <div className="mb-3 no-print">
            <input
              type="text"
              className="form-control"
              placeholder="Search report by type, generated by, date, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <table className="table table-hover">
            <thead>
              <tr>
                <th>Report Type</th>
                <th>Generated By</th>
                <th>Date</th>
                <th>Description</th>
              </tr>
            </thead>

            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.report_id}>
                    <td>
                      <span className="badge bg-info">
                        {report.report_type}
                      </span>
                    </td>
                    <td>{report.generated_by}</td>
                    <td>{report.generated_date}</td>
                    <td>{report.report_description}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default Reports