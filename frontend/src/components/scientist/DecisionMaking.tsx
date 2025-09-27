import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/Button";
import {MapContainer,TileLayer,CircleMarker,Popup,Tooltip,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import TemperatureMap from "@/components/scientist/temp";
import { AlertTriangle, TrendingUp, Fish, Waves, MapPin } from "lucide-react";

const INDIA_CENTER: [number, number] = [20.5937, 78.9629];

export const DecisionMaking: React.FC = () => {
  const majorEvents = [
    {
      id: 1,
      type: "oil_spill",
      title: "Oil Spill Alert - Mumbai Coast",
      description:
        "Moderate oil spill detected 15 km off Mumbai coast. Marine life impact assessment ongoing.",
      location: "Mumbai, Maharashtra (offshore)",
      date: "2024-01-12",
      severity: "high",
      impact: "Marine ecosystem disruption, fishing restrictions in 20 km radius",
      icon: AlertTriangle,
      color: "red",
      coords: [18.95, 72.65], // realistic offshore location near Mumbai
    },
    {
      id: 2,
      type: "migration",
      title: "Tuna Migration Pattern Change",
      description:
        "Unusual southward migration of yellowfin tuna observed earlier than seasonal pattern.",
      location: "Central Arabian Sea",
      date: "2024-01-10",
      severity: "medium",
      impact: "Potential impact on fishing seasons, need for updated fishing advisories",
      icon: Fish,
      color: "amber",
      coords: [16.8, 68.5], 
    },
    {
      id: 3,
      type: "discovery",
      title: "New Deep-Sea Species Discovered",
      description:
        "Previously unknown bioluminescent fish species found at 2000m depth.",
      location: "Lakshadweep/Indian Ocean Deep Site",
      date: "2024-01-08",
      severity: "low",
      impact: "Significant scientific discovery, need for habitat protection measures",
      icon: TrendingUp,
      color: "green",
      coords: [9.1, 72.8], // south-west India oceanic area
    },
    {
      id: 4,
      type: "temperature",
      title: "Unusual Temperature Anomaly",
      description:
        "Sea surface temperatures 2°C above seasonal average in Bay of Bengal.",
      location: "Bay of Bengal",
      date: "2024-01-14",
      severity: "medium",
      impact: "Potential coral bleaching, fish behavior changes expected",
      icon: Waves,
      color: "blue",
      coords: [15.0, 88.0], // Bay of Bengal anomaly
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-amber-200 bg-amber-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case "red":
        return "text-red-600";
      case "amber":
        return "text-amber-600";
      case "green":
        return "text-green-600";
      case "blue":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const fishAbundancePoints = [
    { lat: 19.0, lng: 72.7, abundance: 78 }, // Mumbai coast
    { lat: 16.8, lng: 71.1, abundance: 64 }, // Ratnagiri
    { lat: 10.5, lng: 72.6, abundance: 45 }, // near Lakshadweep
    { lat: 8.9, lng: 77.9, abundance: 30 }, // south-west Bay 
    { lat: 21.6, lng: 86.7, abundance: 55 }, // near Odisha coast
    { lat: 14.7, lng: 80.3, abundance: 70 }, // near Chennai coast
    { lat: 11.0, lng: 92.7, abundance: 25 }, // Andaman nearby
    { lat: 18.2, lng: 72.9, abundance: 82 }, // near Mumbai - more productive
    { lat: 15.0, lng: 88.0, abundance: 34 }, // Bay of Bengal anomaly area
    { lat: 7.5, lng: 78.7, abundance: 20 }, // deep sea south-east
    { lat: 19.9, lng: 65.5, abundance: 60 }, // northern Arabian Sea
    { lat: 20.0, lng: 72.0, abundance: 50 }, // central west coast
  ];

  const abundanceRadius = (val: number) => Math.max(4, Math.round((val / 100) * 18));

  const generateImpactPoints = (center: [number, number], count = 8) => { //event map helper
    const [lat, lng] = center;
    const points: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      const latOffset = (Math.random() - 0.5) * 0.6; // ~ +/- 0.3 deg
      const lngOffset = (Math.random() - 0.5) * 0.6;
      points.push([lat + latOffset, lng + lngOffset]);
    }
    return points;
  };
  // Map components 
  const FishAbundanceMap: React.FC = () => {
    return (
      <div className="mx-auto w-full rounded shadow">
        <MapContainer center={INDIA_CENTER} zoom={5} style={{ height: 500, width: "100%" }} scrollWheelZoom={true}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {fishAbundancePoints.map((p, idx) => (
            <CircleMarker
              key={`fish-${idx}`}
              center={[p.lat, p.lng]}
              radius={abundanceRadius(p.abundance)}
              pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.7 }}>
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="text-xs">
                  <div><strong>Abundance:</strong> {p.abundance}%</div>
                  <div className="text-xs">Lat: {p.lat.toFixed(2)}, Lon: {p.lng.toFixed(2)}</div>
                </div>
              </Tooltip>
              <Popup>
                <div>
                  <h4 className="font-semibold">Fish abundance</h4>
                  <div>Abundance score: {p.abundance}%</div>
                  <div>Coordinates: {p.lat.toFixed(3)}, {p.lng.toFixed(3)}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        </MapContainer>
        {/* simple legend */}
        <div className="mt-2 text-xs text-gray-600">
          <div><strong>Legend:</strong> circle size ∝ abundance</div>
        </div>
      </div>
    );
  };

  const EventsMap: React.FC<{ events: any[]; selectedEvent: any | null }> = ({ events, selectedEvent }) => {
    const [map, setMap] = useState<any | null>(null);

    useEffect(() => {
      if (map) {
        if (selectedEvent && selectedEvent.coords) {
          map.setView(selectedEvent.coords, 7);
        } else {
          map.setView(INDIA_CENTER, 5);
        }
      }
    }, [map, selectedEvent]);

    return (
      <div className="mx-auto w-full rounded shadow">
        <MapContainer whenCreated={setMap} center={INDIA_CENTER} zoom={5} style={{ height: 500, width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {events.map((ev) => (
            <CircleMarker
              key={ev.id}
              center={ev.coords}
              radius={ev.severity === "high" ? 12 : ev.severity === "medium" ? 9 : 6}
              pathOptions={{
                color:
                  ev.color === "red"
                    ? "#ef4444"
                    : ev.color === "amber"
                    ? "#f59e0b"
                    : ev.color === "green"
                    ? "#10b981"
                    : "#3b82f6",
                fillOpacity: 0.85,
              }}
            >
              <Tooltip direction="top" offset={[0, -10]}>
                <div className="text-sm font-medium">{ev.title}</div>
              </Tooltip>
              <Popup>
                <div>
                  <h4 className="font-semibold">{ev.title}</h4>
                  <p className="text-sm text-gray-700">{ev.description}</p>
                  <div className="mt-2 text-xs text-gray-600">{ev.location} • {ev.date}</div>
                  <div className="mt-1 text-xs"><strong>Impact:</strong> {ev.impact}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* If an event is selected, show several nearby dummy impact/sample points */}
          {selectedEvent && selectedEvent.coords && (
            generateImpactPoints(selectedEvent.coords, 10).map((pt, idx) => (
              <CircleMarker
                key={`impact-${idx}`}
                center={pt}
                radius={4}
                pathOptions={{ color: "#f97316", fillOpacity: 0.7 }}
              />
            ))
          )}
        </MapContainer>

        <div className="mt-2 text-xs text-gray-600">
          <div><strong>Tip:</strong> Click an event marker for more details.</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Decision-Making Module</h1>
        <p className="text-gray-600">Major events and decision support for marine management</p>
      </div>

      {/* Data Options */}
      <Card>
        <CardHeader>
          <CardTitle>Explore Environmental Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full">
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === "abundance"
                  ? "border-sky-500 text-sky-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-sky-500"
              }`}
              onClick={() => setSelectedOption("abundance")}
            >
              Fish Abundance
            </Button>

            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === "temperature"
                  ? "border-sky-500 text-sky-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-sky-500"
              }`}
              onClick={() => setSelectedOption("temperature")}
            >
              Temperature
            </Button>

            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === "migration"
                  ? "border-sky-500 text-sky-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-sky-500"
              }`}
              onClick={() => setSelectedOption("migration")}
            >
              Migration Map
            </Button>

            {/* New Events Tab */}
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === "events"
                  ? "border-sky-500 text-sky-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-sky-500"
              }`}
              onClick={() => {
                setSelectedOption("events");
              }}>Events
            </Button>
          </div>

          {/* Show Visual Only If Option Selected */}
          {selectedOption && (
            <div className="mt-6 border rounded-lg bg-gray-50 p-6 text-center">
              {selectedOption === "abundance" && (
                // interactive map for fish abundance
                <FishAbundanceMap />
              )}

              {selectedOption === "temperature" && <TemperatureMap />}

              {selectedOption === "migration" && (
                <TransformWrapper>
                  <TransformComponent>
                    <img src="/migration.png" alt="Migration Map" className="mx-auto max-h-96 rounded shadow" />
                  </TransformComponent>
                </TransformWrapper>
              )}

              {selectedOption === "events" && (
                <EventsMap events={majorEvents} selectedEvent={selectedEvent} />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Major Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Major Events using AI-powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {majorEvents.map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className={`border rounded-lg p-4 ${getSeverityColor(event.severity)}`}>
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-6 w-6 ${getIconColor(event.color)} mt-1`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.severity === 'high' ? 'bg-red-100 text-red-800' :
                          event.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {event.severity} priority
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location} • {event.date}
                        </div>
                        <div>
                          <p className="text-gray-700"><strong>Impact:</strong> {event.impact}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // When View Details clicked: open Events tab and center map
                            setSelectedEvent(event);
                            setSelectedOption("events");
                          }}>
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">Generate Report</Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DecisionMaking;
