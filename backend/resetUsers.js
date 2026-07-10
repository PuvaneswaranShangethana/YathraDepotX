const bcrypt = require('bcryptjs')
require('dotenv').config()
const db = require('./db')

async function resetUsers() {
  const users = [
    ['System Admin', 'admin@yathradepotx.com', 'Admin@123', 'Admin'],
    ['Depot Manager', 'manager@yathradepotx.com', 'Manager@123', 'Depot Manager'],
    ['Supervisor One', 'supervisor@yathradepotx.com', 'Supervisor@123', 'Supervisor'],
    ['Driver One', 'driver@yathradepotx.com', 'Driver@123', 'Driver']
  ]

  for (const [fullName, email, password, role] of users) {
    const hashedPassword = await bcrypt.hash(password, 10)

    db.query(
      `
      INSERT INTO users 
      (full_name, email, password, role, status, approval_status)
      VALUES (?, ?, ?, ?, 'Active', 'Approved')
      ON DUPLICATE KEY UPDATE
      full_name = VALUES(full_name),
      password = VALUES(password),
      role = VALUES(role),
      status = 'Active',
      approval_status = 'Approved'
      `,
      [fullName, email, hashedPassword, role],
      (err) => {
        if (err) console.log(err)
        else console.log(email + ' reset successfully')
      }
    )
  }

  setTimeout(() => process.exit(), 2000)
}

resetUsers()