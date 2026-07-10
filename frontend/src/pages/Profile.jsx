import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function Profile() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({})
  const [formData, setFormData] = useState({
    full_name: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const getConfig = () => {
    const token = localStorage.getItem('token')

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/profile',
        getConfig()
      )

      setProfile(response.data)
      setFormData({
        full_name: response.data.full_name || ''
      })
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load profile')
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleProfileChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const updateProfile = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.put(
        'http://localhost:5000/api/profile',
        formData,
        getConfig()
      )

      toast.success(response.data.message)
      localStorage.setItem('userName', formData.full_name)
      fetchProfile()
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Profile update failed')
      }
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirm password do not match')
      return
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/api/profile/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        getConfig()
      )

      toast.success(response.data.message)

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Password update failed')
      }
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>My Profile</h2>
        <p>View and update account information</p>
      </div>

      <div className="row mt-4">
        <div className="col-md-5 mb-3">
          <div className="panel-card">
            <h5>Account Details</h5>

            <p><strong>Name:</strong> {profile.full_name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Status:</strong> {profile.status}</p>
            <p><strong>Approval:</strong> {profile.approval_status}</p>
          </div>
        </div>

        <div className="col-md-7 mb-3">
          <div className="panel-card">
            <h5>Edit Profile</h5>

            <form onSubmit={updateProfile}>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                className="form-control mb-3"
                onChange={handleProfileChange}
                required
              />

              <button className="btn btn-primary">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="panel-card mt-4">
        <h5>Change Password</h5>

        <form onSubmit={changePassword}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                className="form-control"
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                className="form-control"
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="col-md-4 mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                className="form-control"
                onChange={handlePasswordChange}
                required
              />
            </div>
          </div>

          <button className="btn btn-warning">
            Change Password
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default Profile