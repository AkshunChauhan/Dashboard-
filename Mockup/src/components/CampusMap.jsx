import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Sun, Battery, Globe, Zap, Map as MapIcon, Plus, Minus } from 'lucide-react'
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
    { id: 7, pos: [52.24573921345892, -113.82595460740829], name: 'Solar walkway' },
]

const bessLocations = [
    { id: 'bess-1', pos: [52.24692945220354, -113.82391762328756], name: 'BESS Storage Unit 01' },
]

const transformerLocations = [
    { id: 'tx-1', pos: [52.24882689476097, -113.8281767890768], name: 'Transformer TX-01' },
    { id: 'tx-2', pos: [52.24746996109212, -113.8292903318412], name: 'Transformer TX-02' },
    { id: 'tx-3', pos: [52.2465236270749, -113.82973534064482], name: 'Transformer TX-03' },
    { id: 'tx-4', pos: [52.24490620359536, -113.83058032417108], name: 'Transformer TX-04' },
    { id: 'tx-5', pos: [52.24662477670595, -113.83290235380821], name: 'Transformer TX-05' },
    { id: 'tx-6', pos: [52.24580634045058, -113.83246028651685], name: 'Transformer TX-06' },
    { id: 'tx-7', pos: [52.24522809218563, -113.8280254350449], name: 'Transformer TX-07' },
    { id: 'tx-8', pos: [52.24507956093908, -113.82514717800831], name: 'Transformer TX-08' },
    { id: 'tx-9', pos: [52.24581248680288, -113.82566498544942], name: 'Transformer TX-09' },
    { id: 'tx-10', pos: [52.246269516828264, -113.82425840578173], name: 'Transformer TX-10' },
]

const CampusMap = ({ theme }) => {
    const [mapMode, setMapMode] = useState('default') // 'default' or 'satellite'
    const [viewMode, setViewMode] = useState('2d') // '2d' or '3d'
    const [showSolar, setShowSolar] = useState(true)
    const [showBess, setShowBess] = useState(true)
    const [showTransformers, setShowTransformers] = useState(true)
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

    const createTransformerIcon = () => {
        return L.divIcon({
            className: 'transformer-marker-icon',
            html: `
          <div class="marker-inner-transformer ${viewMode === '3d' ? 'marker-3d-transformer' : ''}">
            ${renderToString(<Zap size={18} />)}
          </div>
        `,
            iconSize: [42, 42],
            iconAnchor: [21, 21],
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

                        {showSolar && solarLocations.map((loc) => (
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

                        {showBess && bessLocations.map((loc) => (
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

                        {showTransformers && transformerLocations.map((loc) => (
                            <Marker
                                key={loc.id}
                                position={loc.pos}
                                icon={createTransformerIcon()}
                            >
                                <Popup>
                                    <div style={{ color: '#333' }}>
                                        <strong style={{ display: 'block', borderBottom: '1px solid #eee', marginBottom: '5px' }}>{loc.name}</strong>
                                        <div style={{ fontSize: '12px' }}>Load: {(Math.random() * 40 + 30).toFixed(1)}%</div>
                                        <div style={{ fontSize: '12px' }}>Voltage: 12.4 kV</div>
                                        <div style={{ fontSize: '12px' }}>Status: Optimal</div>
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
                gap: '15px'
            }}>
                {/* View Controls Group */}
                <div className="toggle-group">
                    <button
                        onClick={() => setMapMode(mapMode === 'default' ? 'satellite' : 'default')}
                        className="toggle-btn"
                        title={mapMode === 'default' ? 'Switch to Satellite' : 'Switch to Map'}
                    >
                        {mapMode === 'default' ? <Globe size={20} /> : <MapIcon size={20} />}
                    </button>
                    <button
                        onClick={() => setViewMode(viewMode === '2d' ? '3d' : '2d')}
                        className={`toggle-btn ${viewMode === '3d' ? 'toggle-active' : ''}`}
                        title={viewMode === '2d' ? 'Switch to 3D' : 'Switch to 2D'}
                    >
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{viewMode === '2d' ? '3D' : '2D'}</span>
                    </button>
                </div>

                {/* Layer Visibility Group */}
                <div className="toggle-group">
                    <button
                        onClick={() => setShowSolar(!showSolar)}
                        className={`toggle-btn ${showSolar ? 'toggle-active' : ''}`}
                        title={showSolar ? 'Hide Solar Panels' : 'Show Solar Panels'}
                    >
                        <Sun size={20} />
                    </button>
                    <button
                        onClick={() => setShowBess(!showBess)}
                        className={`toggle-btn ${showBess ? 'toggle-active' : ''}`}
                        title={showBess ? 'Hide battery Storage' : 'Show Battery Storage'}
                    >
                        <Battery size={20} />
                    </button>
                    <button
                        onClick={() => setShowTransformers(!showTransformers)}
                        className={`toggle-btn ${showTransformers ? 'toggle-active' : ''}`}
                        title={showTransformers ? 'Hide Transformers' : 'Show Transformers'}
                    >
                        <Zap size={20} />
                    </button>
                </div>

                {/* Zoom Controls */}
                <div className="toggle-group">
                    <button
                        onClick={() => window.leafletMap?.zoomIn()}
                        className="toggle-btn"
                        title="Zoom In"
                    >
                        <Plus size={20} />
                    </button>
                    <button
                        onClick={() => window.leafletMap?.zoomOut()}
                        className="toggle-btn"
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

export default CampusMap
