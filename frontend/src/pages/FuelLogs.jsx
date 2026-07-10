import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function FuelLogs() {
  const [fuelLogs, setFuelLogs] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)

  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')
  const token = localStorage.getItem('token')

  const canManageFuelLog = role === 'Admin' || role === 'Supervisor'
  const canDeleteFuelLog = role === 'Admin'

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const [formData, setFormData] = useState({
    vehicle_id: '',
    fuel_date: '',
    fuel_litres: '',
    fuel_cost: '',
    odometer_reading: '',
    notes: ''
  })

  const resetForm = () => {
    setFormData({
      vehicle_id: '',
      fuel_date: '',
      fuel_litres: '',
      fuel_cost: '',
      odometer_reading: '',
      notes: ''
    })
  }

  const fetchFuelLogs = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/fuel-logs',
        config
      )

      setFuelLogs(response.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load fuel logs')
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
    fetchFuelLogs()

    if (canManageFuelLog) {
      fetchVehicles()
    }
  }, [])

  const filteredFuelLogs = fuelLogs.filter((fuel) =>
    fuel.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fuel.fuel_date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fuel.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = (fuel) => {
    if (!canManageFuelLog) {
      toast.error('You do not have permission to edit fuel logs')
      return
    }

    setEditingId(fuel.fuel_id)

    setFormData({
      vehicle_id: fuel.vehicle_id || '',
      fuel_date: fuel.fuel_date ? fuel.fuel_date.substring(0, 10) : '',
      fuel_litres: fuel.fuel_litres || '',
      fuel_cost: fuel.fuel_cost || '',
      odometer_reading: fuel.odometer_reading || '',
      notes: fuel.notes || ''
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    resetForm()
  }

  const handleAddFuelLog = async (e) => {
    e.preventDefault()

    if (!canManageFuelLog) {
      toast.error('You do not have permission to save fuel logs')
      return
    }

    try {
      let response

      if (editingId) {
        response = await axios.put(
          `http://localhost:5000/api/fuel-logs/${editingId}`,
          formData,
          config
        )
      } else {
        response = await axios.post(
          'http://localhost:5000/api/fuel-logs',
          formData,
          config
        )
      }

      toast.success(response.data.message)
      fetchFuelLogs()
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
    if (!canDeleteFuelLog) {
      toast.error('Only Admin can delete fuel logs')
      return
    }

    if (!window.confirm('Are you sure you want to delete this fuel log?')) {
      return
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/fuel-logs/${id}`,
        config
      )

      toast.success(response.data.message)
      fetchFuelLogs()
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
        <h2>Fuel Logs</h2>
        <p>Record fuel consumption and monitor vehicle fuel usage</p>
      </div>

      {canManageFuelLog && (
        <div className="panel-card mt-4">
          <h5>{editingId ? 'Update Fuel Log' : 'Add Fuel Log'}</h5>

          <form onSubmit={handleAddFuelLog}>
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
                <label className="form-label">Fuel Date</label>
                <input
                  type="date"
                  name="fuel_date"
                  value={formData.fuel_date}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Fuel Litres</label>
                <input
                  type="number"
                  step="0.01"
                  name="fuel_litres"
                  value={formData.fuel_litres}
                  className="form-control"
                  placeholder="120.50"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Fuel Cost</label>
                <input
                  type="number"
                  step="0.01"
                  name="fuel_cost"
                  value={formData.fuel_cost}
                  className="form-control"
                  placeholder="65000"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Odometer Reading</label>
                <input
                  type="number"
                  step="0.01"
                  name="odometer_reading"
                  value={formData.odometer_reading}
                  className="form-control"
                  placeholder="120120.50"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Notes</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  className="form-control"
                  placeholder="Long distance route"
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="btn btn-primary me-2">
              {editingId ? 'Update Fuel Log' : 'Add Fuel Log'}
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
          <h5>Fuel Records</h5>
          <span className="badge bg-info">
            Total: {filteredFuelLogs.length}
          </span>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search fuel log by vehicle, date, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Fuel Litres</th>
              <th>Fuel Cost</th>
              <th>Odometer</th>
              <th>Notes</th>
              {canManageFuelLog && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {filteredFuelLogs.length === 0 ? (
              <tr>
                <td
                  colSpan={canManageFuelLog ? '7' : '6'}
                  className="text-center"
                >
                  No fuel logs found
                </td>
              </tr>
            ) : (
              filteredFuelLogs.map((fuel) => (
                <tr key={fuel.fuel_id}>
                  <td>{fuel.registration_number}</td>
                  <td>{fuel.fuel_date}</td>
                  <td>{fuel.fuel_litres} L</td>
                  <td>Rs. {fuel.fuel_cost}</td>
                  <td>{fuel.odometer_reading} km</td>
                  <td>{fuel.notes}</td>

                  {canManageFuelLog && (
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(fuel)}
                      >
                        Edit
                      </button>

                      {canDeleteFuelLog && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(fuel.fuel_id)}
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

export default FuelLogs