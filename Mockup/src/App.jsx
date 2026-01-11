import React, { useState, useEffect } from 'react'
import CampusMap from './components/CampusMap'
import Sidebar from './components/Sidebar'
import RightPanel from './components/RightPanel'
import DashboardHeader from './components/DashboardHeader'
import './index.css'

function App() {
  const [theme, setTheme] = useState('dark')
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const [rightPanelWidth, setRightPanelWidth] = useState(340)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(300)
  const [isResizing, setIsResizing] = useState(null) // 'left', 'right', or 'bottom'

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return

      if (isResizing === 'left') {
        const newWidth = Math.min(Math.max(200, e.clientX - 16), 600)
        setSidebarWidth(newWidth)
      } else if (isResizing === 'right') {
        const newWidth = Math.min(Math.max(250, window.innerWidth - e.clientX - 16), 600)
        setRightPanelWidth(newWidth)
      } else if (isResizing === 'bottom') {
        const newHeight = Math.min(Math.max(100, window.innerHeight - e.clientY - 16), window.innerHeight * 0.8)
        setBottomPanelHeight(newHeight)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(null)
      document.body.classList.remove('resizing-active')
    }

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      document.body.classList.add('resizing-active')
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const startResizing = (direction) => (e) => {
    e.preventDefault()
    setIsResizing(direction)
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar glass-panel" style={{ width: `${sidebarWidth}px`, flexBasis: `${sidebarWidth}px` }}>
        <Sidebar />
      </aside>

      <div className={`resizer-handle ${isResizing === 'left' ? 'active' : ''}`} onMouseDown={startResizing('left')}>
        <div className="resizer-line"></div>
      </div>

      <main className="main-content">
        <header className="header glass-panel">
          <DashboardHeader theme={theme} toggleTheme={toggleTheme} />
        </header>

        <section className="map-viewport glass-panel" style={{ flex: 1 }}>
          <CampusMap theme={theme} />
        </section>

        <div className={`resizer-handle horizontal ${isResizing === 'bottom' ? 'active' : ''}`} onMouseDown={startResizing('bottom')}>
          <div className="resizer-line"></div>
        </div>

        <section className="bottom-panel-container" style={{ height: `${bottomPanelHeight}px` }}>
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden', borderRadius: '1.5rem' }}>
            <iframe
              src="https://egauge75146.d.egauge.net/ng/"
              className="bottom-panel-content"
              title="Real-time External Graph"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      </main>

      <div className={`resizer-handle ${isResizing === 'right' ? 'active' : ''}`} onMouseDown={startResizing('right')}>
        <div className="resizer-line"></div>
      </div>

      <aside className="sidebar glass-panel" style={{ width: `${rightPanelWidth}px`, flexBasis: `${rightPanelWidth}px` }}>
        <RightPanel />
      </aside>
    </div>
  )
}

export default App
