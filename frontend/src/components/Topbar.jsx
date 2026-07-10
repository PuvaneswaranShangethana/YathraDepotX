import { useEffect, useState } from 'react'

function Topbar() {
  const userName = localStorage.getItem('userName') || 'User'
  const role = localStorage.getItem('userRole') || 'User'
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const today = time.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const currentTime = time.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })

  return (
    <div className="topbar">
      <div>
        <h5>Welcome, {userName}</h5>
        <p>{role} Panel</p>
      </div>

      <div className="topbar-right">
        <span className="topbar-date">{today}</span>
        <span className="topbar-date">{currentTime}</span>

        <span className="topbar-status">
          <span className="status-dot"></span>
          System Online
        </span>
      </div>
    </div>
  )
}

export default Topbar