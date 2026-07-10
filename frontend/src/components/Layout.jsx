import Sidebar from './Sidebar'
import Topbar from './Topbar'
import BottomBar from './BottomBar'

function Layout({ children }) {
  return (
    <div className="dashboard-page">
      <Sidebar />

      <div className="content-area">
        <Topbar />
        {children}
        <BottomBar />
      </div>
    </div>
  )
}

export default Layout