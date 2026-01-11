import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area, LineChart, Line } from 'recharts'
import { Activity, Zap, ShieldCheck, Battery, ArrowDownUp, Plus, X, BarChart3, TrendingDown } from 'lucide-react'

// Constants & Data
const COLORS = {
    solar: 'var(--accent)',
    grid: 'var(--primary)',
    bess: 'var(--secondary)',
    load: '#f87171',
}

const energyDistribution = [
    { name: 'Solar', value: 45, color: COLORS.solar },
    { name: 'Grid', value: 35, color: COLORS.grid },
    { name: 'BESS', value: 20, color: COLORS.bess },
]

const weeklyData = [
    { day: 'Mon', usage: 2400 },
    { day: 'Tue', usage: 1398 },
    { day: 'Wed', usage: 9800 },
    { day: 'Thu', usage: 3908 },
    { day: 'Fri', usage: 4800 },
    { day: 'Sat', usage: 3800 },
    { day: 'Sun', usage: 4300 },
]

const solarProjects = [
    { name: 'CACAC', size: '81.32 kW', status: 'In Service' },
    { name: 'Gary W. Harris Center', size: '150 kW', status: 'In Service' },
    { name: 'RDP Residence Building', size: '124 kW', status: 'In Service' },
    { name: 'AEL Lab', size: '60 kW', status: 'In Service' },
    { name: 'RDP Carpentry Roof', size: '92 kW', status: 'In Service' },
    { name: 'Solar Walkway', size: '85 kW', status: 'In Service' },
]

const batteryFlowData = [
    { time: '00:00', charge: 400, discharge: 240 },
    { time: '04:00', charge: 300, discharge: 139 },
    { time: '08:00', charge: 200, discharge: 980 },
    { time: '12:00', charge: 278, discharge: 390 },
    { time: '16:00', charge: 189, discharge: 480 },
    { time: '20:00', charge: 239, discharge: 380 },
    { time: '23:59', charge: 349, discharge: 430 },
]

const loadData = [
    { time: '8am', solar: 20, load: 45 },
    { time: '10am', solar: 45, load: 50 },
    { time: '12pm', solar: 85, load: 55 },
    { time: '2pm', solar: 75, load: 60 },
    { time: '4pm', solar: 40, load: 65 },
    { time: '6pm', solar: 15, load: 55 },
]

// Widget Wrapper Component
const WidgetWrapper = ({ title, icon: Icon, onRemove, children }) => (
    <div className="widget-container glass-panel" style={{ padding: '1.25rem', position: 'relative', border: 'none', background: 'var(--glass-fill)', flexShrink: 0, minHeight: 'fit-content' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.1rem' }}>
                <Icon size={18} color="var(--primary)" />
                {title}
            </h2>
            <button
                onClick={onRemove}
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
                <X size={14} />
            </button>
        </div>
        {children}
    </div>
)

const RightPanel = () => {
    const [activeWidgets, setActiveWidgets] = useState(['energy-mix', 'solar-systems', 'weekly-consumption', 'system-health'])
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const availableWidgets = [
        { id: 'energy-mix', title: 'Energy Mix', icon: Activity },
        { id: 'solar-systems', title: 'Solar Systems', icon: Zap },
        { id: 'weekly-consumption', title: 'Weekly Consumption', icon: BarChart3 },
        { id: 'battery-flow', title: 'Battery Flow', icon: Battery },
        { id: 'demand-comparison', title: 'Solar vs. Load', icon: ArrowDownUp },
        { id: 'peak-shaving', title: 'Peak Shaving', icon: TrendingDown },
        { id: 'system-health', title: 'System Health', icon: ShieldCheck },
    ]

    const removeWidget = (id) => setActiveWidgets(prev => prev.filter(w => w !== id))
    const addWidget = (id) => {
        if (!activeWidgets.includes(id)) {
            setActiveWidgets(prev => [...prev, id])
        }
        setIsMenuOpen(false)
    }

    const renderWidget = (id) => {
        switch (id) {
            case 'energy-mix':
                return (
                    <WidgetWrapper key={id} title="Energy Mix" icon={Activity} onRemove={() => removeWidget(id)}>
                        <div style={{ height: '200px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={energyDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {energyDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '0.5rem' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                            {energyDistribution.map(item => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </WidgetWrapper>
                )
            case 'solar-systems':
                return (
                    <WidgetWrapper key={id} title="Solar Systems" icon={Zap} onRemove={() => removeWidget(id)}>
                        <table className="status-table" style={{ marginTop: 0 }}>
                            <thead>
                                <tr>
                                    <th>Project</th>
                                    <th>Size</th>
                                    <th style={{ textAlign: 'right' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {solarProjects.map((project, idx) => (
                                    <tr key={idx}>
                                        <td style={{ fontWeight: 500, fontSize: '0.75rem' }}>{project.name}</td>
                                        <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{project.size}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <span className="status-badge status-active" style={{ fontSize: '0.65rem' }}>{project.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </WidgetWrapper>
                )
            case 'weekly-consumption':
                return (
                    <WidgetWrapper key={id} title="Weekly Consumption" icon={BarChart3} onRemove={() => removeWidget(id)}>
                        <div style={{ height: '140px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <XAxis dataKey="day" hide />
                                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '0.5rem' }} />
                                    <Bar dataKey="usage" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </WidgetWrapper>
                )
            case 'battery-flow':
                return (
                    <WidgetWrapper key={id} title="Battery Flow" icon={Battery} onRemove={() => removeWidget(id)}>
                        <div style={{ height: '140px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={batteryFlowData}>
                                    <defs>
                                        <linearGradient id="colorCharge" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '0.5rem' }} />
                                    <Area type="monotone" dataKey="charge" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorCharge)" />
                                    <Area type="monotone" dataKey="discharge" stroke="#f87171" fillOpacity={0} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </WidgetWrapper>
                )
            case 'demand-comparison':
                return (
                    <WidgetWrapper key={id} title="Solar vs. Load" icon={ArrowDownUp} onRemove={() => removeWidget(id)}>
                        <div style={{ height: '140px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={loadData}>
                                    <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '0.5rem' }} />
                                    <Line type="monotone" dataKey="solar" stroke="var(--accent)" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="load" stroke="#f87171" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.65rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: '8px', height: '2px', background: 'var(--accent)' }}></div>
                                <span>Solar</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: '8px', height: '2px', background: '#f87171', borderBottom: '1px dashed' }}></div>
                                <span>Load</span>
                            </div>
                        </div>
                    </WidgetWrapper>
                )
            case 'peak-shaving':
                return (
                    <WidgetWrapper key={id} title="Peak Shaving" icon={TrendingDown} onRemove={() => removeWidget(id)}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div className="stat-card" style={{ padding: '0.75rem', border: '1px solid rgba(16, 185, 129, 0.2)', background: 'rgba(16, 185, 129, 0.05)' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TODAY'S REDUCTION</span>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)' }}>24.2 kW</div>
                            </div>
                            <div className="stat-card" style={{ padding: '0.75rem', border: '1px solid rgba(59, 130, 246, 0.2)', background: 'rgba(59, 130, 246, 0.05)' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>EST. SAVINGS (MONTH)</span>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>$1,240.00</div>
                            </div>
                        </div>
                    </WidgetWrapper>
                )
            case 'system-health':
                return (
                    <div key={id} className="stat-card" style={{ border: '1px border-top solid var(--primary-glow)', background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 100%)', position: 'relative', flexShrink: 0 }}>
                        <button
                            onClick={() => removeWidget(id)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
                        >
                            <X size={14} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <ShieldCheck size={20} color="var(--secondary)" />
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>System Health</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>98.4%</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>All systems nominal</div>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '0.75rem' }}>
                            <div style={{ width: '98.4%', height: '100%', background: 'var(--secondary)', borderRadius: '2px' }}></div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="right-panel-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', overflowY: 'auto', paddingRight: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h2 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, margin: 0 }}>PANEL SETTINGS</h2>
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                        <Plus size={12} /> ADD WIDGET
                    </button>
                    {isMenuOpen && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, background: '#1e293b', border: '1px solid var(--surface-border)', borderRadius: '0.5rem', padding: '0.5rem', width: '160px', zIndex: 100, boxShadow: '0 10px 25px rgba(0,0,0,0.5)', marginTop: '0.5rem' }}>
                            {availableWidgets.map(widget => (
                                <button
                                    key={widget.id}
                                    disabled={activeWidgets.includes(widget.id)}
                                    onClick={() => addWidget(widget.id)}
                                    style={{ width: '100%', padding: '0.5rem', textAlign: 'left', background: 'none', border: 'none', color: activeWidgets.includes(widget.id) ? 'var(--text-muted)' : 'var(--text-main)', fontSize: '0.75rem', cursor: activeWidgets.includes(widget.id) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '0.25rem' }}
                                    className="menu-item"
                                >
                                    <widget.icon size={14} />
                                    {widget.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {activeWidgets.map(id => renderWidget(id))}

            {activeWidgets.length === 0 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                    <Activity size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                    <p style={{ fontSize: '0.875rem' }}>No widgets active. Click "+" to add visualizations.</p>
                </div>
            )}
        </div>
    )
}

export default RightPanel
