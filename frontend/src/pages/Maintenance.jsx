import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function Maintenance() {
  const [maintenanceLogs, setMaintenanceLogs] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)

  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')
  const token = localStorage.getItem('token')

  const canManageMaintenance = role === 'Admin' || role === 'Supervisor'
  const canDeleteMaintenance = role === 'Admin'

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const [formData, setFormData] = useState({
    vehicle_id: '',
    maintenance_type: '',
    maintenance_date: '',
    description: '',
    cost: '',
    next_service_date: '',
    status: 'Pending'
  })

  const resetForm = () => {
    setFormData({
      vehicle_id: '',
      maintenance_type: '',
      maintenance_date: '',
      description: '',
      cost: '',
      next_service_date: '',
      status: 'Pending'
    })
  }

  const fetchMaintenanceLogs = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/maintenance',
        config
      )

      setMaintenanceLogs(response.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load maintenance logs')
    }
  }

  const fetchVehicles = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/vehicles',
        config
      )

      setVehicles(response.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load vehicles')
    }
  }

  useEffect(() => {
    fetchMaintenanceLogs()

    if (canManageMaintenance) {
      fetchVehicles()
    }
  }, [])

  const filteredMaintenanceLogs = maintenanceLogs.filter((log) =>
    log.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.maintenance_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.maintenance_date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = (log) => {
    if (!canManageMaintenance) {
      toast.error('You do not have permission to edit maintenance logs')
      return
    }

    setEditingId(log.maintenance_id)

    setFormData({
      vehicle_id: log.vehicle_id || '',
      maintenance_type: log.maintenance_type || '',
      maintenance_date: log.maintenance_date ? log.maintenance_date.substring(0, 10) : '',
      description: log.description || '',
      cost: log.cost || '',
      next_service_date: log.next_service_date ? log.next_service_date.substring(0, 10) : '',
      status: log.status || 'Pending'
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    resetForm()
  }

  const handleAddMaintenance = async (e) => {
    e.preventDefault()

    if (!canManageMaintenance) {
      toast.error('You do not have permission to save maintenance logs')
      return
    }

    try {
      let response

      if (editingId) {
        response = await axios.put(
          `http://localhost:5000/api/maintenance/${editingId}`,
          formData,
          config
        )
      } else {
        response = await axios.post(
          'http://localhost:5000/api/maintenance',
          formData,
          config
        )
      }

      toast.success(response.data.message)
      fetchMaintenanceLogs()
      setEditingId(null)
      resetForm()
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Server connection failed')
      }
    }
  }

  const handleDelete = async (id) => {
    if (!canDeleteMaintenance) {
      toast.error('Only Admin can delete maintenance logs')
      return
    }

    if (!window.confirm('Are you sure you want to delete this maintenance log?')) {
      return
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/maintenance/${id}`,
        config
      )

      toast.success(response.data.message)
      fetchMaintenanceLogs()
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Delete failed')
      }
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Maintenance Logs</h2>
        <p>Track routine and corrective maintenance activities</p>
      </div>

      {canManageMaintenance && (
        <div className="panel-card mt-4">
          <h5>{editingId ? 'Update Maintenance Log' : 'Add Maintenance Log'}</h5>

          <form onSubmit={handleAddMaintenance}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Vehicle</label>
                <select
                  name="vehicle_id"
                  value={formData.vehicle_id}
                  className="form-select"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                      {vehicle.registration_number}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Maintenance Type</label>
                <select
                  name="maintenance_type"
                  value={formData.maintenance_type}
                  className="form-select"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="Routine">Routine</option>
                  <option value="Corrective">Corrective</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Maintenance Date</label>
                <input
                  type="date"
                  name="maintenance_date"
                  value={formData.maintenance_date}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  className="form-control"
                  placeholder="Engine oil replacement"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Cost</label>
                <input
                  type="number"
                  step="0.01"
                  name="cost"
                  value={formData.cost}
                  className="form-control"
                  placeholder="25000"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Next Service Date</label>
                <input
                  type="date"
                  name="next_service_date"
                  value={formData.next_service_date}
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary me-2">
              {editingId ? 'Update Maintenance' : 'Add Maintenance'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      <div className="panel-card mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Maintenance Records</h5>
          <span className="badge bg-info">
            Total: {filteredMaintenanceLogs.length}
          </span>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search maintenance by vehicle, type, date, description, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Type</th>
              <th>Date</th>
              <th>Description</th>
              <th>Cost</th>
              <th>Next Service</th>
              <th>Status</th>
              {canManageMaintenance && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {filteredMaintenanceLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={canManageMaintenance ? '8' : '7'}
                  className="text-center"
                >
                  No maintenance logs found
                </td>
              </tr>
            ) : (
              filteredMaintenanceLogs.map((log) => (
                <tr key={log.maintenance_id}>
                  <td>{log.registration_number}</td>
                  <td>{log.maintenance_type}</td>
                  <td>{log.maintenance_date}</td>
                  <td>{log.description}</td>
                  <td>Rs. {log.cost}</td>
                  <td>{log.next_service_date}</td>
                  <td>
                    <span className={log.status === 'Completed' ? 'badge bg-success' : 'badge bg-warning'}>
                      {log.status}
                    </span>
                  </td>

                  {canManageMaintenance && (
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(log)}
                      >
                        Edit
                      </button>

                      {canDeleteMaintenance && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(log.maintenance_id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}

export default Maintenance