import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import AddUser from './pages/AddUser'
import Dashboard from './pages/Dashboard'
import DriverRegister from './pages/DriverRegister'
import DriverApproval from './pages/DriverApproval'
import RoutesPage from './pages/Routes'
import Schedules from './pages/Schedules'
import Drivers from './pages/Drivers'
import Vehicles from './pages/Vehicles'
import FuelLogs from './pages/FuelLogs'
import Maintenance from './pages/Maintenance'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={2500} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/driver-register" element={<DriverRegister />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Depot Manager', 'Supervisor', 'Driver']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Depot Manager', 'Supervisor']}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-user"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AddUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver-approval"
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <DriverApproval />
            </ProtectedRoute>
          }
        />

        <Route
          path="/routes"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Depot Manager', 'Supervisor', 'Driver']}>
              <RoutesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/schedules"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Depot Manager', 'Supervisor', 'Driver']}>
              <Schedules />
            </ProtectedRoute>
          }
        />

        <Route
          path="/drivers"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Depot Manager']}>
              <Drivers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vehicles"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Depot Manager']}>
              <Vehicles />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fuel-logs"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Supervisor']}>
              <FuelLogs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/maintenance"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Supervisor']}>
              <Maintenance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Depot Manager', 'Supervisor', 'Driver']}>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App