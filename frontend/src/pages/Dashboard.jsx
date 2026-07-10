import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function Dashboard() {
  const role = localStorage.getItem('userRole')
  const userName = localStorage.getItem('userName')
  const navigate = useNavigate()

  const [summary, setSummary] = useState({})
  const [recentTrips, setRecentTrips] = useState([])

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token')

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const summaryRes = await axios.get(
        'http://localhost:5000/api/dashboard/summary',
        config
      )

      const tripsRes = await axios.get(
        'http://localhost:5000/api/dashboard/recent-trips',
        config
      )

      setSummary(summaryRes.data)
      setRecentTrips(tripsRes.data)
      toast.success('Dashboard refreshed')
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load dashboard data')
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const getCards = () => {
    if (role === 'Admin') {
      return [
        ['Total Users', summary.total_users || 0, 'System users'],
        ['Active Routes', summary.active_routes || 0, 'Running routes'],
        ['Available Buses', summary.available_buses || 0, 'Ready vehicles'],
        ['Pending Drivers', summary.pending_drivers || 0, 'Approval needed']
      ]
    }

    if (role === 'Depot Manager') {
      return [
        ['Active Routes', summary.active_routes || 0, 'Today operations'],
        ['Available Buses', summary.available_buses || 0, 'Ready vehicles'],
        ['Available Drivers', summary.available_drivers || 0, 'Ready drivers'],
        ['Completed Trips', summary.completed_trips || 0, 'Finished trips']
      ]
    }

    if (role === 'Supervisor') {
      return [
        ['Active Routes', summary.active_routes || 0, 'Available routes'],
        ['Delayed Trips', summary.delayed_trips || 0, 'Need attention'],
        ['Pending Maintenance', summary.pending_maintenance || 0, 'Vehicle service'],
        ['Available Buses', summary.available_buses || 0, 'Ready vehicles']
      ]
    }

    return [
      ['My Route', 'Assigned', 'View schedule'],
      ['Trip Status', 'Scheduled', 'Current trip'],
      ['Bus', 'Assigned', 'Vehicle details'],
      ['Support', 'Available', 'Depot contact']
    ]
  }

  const statusClass = (status) => {
    if (status === 'Completed') return 'badge bg-primary'
    if (status === 'Delayed') return 'badge bg-warning'
    if (status === 'Cancelled') return 'badge bg-danger'
    if (status === 'On-time') return 'badge bg-success'
    return 'badge bg-secondary'
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>{role} Dashboard</h2>
        <p>
          Welcome {userName || 'User'}, view smart depot overview and operational summary
        </p>
      </div>

      <div className="row mt-4">
        {getCards().map((card, index) => (
          <div className="col-md-3 mb-3" key={index}>
            <div className="modern-card">
              <p>{card[0]}</p>
              <h3>{card[1]}</h3>
              <small>{card[2]}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-4">
        <div className="col-md-8 mb-3">
          <div className="panel-card">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Recent Trip Status</h5>
              <button className="btn btn-sm btn-outline-primary" onClick={fetchDashboardData}>
                Refresh
              </button>
            </div>

            <table className="table table-hover mt-3">
              <thead>
                <tr>
                  <th>Route</th>
                  <th>Bus</th>
                  <th>Driver</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentTrips.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No recent trips found
                    </td>
                  </tr>
                ) : (
                  recentTrips.map((trip) => (
                    <tr key={trip.schedule_id}>
                      <td>{trip.route_name}</td>
                      <td>{trip.registration_number}</td>
                      <td>{trip.driver_name}</td>
                      <td>
                        <span className={statusClass(trip.trip_status)}>
                          {trip.trip_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="panel-card">
            <h5>Quick Actions</h5>

            {role === 'Admin' && (
              <>
                <button className="btn btn-primary w-100 mb-2" onClick={() => navigate('/add-user')}>
                  Add User
                </button>

                <button className="btn btn-outline-success w-100 mb-2" onClick={() => navigate('/driver-approval')}>
                  Driver Approval Requests
                </button>
              </>
            )}

            {(role === 'Admin' || role === 'Depot Manager') && (
              <>
                <button className="btn btn-outline-primary w-100 mb-2" onClick={() => navigate('/routes')}>
                  Manage Routes
                </button>

                <button className="btn btn-outline-primary w-100 mb-2" onClick={() => navigate('/schedules')}>
                  Create Schedule
                </button>
              </>
            )}

            {role === 'Supervisor' && (
              <>
                <button className="btn btn-outline-primary w-100 mb-2" onClick={() => navigate('/fuel-logs')}>
                  Add Fuel Log
                </button>

                <button className="btn btn-outline-warning w-100 mb-2" onClick={() => navigate('/maintenance')}>
                  Add Maintenance
                </button>
              </>
            )}

            <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/reports')}>
              View Reports
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard