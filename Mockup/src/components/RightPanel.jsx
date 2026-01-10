import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Activity, Zap, ShieldCheck } from 'lucide-react'

const energyDistribution = [
    { name: 'Solar', value: 45, color: 'var(--accent)' },
    { name: 'Grid', value: 35, color: 'var(--primary)' },
    { name: 'BESS', value: 20, color: 'var(--secondary)' },
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

const RightPanel = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={20} color="var(--primary)" />
                    Energy Mix
                </h2>
                <div style={{ height: '220px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={energyDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {energyDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '0.5rem' }}
                                itemStyle={{ color: 'var(--text-main)' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem' }}>
                    {energyDistribution.map(item => (
                        <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                            <span>{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Zap size={20} color="var(--accent)" />
                    Weekly Consumption
                </h2>
                <div style={{ height: '200px', width: '100%', marginTop: '1rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <XAxis dataKey="day" hide />
                            <Tooltip
                                contentStyle={{ background: 'var(--surface)', border: '1px solid var(--surface-border)', borderRadius: '0.5rem' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="usage" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="stat-card" style={{ border: '1px border-top solid var(--primary-glow)', background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0) 100%)' }}>
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
        </div>
    )
}

export default RightPanel
