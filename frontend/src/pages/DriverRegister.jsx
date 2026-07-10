import logo from '../assets/logo.png'
import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

function DriverRegister() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register-driver',
        formData
      )

      toast.success(response.data.message)

      setFormData({
        full_name: '',
        email: '',
        password: ''
      })
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
          <h2>Driver Registration</h2>
          <p>Driver accounts need admin approval before login.</p>
        </div>

        <div className="auth-right">
          <h3>Create Driver Account</h3>
          <p className="text-muted">Register as a depot driver</p>

          <form onSubmit={handleRegister}>
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
              placeholder="Enter email"
              onChange={handleChange}
              required
            />

            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              className="form-control mb-3"
              placeholder="Create password"
              onChange={handleChange}
              minLength="6"
              required
            />

            <button className="btn btn-primary w-100">
              Register
            </button>
          </form>

          <p className="mt-3">
            Already have an account? <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DriverRegister