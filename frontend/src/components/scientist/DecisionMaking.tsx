import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/Button";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
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
      coords: [18.95, 72.65],
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
      color: "purple",
      coords: [9.1, 72.8],
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
      coords: [15.0, 88.0],
    },
  ];

  const getSeverityColor = (severity: string) => {
    // theme-aligned classes (cream page, white cards — use softer tints)
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-amber-200 bg-amber-50";
      case "low":
        return "border-sky-50 bg-sky-50";
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
      case "purple":
        return "text-purple-600";
      case "blue":
        return "text-sky-600";
      default:
        return "text-slate-600";
    }
  };

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const fishAbundancePoints = [
    { lat: 19.0, lng: 72.7, abundance: 78 },
    { lat: 16.8, lng: 71.1, abundance: 64 },
    { lat: 10.5, lng: 72.6, abundance: 45 },
    { lat: 8.9, lng: 77.9, abundance: 30 },
    { lat: 21.6, lng: 86.7, abundance: 55 },
    { lat: 14.7, lng: 80.3, abundance: 70 },
    { lat: 11.0, lng: 92.7, abundance: 25 },
    { lat: 18.2, lng: 72.9, abundance: 82 },
    { lat: 15.0, lng: 88.0, abundance: 34 },
    { lat: 7.5, lng: 78.7, abundance: 20 },
    { lat: 19.9, lng: 65.5, abundance: 60 },
    { lat: 20.0, lng: 72.0, abundance: 50 },
  ];

  const abundanceRadius = (val: number) => Math.max(4, Math.round((val / 100) * 18));

  const generateImpactPoints = (center: [number, number], count = 8) => {
    const [lat, lng] = center;
    const points: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      const latOffset = (Math.random() - 0.5) * 0.6;
      const lngOffset = (Math.random() - 0.5) * 0.6;
      points.push([lat + latOffset, lng + lngOffset]);
    }
    return points;
  };

  // --- Map components (functionality unchanged) ---
  const FishAbundanceMap: React.FC = () => {
    return (
      <div className="mx-auto w-full rounded shadow-sm">
        <MapContainer center={INDIA_CENTER} zoom={5} style={{ height: 500, width: "100%" }} scrollWheelZoom>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {fishAbundancePoints.map((p, idx) => (
            <CircleMarker
              key={`fish-${idx}`}
              center={[p.lat, p.lng]}
              radius={abundanceRadius(p.abundance)}
              pathOptions={{ color: "#0ea5e9", fillColor: "#0ea5e9", fillOpacity: 0.78 }}
            >
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

        <div className="mt-2 text-xs text-slate-600">
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
      <div className="mx-auto w-full rounded shadow-sm">
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
                    : ev.color === "purple"
                    ? "#8b5cf6"
                    : "#0ea5e9",
                fillOpacity: 0.85,
              }}
            >
              <Tooltip direction="top" offset={[0, -10]}>
                <div className="text-sm font-medium">{ev.title}</div>
              </Tooltip>

              <Popup>
                <div>
                  <h4 className="font-semibold">{ev.title}</h4>
                  <p className="text-sm text-slate-700">{ev.description}</p>
                  <div className="mt-2 text-xs text-slate-600">{ev.location} • {ev.date}</div>
                  <div className="mt-1 text-xs"><strong>Impact:</strong> {ev.impact}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

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

        <div className="mt-2 text-xs text-slate-600">
          <div><strong>Tip:</strong> Click an event marker for more details.</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-[#fdf2df]">
      <div className="max-w-6xl mx-auto space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Decision-Making Module</h1>
          <p className="text-slate-600">Major events and decision support for marine management</p>
        </div>

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Explore Environmental Data</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex w-full">
              <button
                onClick={() => setSelectedOption("abundance")}
                className={`flex-1 py-3 text-center rounded-none border-b-2 transition ${
                  selectedOption === "abundance"
                    ? "border-sky-500 text-sky-600 font-semibold"
                    : "border-transparent text-slate-600 hover:text-sky-500"
                }`}
                aria-pressed={selectedOption === "abundance"}
              >
                Fish Abundance
              </button>

              <button
                onClick={() => setSelectedOption("temperature")}
                className={`flex-1 py-3 text-center rounded-none border-b-2 transition ${
                  selectedOption === "temperature"
                    ? "border-sky-500 text-sky-600 font-semibold"
                    : "border-transparent text-slate-600 hover:text-sky-500"
                }`}
                aria-pressed={selectedOption === "temperature"}
              >
                Temperature
              </button>

              <button
                onClick={() => setSelectedOption("migration")}
                className={`flex-1 py-3 text-center rounded-none border-b-2 transition ${
                  selectedOption === "migration"
                    ? "border-sky-500 text-sky-600 font-semibold"
                    : "border-transparent text-slate-600 hover:text-sky-500"
                }`}
                aria-pressed={selectedOption === "migration"}
              >
                Migration Map
              </button>

              <button
                onClick={() => {
                  setSelectedOption("events");
                }}
                className={`flex-1 py-3 text-center rounded-none border-b-2 transition ${
                  selectedOption === "events"
                    ? "border-sky-500 text-sky-600 font-semibold"
                    : "border-transparent text-slate-600 hover:text-sky-500"
                }`}
                aria-pressed={selectedOption === "events"}
              >
                Events
              </button>
            </div>

            {selectedOption && (
              <div className="mt-6 border rounded-lg bg-slate-50 p-6">
                {selectedOption === "abundance" && <FishAbundanceMap />}

                {selectedOption === "temperature" && <TemperatureMap />}

                {selectedOption === "migration" && (
                  <TransformWrapper>
                    <TransformComponent>
                      <img src="/migration.png" alt="Migration Map" className="mx-auto max-h-96 rounded shadow-sm" />
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

        <Card className="bg-white border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Major Events using AI-powered Insights</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {majorEvents.map((event) => {
                const Icon = event.icon;
                return (
                  <div key={event.id} className={`rounded-lg border p-4 ${getSeverityColor(event.severity)}`}>
                    <div className="flex items-start space-x-3">
                      <Icon className={`h-6 w-6 ${getIconColor(event.color)} mt-1`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900">{event.title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{event.description}</p>
                          </div>

                          <span className={`px-2 py-1 text-xs rounded-full ${
                            event.severity === "high" ? "bg-red-100 text-red-800" :
                            event.severity === "medium" ? "bg-amber-100 text-amber-800" :
                            "bg-sky-50 text-sky-700"
                          }`}>
                            {event.severity} priority
                          </span>
                        </div>

                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex items-center text-slate-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {event.location} • {event.date}
                          </div>
                          <div>
                            <p className="text-slate-700"><strong>Impact:</strong> {event.impact}</p>
                          </div>
                        </div>

                        <div className="mt-3 flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedEvent(event);
                              setSelectedOption("events");
                            }}
                          >
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
    </div>
  );
};

export default DecisionMaking;
