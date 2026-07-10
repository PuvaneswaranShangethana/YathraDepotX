import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function Schedules() {
  const [schedules, setSchedules] = useState([])
  const [routes, setRoutes] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState(null)

  const [filterType, setFilterType] = useState('all')
  const [month, setMonth] = useState('')
  const [weekStart, setWeekStart] = useState('')
  const [weekEnd, setWeekEnd] = useState('')

  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')
  const token = localStorage.getItem('token')

  const canManageSchedule =
    role === 'Admin' ||
    role === 'Depot Manager' ||
    role === 'Supervisor'

  const canDeleteSchedule =
    role === 'Admin' ||
    role === 'Depot Manager'

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  const [formData, setFormData] = useState({
    route_id: '',
    vehicle_id: '',
    driver_id: '',
    schedule_date: '',
    departure_time: '',
    arrival_time: '',
    trip_status: 'Scheduled'
  })

  const resetForm = () => {
    setFormData({
      route_id: '',
      vehicle_id: '',
      driver_id: '',
      schedule_date: '',
      departure_time: '',
      arrival_time: '',
      trip_status: 'Scheduled'
    })
  }

  const buildScheduleUrl = () => {
    let url = 'http://localhost:5000/api/schedules'

    if (filterType === 'month' && month) {
      url += `?view=month&month=${month}`
    }

    if (filterType === 'week' && weekStart && weekEnd) {
      url += `?view=week&weekStart=${weekStart}&weekEnd=${weekEnd}`
    }

    return url
  }

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(buildScheduleUrl(), config)
      setSchedules(response.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
      }
    }
  }

  const fetchDropdownData = async () => {
    try {
      const routesRes = await axios.get('http://localhost:5000/api/routes', config)
      const vehiclesRes = await axios.get('http://localhost:5000/api/vehicles', config)
      const driversRes = await axios.get('http://localhost:5000/api/drivers', config)

      setRoutes(routesRes.data)
      setVehicles(vehiclesRes.data)
      setDrivers(driversRes.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
      }
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [filterType, month, weekStart, weekEnd])

  useEffect(() => {
    if (canManageSchedule) {
      fetchDropdownData()
    }
  }, [])

  const filteredSchedules = schedules.filter((schedule) =>
    schedule.route_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.driver_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.schedule_date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    schedule.trip_status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = (schedule) => {
    if (!canManageSchedule) {
      toast.error('You do not have permission to edit schedules')
      return
    }

    setEditingId(schedule.schedule_id)

    setFormData({
      route_id: schedule.route_id || '',
      vehicle_id: schedule.vehicle_id || '',
      driver_id: schedule.driver_id || '',
      schedule_date: schedule.schedule_date
        ? schedule.schedule_date.substring(0, 10)
        : '',
      departure_time: schedule.departure_time || '',
      arrival_time: schedule.arrival_time || '',
      trip_status: schedule.trip_status || 'Scheduled'
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    resetForm()
  }

  const handleAddSchedule = async (e) => {
    e.preventDefault()

    if (!canManageSchedule) {
      toast.error('You do not have permission to save schedules')
      return
    }

    try {
      let response

      if (editingId) {
        response = await axios.put(
          `http://localhost:5000/api/schedules/${editingId}`,
          formData,
          config
        )
      } else {
        response = await axios.post(
          'http://localhost:5000/api/schedules',
          formData,
          config
        )
      }

      toast.success(response.data.message)
      fetchSchedules()
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
    if (!canDeleteSchedule) {
      toast.error('You do not have permission to delete schedules')
      return
    }

    if (!window.confirm('Are you sure you want to delete this schedule?')) {
      return
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/schedules/${id}`,
        config
      )

      toast.success(response.data.message)
      fetchSchedules()
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
        <h2>{role === 'Driver' ? 'My Schedule' : 'Schedule Management'}</h2>
        <p>
          {role === 'Driver'
            ? 'View assigned route schedules and trip status'
            : 'Create schedules and prevent bus or driver conflicts'}
        </p>
      </div>

      {canManageSchedule && (
        <div className="panel-card mt-4">
          <h5>
            {editingId ? 'Update Schedule' : 'Create New Schedule'}
          </h5>

          <form onSubmit={handleAddSchedule}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Route</label>
                <select
                  name="route_id"
                  value={formData.route_id}
                  className="form-select"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select route</option>
                  {routes.map((route) => (
                    <option key={route.route_id} value={route.route_id}>
                      {route.route_name}
                    </option>
                  ))}
                </select>
              </div>

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
                      {vehicle.registration_number} - {vehicle.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Driver</label>
                <select
                  name="driver_id"
                  value={formData.driver_id}
                  className="form-select"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.driver_id} value={driver.driver_id}>
                      {driver.full_name} - {driver.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Schedule Date</label>
                <input
                  type="date"
                  name="schedule_date"
                  value={formData.schedule_date}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Departure Time</label>
                <input
                  type="time"
                  name="departure_time"
                  value={formData.departure_time}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Arrival Time</label>
                <input
                  type="time"
                  name="arrival_time"
                  value={formData.arrival_time}
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3 mb-3">
                <label className="form-label">Trip Status</label>
                <select
                  name="trip_status"
                  value={formData.trip_status}
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="On-time">On-time</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary me-2">
              {editingId ? 'Update Schedule' : 'Create Schedule'}
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
          <h5>{role === 'Driver' ? 'Assigned Schedules' : 'Schedules List'}</h5>
          <span className="badge bg-info">
            Total: {filteredSchedules.length}
          </span>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 mb-2">
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All schedules</option>
              <option value="month">Monthly timetable</option>
              <option value="week">Weekly timetable</option>
            </select>
          </div>

          {filterType === 'month' && (
            <div className="col-md-3 mb-2">
              <input
                type="month"
                className="form-control"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
          )}

          {filterType === 'week' && (
            <>
              <div className="col-md-3 mb-2">
                <input
                  type="date"
                  className="form-control"
                  value={weekStart}
                  onChange={(e) => setWeekStart(e.target.value)}
                />
              </div>

              <div className="col-md-3 mb-2">
                <input
                  type="date"
                  className="form-control"
                  value={weekEnd}
                  onChange={(e) => setWeekEnd(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search schedule by route, vehicle, driver, date, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Route</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Date</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Status</th>
              {canManageSchedule && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {filteredSchedules.length === 0 ? (
              <tr>
                <td
                  colSpan={canManageSchedule ? '8' : '7'}
                  className="text-center"
                >
                  No schedules found
                </td>
              </tr>
            ) : (
              filteredSchedules.map((schedule) => (
                <tr key={schedule.schedule_id}>
                  <td>{schedule.route_name}</td>
                  <td>{schedule.registration_number}</td>
                  <td>{schedule.driver_name}</td>
                  <td>{schedule.schedule_date}</td>
                  <td>{schedule.departure_time}</td>
                  <td>{schedule.arrival_time}</td>
                  <td>
                    <span className={statusClass(schedule.trip_status)}>
                      {schedule.trip_status}
                    </span>
                  </td>

                  {canManageSchedule && (
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(schedule)}
                      >
                        Edit
                      </button>

                      {canDeleteSchedule && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(schedule.schedule_id)}
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

export default Schedules