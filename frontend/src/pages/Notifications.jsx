import Layout from '../components/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { handleAuthError } from '../utils/auth'

function Notifications() {
  const navigate = useNavigate()
  const role = localStorage.getItem('userRole')

  const [notifications, setNotifications] = useState([])

  const getConfig = () => {
    const token = localStorage.getItem('token')

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/notifications',
        getConfig()
      )

      setNotifications(response.data)
    } catch (error) {
      if (handleAuthError(error, navigate)) {
        toast.error('Session expired. Please login again.')
        return
      }

      toast.error('Failed to load notifications')
    }
  }

  const markAsRead = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        getConfig()
      )

      toast.success(response.data.message)
      fetchNotifications()
    } catch (error) {
      toast.error('Failed to update notification')
    }
  }

  const deleteNotification = async (id) => {
    if (!window.confirm('Delete this notification?')) {
      return
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/notifications/${id}`,
        getConfig()
      )

      toast.success(response.data.message)
      fetchNotifications()
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  return (
    <Layout>
      <div className="page-header">
        <h2>Notifications</h2>
        <p>View profile update notifications and important system alerts</p>
      </div>

      <div className="panel-card mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Notification List</h5>

          <span className="badge bg-info">
            Total: {notifications.length}
          </span>
        </div>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No notifications found
                </td>
              </tr>
            ) : (
              notifications.map((notification) => (
                <tr key={notification.notification_id}>
                  <td>{notification.title}</td>
                  <td>{notification.message}</td>
                  <td>
                    <span
                      className={
                        notification.is_read
                          ? 'badge bg-success'
                          : 'badge bg-warning'
                      }
                    >
                      {notification.is_read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td>{notification.created_at}</td>
                  <td>
                    {!notification.is_read && (
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() =>
                          markAsRead(notification.notification_id)
                        }
                      >
                        Mark Read
                      </button>
                    )}

                    {role === 'Admin' && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          deleteNotification(notification.notification_id)
                        }
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

export default Notifications