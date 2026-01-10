import React, { useState, useEffect } from 'react'
import CampusMap from './components/CampusMap'
import Sidebar from './components/Sidebar'
import RightPanel from './components/RightPanel'
import DashboardHeader from './components/DashboardHeader'
import './index.css'

function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar glass-panel">
        <Sidebar />
      </aside>
      <main className="main-content">
        <header className="header glass-panel">
          <DashboardHeader theme={theme} toggleTheme={toggleTheme} />
        </header>
        <section className="map-viewport glass-panel">
          <CampusMap theme={theme} />
        </section>
      </main>
      <aside className="sidebar glass-panel">
        <RightPanel />
      </aside>
    </div>
  )
}

export default App
