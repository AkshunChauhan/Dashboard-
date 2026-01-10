import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Sun, Battery } from 'lucide-react'
import { renderToString } from 'react-dom/server'

// Coordinates provided by the user
const solarLocations = [
    { id: 1, pos: [52.244837142381094, -113.83150539960184], name: 'South Array A' },
    { id: 2, pos: [52.246773982147346, -113.83506429521253], name: 'West Campus Roof' },
    { id: 3, pos: [52.24872026127489, -113.83181129144185], name: 'North Science Lab' },
    { id: 4, pos: [52.246026445810585, -113.82597826910015], name: 'East Sports Complex' },
    { id: 5, pos: [52.245910519286255, -113.82379213895976], name: 'Perimeter Boundary' },
    { id: 6, pos: [52.2461115381801, -113.8314859942632], name: 'Central Admin Plaza' },
]

const bessLocations = [
    { id: 'bess-1', pos: [52.24692945220354, -113.82391762328756], name: 'BESS Storage Unit 01' },
]

// Custom Icon creation
const createSolarIcon = () => {
    return L.divIcon({
        className: 'solar-marker-icon',
        html: `
      <div class="marker-inner">
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
      <div class="marker-inner-bess">
        ${renderToString(<Battery size={20} />)}
      </div>
    `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
    });
};

const CampusMap = ({ theme }) => {
    const center = [52.246, -113.830]

    const tileUrl = theme === 'dark'
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"

    return (
        <MapContainer
            center={center}
            zoom={15}
            scrollWheelZoom={true}
            zoomControl={false}
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
                            <div style={{ fontSize: '12px' }}>Current Output: ${(Math.random() * 50 + 20).toFixed(1)} kW</div>
                            <div style={{ fontSize: '12px' }}>Efficiency: ${(Math.random() * 10 + 85).toFixed(1)}%</div>
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
                            <div style={{ fontSize: '12px' }}>SOC: ${(Math.random() * 20 + 75).toFixed(1)}%</div>
                            <div style={{ fontSize: '12px' }}>Status: Charging</div>
                            <div style={{ fontSize: '12px' }}>Capacity: 500 kWh</div>
                        </div>
                    </Popup>
                </Marker>
            ))}

            <ZoomButton />
        </MapContainer>
    )
}

// Custom Zoom Control to match design
const ZoomButton = () => {
    const map = useMap()
    return (
        <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button
                onClick={() => map.zoomIn()}
                style={zoomBtnStyle}
            >+</button>
            <button
                onClick={() => map.zoomOut()}
                style={zoomBtnStyle}
            >-</button>
        </div>
    )
}

const zoomBtnStyle = {
    width: '36px',
    height: '36px',
    background: 'var(--surface)',
    border: '1px solid var(--surface-border)',
    color: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '20px',
    fontWeight: 'bold',
    backdropFilter: 'var(--glass-blur)',
}

export default CampusMap
