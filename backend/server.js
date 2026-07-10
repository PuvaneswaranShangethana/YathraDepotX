const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const routeRoutes = require('./routes/routeRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes')
const driverRoutes = require('./routes/driverRoutes')
const fuelRoutes = require('./routes/fuelRoutes')
const maintenanceRoutes = require('./routes/maintenanceRoutes')
const scheduleRoutes = require('./routes/scheduleRoutes')
const reportRoutes = require('./routes/reportRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')
const profileRoutes = require('./routes/profileRoutes')
const notificationRoutes = require('./routes/notificationRoutes')


const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/routes', routeRoutes)
app.use('/api/vehicles', vehicleRoutes)
app.use('/api/drivers', driverRoutes)
app.use('/api/fuel-logs', fuelRoutes)
app.use('/api/maintenance', maintenanceRoutes)
app.use('/api/schedules', scheduleRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/notification', notificationRoutes)

app.get('/', (req, res) => {
  res.send('YathraDepotX Backend Running')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})