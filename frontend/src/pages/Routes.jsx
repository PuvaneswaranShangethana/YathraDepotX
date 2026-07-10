import Layout from '../components/Layout'
import RouteMap from '../components/RouteMap'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function Routes() {
  const [routes, setRoutes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [selectedRoute, setSelectedRoute] = useState(null)

  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')
  const token = localStorage.getItem('token')

  const canManageRoute = role === 'Admin' || role === 'Depot Manager'
  const canDeleteRoute = role === 'Admin'

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const [formData, setFormData] = useState({
    route_name: '',
    start_point: '',
    end_point: '',
    intermediate_stops: '',
    total_distance: '',
    service_type: '',
    status: 'Active'
  })

  const resetForm = () => {
    setFormData({
      route_name: '',
      start_point: '',
      end_point: '',
      intermediate_stops: '',
      total_distance: '',
      service_type: '',
      status: 'Active'
    })
  }

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/routes',
        config
      )
      setRoutes(response.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load routes')
    }
  }

  useEffect(() => {
    fetchRoutes()
  }, [])

  const filteredRoutes = routes.filter((route) =>
    route.route_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.start_point?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.end_point?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    route.service_type?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = (route) => {
    if (!canManageRoute) {
      toast.error('You do not have permission to edit routes')
      return
    }

    setEditingId(route.route_id)

    setFormData({
      route_name: route.route_name || '',
      start_point: route.start_point || '',
      end_point: route.end_point || '',
      intermediate_stops: route.intermediate_stops || '',
      total_distance: route.total_distance || '',
      service_type: route.service_type || '',
      status: route.status || 'Active'
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    resetForm()
  }

  const handleAddRoute = async (e) => {
    e.preventDefault()

    if (!canManageRoute) {
      toast.error('You do not have permission to save routes')
      return
    }

    try {
      let response

      if (editingId) {
        response = await axios.put(
          `http://localhost:5000/api/routes/${editingId}`,
          formData,
          config
        )
      } else {
        response = await axios.post(
          'http://localhost:5000/api/routes',
          formData,
          config
        )
      }

      toast.success(response.data.message)
      fetchRoutes()
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
    if (!canDeleteRoute) {
      toast.error('Only Admin can delete routes')
      return
    }

    if (!window.confirm('Are you sure you want to delete this route?')) {
      return
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/routes/${id}`,
        config
      )

      toast.success(response.data.message)
      fetchRoutes()
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

  const viewMap = (route) => {
    setSelectedRoute(route)
    toast.info(`Showing map for ${route.route_name}`)
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Route Management</h2>
        <p>Create, update, manage, and view public transport routes</p>
      </div>

      {canManageRoute && (
        <div className="panel-card mt-4">
          <h5>{editingId ? 'Update Route' : 'Add New Route'}</h5>

          <form onSubmit={handleAddRoute}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Route Name</label>
                <input
                  type="text"
                  name="route_name"
                  value={formData.route_name}
                  className="form-control"
                  placeholder="Batticaloa - Colombo"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Start Point</label>
                <input
                  type="text"
                  name="start_point"
                  value={formData.start_point}
                  className="form-control"
                  placeholder="Batticaloa"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">End Point</label>
                <input
                  type="text"
                  name="end_point"
                  value={formData.end_point}
                  className="form-control"
                  placeholder="Colombo"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Intermediate Stops</label>
                <input
                  type="text"
                  name="intermediate_stops"
                  value={formData.intermediate_stops}
                  className="form-control"
                  placeholder="Polonnaruwa, Kurunegala"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Total Distance (km)</label>
                <input
                  type="number"
                  step="0.01"
                  name="total_distance"
                  value={formData.total_distance}
                  className="form-control"
                  placeholder="320.50"
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
            </div>

            <button className="btn btn-primary me-2">
              {editingId ? 'Update Route' : 'Add Route'}
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

      {selectedRoute && (
        <div className="panel-card mt-4">
          <h5>Route Map Preview</h5>
          <p className="text-muted">
            {selectedRoute.start_point} to {selectedRoute.end_point}
          </p>

          <RouteMap
            startPoint={selectedRoute.start_point}
            endPoint={selectedRoute.end_point}
          />
        </div>
      )}

      <div className="panel-card mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Routes List</h5>
          <span className="badge bg-info">
            Total: {filteredRoutes.length}
          </span>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search route by name, start point, end point, or service type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Route Name</th>
              <th>Start Point</th>
              <th>End Point</th>
              <th>Distance</th>
              <th>Service Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRoutes.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No routes found
                </td>
              </tr>
            ) : (
              filteredRoutes.map((route) => (
                <tr key={route.route_id}>
                  <td>{route.route_name}</td>
                  <td>{route.start_point}</td>
                  <td>{route.end_point}</td>
                  <td>{route.total_distance} km</td>
                  <td>{route.service_type}</td>
                  <td>
                    <span className="badge bg-success">
                      {route.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => viewMap(route)}
                    >
                      Map
                    </button>

                    {canManageRoute && (
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(route)}
                      >
                        Edit
                      </button>
                    )}

                    {canDeleteRoute && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(route.route_id)}
                      >
                        Delete
                      </button>
                    )}
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

export default Routes