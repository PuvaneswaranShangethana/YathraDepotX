import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem('userRole')
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const confirmLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const menus = {
    Admin: [
      ['Dashboard', '/dashboard'],
      ['My Profile', '/profile'],
      ['Notifications', '/notifications'],
      ['Add User', '/add-user'],
      ['Driver Approval', '/driver-approval'],
      ['Routes', '/routes'],
      ['Schedules', '/schedules'],
      ['Drivers', '/drivers'],
      ['Vehicles', '/vehicles'],
      ['Fuel Logs', '/fuel-logs'],
      ['Maintenance', '/maintenance'],
      ['Reports', '/reports']
    ],

    'Depot Manager': [
      ['Dashboard', '/dashboard'],
      ['My Profile', '/profile'],
      ['Notifications', '/notifications'],
      ['Routes', '/routes'],
      ['Schedules', '/schedules'],
      ['Drivers', '/drivers'],
      ['Vehicles', '/vehicles'],
      ['Reports', '/reports']
    ],

    Supervisor: [
      ['Dashboard', '/dashboard'],
      ['My Profile', '/profile'],
      ['Notifications', '/notifications'],
      ['Schedules', '/schedules'],
      ['Fuel Logs', '/fuel-logs'],
      ['Maintenance', '/maintenance'],
      ['Reports', '/reports']
    ],

    Driver: [
      ['Dashboard', '/dashboard'],
      ['My Profile', '/profile'],
      ['My Schedule', '/schedules'],
      ['Reports', '/reports']
    ]
  }

  return (
    <>
      <div className="sidebar">
        <h4>YathraDepotX</h4>
        <p className="role-badge">{role}</p>

        <ul>
          {menus[role]?.map((item, index) => (
            <li
              key={index}
              onClick={() => navigate(item[1])}
              className={location.pathname === item[1] ? 'active-menu' : ''}
            >
              {item[0]}
            </li>
          ))}

          <li
            onClick={() => setShowLogoutModal(true)}
            className="logout-link"
          >
            Logout
          </li>
        </ul>
      </div>

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h5>Confirm Logout</h5>
            <p>Are you sure you want to logout from YathraDepotX?</p>

            <div className="logout-modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-danger"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar