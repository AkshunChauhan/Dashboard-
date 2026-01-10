import React from 'react'
import WeatherWidget from './WeatherWidget'
import { TrendingUp, Sun, BatteryCharging, Wind } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
    { name: '08:00', value: 400 },
    { name: '10:00', value: 3000 },
    { name: '12:00', value: 2000 },
    { name: '14:00', value: 2780 },
    { name: '16:00', value: 1890 },
    { name: '18:00', value: 2390 },
]

const Sidebar = () => {
    return (
        <>
            <div style={{ marginBottom: '1rem' }}>
                <h2>System Overview</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Real-time campus energy metrics</p>
            </div>

            <WeatherWidget />

            <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="stat-label">Solar Production</span>
                    <Sun size={20} color="var(--accent)" />
                </div>
                <div className="stat-value">1,248.5 kW</div>
                <div className="stat-trend trend-up">
                    <TrendingUp size={14} /> +12.5% from yesterday
                </div>
            </div>

            <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="stat-label">Grid Consumption</span>
                    <BatteryCharging size={20} color="var(--primary)" />
                </div>
                <div className="stat-value">842.2 kW</div>
                <div className="stat-trend trend-down" style={{ color: 'var(--secondary)' }}>
                    <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} /> -5.2% from peak
                </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Daily Generation</h3>
                <div style={{ height: '180px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <Tooltip
                                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '0.5rem' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="var(--primary)" fillOpacity={1} fill="url(#colorVal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="stat-card" style={{ background: 'var(--glass)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Wind size={20} color="#94a3b8" />
                    <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Environmental Impact</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>24.4 Tons CO2 saved</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar
