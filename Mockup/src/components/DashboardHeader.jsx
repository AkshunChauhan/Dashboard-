import React from 'react'
import { Zap, Bell, User, Settings, Sun, Moon } from 'lucide-react'

const DashboardHeader = ({ theme, toggleTheme }) => {
    return (
        <>
            <div className="logo-section">
                <div className="logo-icon">
                    <Zap size={24} fill="currentColor" />
                </div>
                <h1 className="logo-text">EnergyFlow Campus</h1>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button onClick={toggleTheme} style={themeBtnStyle}>
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button style={btnStyle}><Bell size={20} /></button>
                <button style={btnStyle}><Settings size={20} /></button>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--surface-border)' }}>
                    <User size={20} />
                </div>
            </div>
        </>
    )
}

const themeBtnStyle = {
    background: 'var(--primary)',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    padding: '0.6rem',
    borderRadius: '0.75rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 15px var(--primary-glow)',
}

const btnStyle = {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

export default DashboardHeader
