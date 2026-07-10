import logo from '../assets/logo.png'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { toast } from 'react-toastify'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  })

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData
      )

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userRole', response.data.user.role)
      localStorage.setItem('userName', response.data.user.full_name)

      toast.success(response.data.message)

      setTimeout(() => {
        navigate('/dashboard')
      }, 700)
    } catch (error) {
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

          <h2>Welcome to YathraDepotX</h2>

          <p>
            Smart Route Management and Scheduling System
            for Public Transport Depots.
          </p>
        </div>

        <div className="auth-right">
          <h3>Login</h3>

          <p className="text-muted">
            Access your depot dashboard
          </p>

          <form onSubmit={handleLogin}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="form-control mb-3"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />

            <label className="form-label">Password</label>

            <div className="input-group mb-3">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                className="form-control"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <label className="form-label">Login Role</label>
            <select
              name="role"
              value={formData.role}
              className="form-select mb-3"
              onChange={handleChange}
              required
            >
              <option value="">Select role</option>
              <option value="Admin">Admin</option>
              <option value="Depot Manager">Depot Manager</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Driver">Driver</option>
            </select>

            <button className="btn btn-primary w-100">
              Login
            </button>
          </form>

          <p className="mt-3 text-center">
            Driver? <Link to="/driver-register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login