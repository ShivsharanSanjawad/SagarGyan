import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';

// Simulated temperature data points around India's seas
const temperatureData = [
  { lat: 20.0, lng: 72.8, temp: 28.5, location: "Arabian Sea (Mumbai)" },
  { lat: 18.5, lng: 72.3, temp: 29.2, location: "Arabian Sea (South)" },
  { lat: 22.3, lng: 70.1, temp: 27.8, location: "Gulf of Kutch" },
  { lat: 12.8, lng: 80.2, temp: 30.1, location: "Bay of Bengal (Chennai)" },
  { lat: 13.6, lng: 79.4, temp: 29.8, location: "Bay of Bengal (Central)" },
  { lat: 16.5, lng: 82.7, temp: 29.5, location: "Bay of Bengal (East)" },
  { lat: 11.9, lng: 79.8, temp: 30.5, location: "Bay of Bengal (South)" },
  { lat: 15.3, lng: 73.8, temp: 28.9, location: "Goa Coast" },
  { lat: 10.8, lng: 79.1, temp: 30.8, location: "Palk Strait" },
  { lat: 8.5, lng: 77.0, temp: 29.7, location: "Kanyakumari" },
  { lat: 9.9, lng: 76.3, temp: 29.3, location: "Kerala Coast" },
  { lat: 14.5, lng: 74.2, temp: 28.7, location: "Karwar" },
  { lat: 17.7, lng: 83.3, temp: 29.9, location: "Visakhapatnam" },
  { lat: 19.8, lng: 85.8, temp: 30.2, location: "Bhubaneswar Coast" },
  { lat: 21.6, lng: 87.1, temp: 29.4, location: "West Bengal Coast" }
];

// Function to get color based on temperature
const getTemperatureColor = (temp) => {
  if (temp < 26) return '#0066ff'; // Blue - cool
  if (temp < 27) return '#00ccff'; // Light blue
  if (temp < 28) return '#00ff99'; // Green-blue
  if (temp < 29) return '#66ff00'; // Green
  if (temp < 30) return '#ffff00'; // Yellow
  if (temp < 31) return '#ff9900'; // Orange
  return '#ff0000'; // Red - hot
};

// Function to get radius based on temperature intensity
const getRadius = (temp) => Math.max(15, (temp - 24) * 3);

const TemperatureMap = () => {
  return (
    <div className="h-[500px] w-full rounded overflow-hidden shadow">
      <MapContainer
        center={[15, 80]} // Center on India's seas
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        {/* Temperature data points */}
        {temperatureData.map((point, index) => (
          <CircleMarker
            key={index}
            center={[point.lat, point.lng]}
            radius={getRadius(point.temp)}
            fillColor={getTemperatureColor(point.temp)}
            color="white"
            weight={2}
            opacity={0.8}
            fillOpacity={0.6}
          >
            <Popup>
              <div className="text-center">
                <div className="font-bold text-lg">{point.temp}°C</div>
                <div className="text-sm text-gray-600">{point.location}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Sea Surface Temperature
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Legend overlay */}
        <div 
          className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg border z-[1000]"
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-sm font-bold mb-2">Temperature (°C)</div>
          <div className="flex flex-col space-y-1">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#ff0000' }}></div>
              <span className="text-xs">31°C+</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#ff9900' }}></div>
              <span className="text-xs">30-31°C</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#ffff00' }}></div>
              <span className="text-xs">29-30°C</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#66ff00' }}></div>
              <span className="text-xs">28-29°C</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#00ff99' }}></div>
              <span className="text-xs">27-28°C</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#00ccff' }}></div>
              <span className="text-xs">26-27°C</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: '#0066ff' }}></div>
              <span className="text-xs">&lt;26°C</span>
            </div>
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default TemperatureMap;