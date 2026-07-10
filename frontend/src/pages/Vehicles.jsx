import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)

  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')
  const token = localStorage.getItem('token')

  const canManageVehicle = role === 'Admin' || role === 'Depot Manager'
  const canDeleteVehicle = role === 'Admin'

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const [formData, setFormData] = useState({
    registration_number: '',
    vehicle_type: '',
    seating_capacity: '',
    mileage: '',
    service_type: '',
    status: 'Available'
  })

  const resetForm = () => {
    setFormData({
      registration_number: '',
      vehicle_type: '',
      seating_capacity: '',
      mileage: '',
      service_type: '',
      status: 'Available'
    })
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
    fetchVehicles()
  }, [])

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicle_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = (vehicle) => {
    if (!canManageVehicle) {
      toast.error('You do not have permission to edit vehicles')
      return
    }

    setEditingId(vehicle.vehicle_id)

    setFormData({
      registration_number: vehicle.registration_number || '',
      vehicle_type: vehicle.vehicle_type || '',
      seating_capacity: vehicle.seating_capacity || '',
      mileage: vehicle.mileage || '',
      service_type: vehicle.service_type || '',
      status: vehicle.status || 'Available'
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    resetForm()
  }

  const handleAddVehicle = async (e) => {
    e.preventDefault()

    if (!canManageVehicle) {
      toast.error('You do not have permission to save vehicles')
      return
    }

    try {
      let response

      if (editingId) {
        response = await axios.put(
          `http://localhost:5000/api/vehicles/${editingId}`,
          formData,
          config
        )
      } else {
        response = await axios.post(
          'http://localhost:5000/api/vehicles',
          formData,
          config
        )
      }

      toast.success(response.data.message)
      fetchVehicles()
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
    if (!canDeleteVehicle) {
      toast.error('Only Admin can delete vehicles')
      return
    }

    if (!window.confirm('Are you sure you want to delete this vehicle?')) {
      return
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/vehicles/${id}`,
        config
      )

      toast.success(response.data.message)
      fetchVehicles()
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
        <h2>Vehicle Management</h2>
        <p>Manage buses, seating capacity, mileage, service type, and availability</p>
      </div>

      {canManageVehicle && (
        <div className="panel-card mt-4">
          <h5>{editingId ? 'Update Vehicle' : 'Add New Vehicle'}</h5>

          <form onSubmit={handleAddVehicle}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Registration Number</label>
                <input
                  type="text"
                  name="registration_number"
                  value={formData.registration_number}
                  className="form-control"
                  placeholder="NB-4567"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Vehicle Type</label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="">Select vehicle type</option>
                  <option value="Normal Bus">Normal Bus</option>
                  <option value="Semi Luxury Bus">Semi Luxury Bus</option>
                  <option value="Luxury Bus">Luxury Bus</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Seating Capacity</label>
                <input
                  type="number"
                  name="seating_capacity"
                  value={formData.seating_capacity}
                  className="form-control"
                  placeholder="54"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Mileage</label>
                <input
                  type="number"
                  step="0.01"
                  name="mileage"
                  value={formData.mileage}
                  className="form-control"
                  placeholder="120000.50"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Service Type</label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="">Select service type</option>
                  <option value="Local">Local</option>
                  <option value="Regional">Regional</option>
                  <option value="Long Distance">Long Distance</option>
                </select>
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
                  <option value="Maintenance">Maintenance</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary me-2">
              {editingId ? 'Update Vehicle' : 'Add Vehicle'}
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
          <h5>Vehicles List</h5>
          <span className="badge bg-info">
            Total: {filteredVehicles.length}
          </span>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search vehicle by registration, type, service type, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Registration No</th>
              <th>Vehicle Type</th>
              <th>Capacity</th>
              <th>Mileage</th>
              <th>Service Type</th>
              <th>Status</th>
              {canManageVehicle && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {filteredVehicles.length === 0 ? (
              <tr>
                <td
                  colSpan={canManageVehicle ? '7' : '6'}
                  className="text-center"
                >
                  No vehicles found
                </td>
              </tr>
            ) : (
              filteredVehicles.map((vehicle) => (
                <tr key={vehicle.vehicle_id}>
                  <td>{vehicle.registration_number}</td>
                  <td>{vehicle.vehicle_type}</td>
                  <td>{vehicle.seating_capacity}</td>
                  <td>{vehicle.mileage} km</td>
                  <td>{vehicle.service_type}</td>
                  <td>
                    <span className="badge bg-info">
                      {vehicle.status}
                    </span>
                  </td>

                  {canManageVehicle && (
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(vehicle)}
                      >
                        Edit
                      </button>

                      {canDeleteVehicle && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(vehicle.vehicle_id)}
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

export default Vehicles