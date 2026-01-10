import React, { useState, useEffect } from 'react'
import { Cloud, Sun, CloudSnow, Thermometer, Info } from 'lucide-react'

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Red Deer coordinates from previous markers
                const lat = 52.246
                const lon = -113.830
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,snow_depth&timezone=auto`
                )
                const data = await response.json()
                setWeather(data.current)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching weather:', error)
                setLoading(false)
            }
        }

        fetchWeather()
        const interval = setInterval(fetchWeather, 600000) // Update every 10 mins
        return () => clearInterval(interval)
    }, [])

    if (loading) return <div className="stat-card" style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading weather...</div>
    if (!weather) return null

    const getIcon = (code) => {
        if (code === 0) return <Sun size={24} color="var(--accent)" />
        if (code >= 1 && code <= 3) return <Cloud size={24} color="var(--text-muted)" />
        if (code >= 71 && code <= 77) return <CloudSnow size={24} color="white" />
        return <Cloud size={24} color="var(--text-muted)" />
    }

    const getProductionImpact = () => {
        let impact = 100
        if (weather.snow_depth > 0) impact -= Math.min(weather.snow_depth * 10, 80) // Snow depth in cm
        if (weather.weather_code >= 1) impact -= 20 // Cloudy
        return Math.max(impact, 10)
    }

    const impact = getProductionImpact()

    return (
        <div className="stat-card" style={{ background: 'var(--glass)', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Weather</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                        {getIcon(weather.weather_code)}
                        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{weather.temperature_2m}°C</span>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Snow Depth</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>{weather.snow_depth || 0} cm</div>
                </div>
            </div>

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--surface-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Info size={12} /> Solar Potential
                    </span>
                    <span style={{ color: impact > 70 ? 'var(--secondary)' : 'var(--accent)', fontWeight: 700 }}>{impact}% Potential</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px' }}>
                    <div
                        style={{
                            width: `${impact}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, var(${impact > 70 ? '--secondary' : '--accent'}), var(--primary))`,
                            borderRadius: '3px',
                            transition: 'width 1s ease-out'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default WeatherWidget
