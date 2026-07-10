import logo from '../assets/logo.png'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function AddUser() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: ''
  })

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: ''
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddUser = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password and confirm password do not match')
      return
    }

    const token = localStorage.getItem('token')

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/add-user',
        {
          full_name: formData.full_name,
          email: formData.email,
          role: formData.role,
          password: formData.password
        },
        config
      )

      toast.success(response.data.message)
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

  return (
    <div className="auth-page">
      <div className="auth-card shadow-lg">
        <div className="auth-left">
          <img src={logo} alt="YathraDepotX Logo" className="auth-logo" />

          <h2>Add New User</h2>

          <p>
            Only the system administrator can create depot staff accounts.
            This protects depot data and prevents unauthorised access.
          </p>
        </div>

        <div className="auth-right">
          <h3>Create Staff Account</h3>

          <p className="text-muted">
            Add Depot Manager or Supervisor/Clerk. Drivers can also self-register and wait for admin approval.
          </p>

          <form onSubmit={handleAddUser}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              className="form-control mb-3"
              placeholder="Enter full name"
              onChange={handleChange}
              required
            />

            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="form-control mb-3"
              placeholder="Enter email address"
              onChange={handleChange}
              required
            />

            <label className="form-label">User Role</label>
            <select
              name="role"
              value={formData.role}
              className="form-select mb-3"
              onChange={handleChange}
              required
            >
              <option value="">Select role</option>
              <option value="Depot Manager">Depot Manager</option>
              <option value="Supervisor">Supervisor / Clerk</option>
              <option value="Driver">Driver</option>
            </select>

            <label className="form-label">Temporary Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              className="form-control mb-3"
              placeholder="Create temporary password"
              onChange={handleChange}
              minLength="8"
              required
            />

            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              className="form-control mb-3"
              placeholder="Confirm temporary password"
              onChange={handleChange}
              minLength="8"
              required
            />

            <small className="text-muted d-block mb-3">
              Password must contain uppercase, lowercase, number and special character.
            </small>

            <button type="submit" className="btn btn-primary w-100">
              Create User
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddUser