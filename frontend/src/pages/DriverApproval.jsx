import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function DriverApproval() {
  const [drivers, setDrivers] = useState([])
  const navigate = useNavigate()

  const getConfig = () => {
    const token = localStorage.getItem('token')

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/auth/pending-drivers',
        getConfig()
      )

      setDrivers(response.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load pending drivers')
    }
  }

  const approveDriver = async (id) => {
    if (!window.confirm('Approve this driver account?')) {
      return
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/approve-driver/${id}`,
        {},
        getConfig()
      )

      toast.success(response.data.message)
      fetchDrivers()
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to approve driver')
    }
  }

  const rejectDriver = async (id) => {
    if (!window.confirm('Reject this driver account?')) {
      return
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/reject-driver/${id}`,
        {},
        getConfig()
      )

      toast.success(response.data.message)
      fetchDrivers()
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to reject driver')
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  return (
    <Layout>
      <div className="page-header">
        <h2>Driver Approval Requests</h2>
        <p>Approve or reject self-registered driver accounts</p>
      </div>

      <div className="panel-card mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Pending Driver Requests</h5>

          <span className="badge bg-warning">
            Pending: {drivers.length}
          </span>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Driver Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Registered Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No pending driver requests
                </td>
              </tr>
            ) : (
              drivers.map((driver) => (
                <tr key={driver.user_id}>
                  <td>{driver.full_name}</td>
                  <td>{driver.email}</td>
                  <td>
                    <span className="badge bg-warning">
                      {driver.approval_status}
                    </span>
                  </td>
                  <td>{driver.created_at}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => approveDriver(driver.user_id)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => rejectDriver(driver.user_id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default DriverApproval