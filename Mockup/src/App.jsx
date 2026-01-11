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
  const [mapOverlap, setMapOverlap] = useState(0)
  const [isResizing, setIsResizing] = useState(null) // 'left', 'right', 'map', or 'bottom'

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
      } else if (isResizing === 'map') {
        // Adjust how much the map overlaps the bottom panel
        const dashboardRect = document.querySelector('.main-content').getBoundingClientRect()
        const bottomPanelTop = dashboardRect.bottom - bottomPanelHeight
        const currentPos = e.clientY
        const overlap = Math.max(0, Math.min(bottomPanelHeight, bottomPanelTop - currentPos))
        // Actually, let's simplify: if we drag the map handle, we change the overlap amount
        // The overlap is basically "additional height" for the map that isn't counted in the flex flow
        const mapContainer = document.querySelector('.map-viewport').getBoundingClientRect()
        const newOverlap = Math.max(0, e.clientY - mapContainer.top - (mapContainer.height - mapOverlap))
        setMapOverlap(Math.max(0, newOverlap))
      } else if (isResizing === 'bottom') {
        const newHeight = Math.min(Math.max(50, window.innerHeight - e.clientY - 16), window.innerHeight * 0.9)
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
  }, [isResizing, bottomPanelHeight, mapOverlap])

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

        <section
          className="map-viewport glass-panel"
          style={{
            flex: 1,
            marginBottom: `-${mapOverlap}px`,
            zIndex: 10,
            position: 'relative',
            boxShadow: mapOverlap > 0 ? '0 10px 30px rgba(0,0,0,0.5)' : 'none'
          }}
        >
          <CampusMap theme={theme} />
        </section>

        <div className="horizontal-resizers">
          <div
            className={`resizer-handle horizontal map-adjuster ${isResizing === 'map' ? 'active' : ''}`}
            onMouseDown={startResizing('map')}
            title="Adjust Map Overlap (Slide Down to Crop)"
          >
            <div className="resizer-line"></div>
          </div>
          <div
            className={`resizer-handle horizontal browser-adjuster ${isResizing === 'bottom' ? 'active' : ''}`}
            onMouseDown={startResizing('bottom')}
            title="Adjust Browser Window Size"
          >
            <div className="resizer-line"></div>
          </div>
        </div>

        <section className="bottom-panel-container" style={{ height: `${bottomPanelHeight}px`, zIndex: 5 }}>
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
