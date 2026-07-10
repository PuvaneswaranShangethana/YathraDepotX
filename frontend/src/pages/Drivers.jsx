import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function Drivers() {
  const [drivers, setDrivers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)

  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')
  const token = localStorage.getItem('token')

  const canManageDriver = role === 'Admin' || role === 'Depot Manager'
  const canDeleteDriver = role === 'Admin'

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    license_number: '',
    license_expiry: '',
    working_hours: '',
    status: 'Available'
  })

  const resetForm = () => {
    setFormData({
      full_name: '',
      phone: '',
      license_number: '',
      license_expiry: '',
      working_hours: '',
      status: 'Available'
    })
  }

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/drivers',
        config
      )

      setDrivers(response.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load drivers')
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  const filteredDrivers = drivers.filter((driver) =>
    driver.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.license_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = (driver) => {
    if (!canManageDriver) {
      toast.error('You do not have permission to edit drivers')
      return
    }

    setEditingId(driver.driver_id)

    setFormData({
      full_name: driver.full_name || '',
      phone: driver.phone || '',
      license_number: driver.license_number || '',
      license_expiry: driver.license_expiry ? driver.license_expiry.substring(0, 10) : '',
      working_hours: driver.working_hours || '',
      status: driver.status || 'Available'
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    resetForm()
  }

  const handleAddDriver = async (e) => {
    e.preventDefault()

    if (!canManageDriver) {
      toast.error('You do not have permission to save drivers')
      return
    }

    try {
      let response

      if (editingId) {
        response = await axios.put(
          `http://localhost:5000/api/drivers/${editingId}`,
          formData,
          config
        )
      } else {
        response = await axios.post(
          'http://localhost:5000/api/drivers',
          formData,
          config
        )
      }

      toast.success(response.data.message)
      fetchDrivers()
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
    if (!canDeleteDriver) {
      toast.error('Only Admin can delete drivers')
      return
    }

    if (!window.confirm('Are you sure you want to delete this driver?')) {
      return
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/drivers/${id}`,
        config
      )

      toast.success(response.data.message)
      fetchDrivers()
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
        <h2>Driver Management</h2>
        <p>Manage driver details, licence validity, and availability</p>
      </div>

      {canManageDriver && (
        <div className="panel-card mt-4">
          <h5>{editingId ? 'Update Driver' : 'Add New Driver'}</h5>

          <form onSubmit={handleAddDriver}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Driver Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  className="form-control"
                  placeholder="Enter driver name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  className="form-control"
                  placeholder="0771234567"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Licence Number</label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  className="form-control"
                  placeholder="B123456"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Licence Expiry</label>
                <input
                  type="date"
                  name="license_expiry"
                  value={formData.license_expiry}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Working Hours</label>
                <input
                  type="text"
                  name="working_hours"
                  value={formData.working_hours}
                  className="form-control"
                  placeholder="8 Hours"
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
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary me-2">
              {editingId ? 'Update Driver' : 'Add Driver'}
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
          <h5>Drivers List</h5>
          <span className="badge bg-info">
            Total: {filteredDrivers.length}
          </span>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search driver by name, phone, licence number, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Driver Name</th>
              <th>Phone</th>
              <th>Licence No</th>
              <th>Licence Expiry</th>
              <th>Working Hours</th>
              <th>Status</th>
              {canManageDriver && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {filteredDrivers.length === 0 ? (
              <tr>
                <td
                  colSpan={canManageDriver ? '7' : '6'}
                  className="text-center"
                >
                  No drivers found
                </td>
              </tr>
            ) : (
              filteredDrivers.map((driver) => (
                <tr key={driver.driver_id}>
                  <td>{driver.full_name}</td>
                  <td>{driver.phone}</td>
                  <td>{driver.license_number}</td>
                  <td>{driver.license_expiry}</td>
                  <td>{driver.working_hours}</td>
                  <td>
                    <span className="badge bg-success">
                      {driver.status}
                    </span>
                  </td>

                  {canManageDriver && (
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(driver)}
                      >
                        Edit
                      </button>

                      {canDeleteDriver && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(driver.driver_id)}
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

export default Drivers