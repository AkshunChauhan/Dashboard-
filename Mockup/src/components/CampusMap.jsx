import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Sun, Battery, Globe, Map as MapIcon, Plus, Minus } from 'lucide-react'
import { renderToString } from 'react-dom/server'
import { useState, useEffect } from 'react'

// Coordinates provided by the user
const solarLocations = [
    { id: 1, pos: [52.244837142381094, -113.83150539960184], name: 'CACAC' },
    { id: 2, pos: [52.246773982147346, -113.83506429521253], name: 'Gary W. Harris Center' },
    { id: 3, pos: [52.24872026127489, -113.83181129144185], name: 'RDP Residence Building' },
    { id: 4, pos: [52.246026445810585, -113.82597826910015], name: 'AEL Lab' },
    { id: 5, pos: [52.245910519286255, -113.82379213895976], name: 'RDP Carpentry Roof' },
    { id: 6, pos: [52.2461115381801, -113.8314859942632], name: 'Solar walkway' },
]

const bessLocations = [
    { id: 'bess-1', pos: [52.24692945220354, -113.82391762328756], name: 'BESS Storage Unit 01' },
]

const CampusMap = ({ theme }) => {
    const [mapMode, setMapMode] = useState('default') // 'default' or 'satellite'
    const [viewMode, setViewMode] = useState('2d') // '2d' or '3d'
    const center = [52.246, -113.830]

    // Custom Icon creation
    const createSolarIcon = () => {
        return L.divIcon({
            className: 'solar-marker-icon',
            html: `
          <div class="marker-inner ${viewMode === '3d' ? 'marker-3d' : ''}">
            ${renderToString(<Sun size={20} />)}
          </div>
        `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
        });
    };

    const createBessIcon = () => {
        return L.divIcon({
            className: 'bess-marker-icon',
            html: `
          <div class="marker-inner-bess ${viewMode === '3d' ? 'marker-3d-bess' : ''}">
            ${renderToString(<Battery size={20} />)}
          </div>
        `,
            iconSize: [44, 44],
            iconAnchor: [22, 22],
        });
    };

    const tileUrl = mapMode === 'satellite'
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : (theme === 'dark'
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png")

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {/* Tilted Map perspective container */}
            <div style={containerStyle}>
                <div style={{
                    ...mapWrapperStyle,
                    transform: viewMode === '3d'
                        ? 'translateY(15%) rotateX(60deg) scale(3.5)'
                        : 'translateY(0) rotateX(0deg) scale(1)',
                    width: '100%',
                    height: '100%',
                }}>
                    <MapContainer
                        center={center}
                        zoom={15}
                        scrollWheelZoom={true}
                        zoomControl={false}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            url={tileUrl}
                        />

                        {solarLocations.map((loc) => (
                            <Marker
                                key={loc.id}
                                position={loc.pos}
                                icon={createSolarIcon()}
                            >
                                <Popup>
                                    <div style={{ color: '#333' }}>
                                        <strong style={{ display: 'block', borderBottom: '1px solid #eee', marginBottom: '5px' }}>{loc.name}</strong>
                                        <div style={{ fontSize: '12px' }}>Current Output: {(Math.random() * 50 + 20).toFixed(1)} kW</div>
                                        <div style={{ fontSize: '12px' }}>Efficiency: {(Math.random() * 10 + 85).toFixed(1)}%</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {bessLocations.map((loc) => (
                            <Marker
                                key={loc.id}
                                position={loc.pos}
                                icon={createBessIcon()}
                            >
                                <Popup>
                                    <div style={{ color: '#333' }}>
                                        <strong style={{ display: 'block', borderBottom: '1px solid #eee', marginBottom: '5px' }}>{loc.name}</strong>
                                        <div style={{ fontSize: '12px' }}>SOC: {(Math.random() * 20 + 75).toFixed(1)}%</div>
                                        <div style={{ fontSize: '12px' }}>Status: Charging</div>
                                        <div style={{ fontSize: '12px' }}>Capacity: 500 kWh</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        <ZoomController />
                    </MapContainer>
                </div>
            </div>

            {/* Fixed UI Controls Layer - Outside the 3D perspective */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <button
                    onClick={() => setMapMode(mapMode === 'default' ? 'satellite' : 'default')}
                    style={toggleBtnStyle}
                    title={mapMode === 'default' ? 'Switch to Satellite' : 'Switch to Map'}
                >
                    {mapMode === 'default' ? <Globe size={20} /> : <MapIcon size={20} />}
                </button>
                <button
                    onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
                    style={toggleBtnStyle}
                    title={viewMode === '2d' ? 'Switch to 3D' : 'Switch to 2D'}
                >
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{viewMode === '2d' ? '3D' : '2D'}</span>
                </button>

                {/* Zoom Controls moved here */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px' }}>
                    <button
                        onClick={() => window.leafletMap?.zoomIn()}
                        style={toggleBtnStyle}
                        title="Zoom In"
                    >
                        <Plus size={20} />
                    </button>
                    <button
                        onClick={() => window.leafletMap?.zoomOut()}
                        style={toggleBtnStyle}
                        title="Zoom Out"
                    >
                        <Minus size={20} />
                    </button>
                </div>
            </div>
        </div>
    )
}

// Helper component to capture the map instance
function ZoomController() {
    const map = useMap()
    useEffect(() => {
        window.leafletMap = map
        return () => { window.leafletMap = null }
    }, [map])
    return null
}

const containerStyle = {
    width: '100%',
    height: '100%',
    perspective: '1200px',
    overflow: 'hidden',
}

const mapWrapperStyle = {
    width: '100%',
    height: '100%',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    transformOrigin: 'bottom center',
}

const toggleBtnStyle = {
    width: '40px',
    height: '40px',
    background: 'var(--surface)',
    border: '1px solid var(--surface-border)',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'var(--glass-blur)',
    transition: 'all 0.2s ease',
}

export default CampusMap
