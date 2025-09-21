import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/Button";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export const DecisionMaking: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Decision-Making Module
        </h1>
        <p className="text-gray-600">
          Major events and decision support for marine management
        </p>
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
              onClick={() => setSelectedOption("abundance")}>
              Fish Abundance
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === "temperature"
                  ? "border-sky-500 text-sky-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-sky-500"
              }`}
              onClick={() => setSelectedOption("temperature")}>
              Temperature
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === "migration"
                  ? "border-sky-500 text-sky-600 font-semibold"
                  : "border-transparent text-gray-600 hover:text-sky-500"
              }`}
              onClick={() => setSelectedOption("migration")}>
              Migration Map
            </Button>
          </div>

          {/* Show Visual Only If Option Selected */}
          {selectedOption && (
            <div className="mt-6 border rounded-lg bg-gray-50 p-6 text-center">
              {selectedOption === "abundance" && (
                <TransformWrapper>
                  <TransformComponent>
                    <img
                      src="/fish.png"
                      alt="Fish Abundance"
                      className="mx-auto max-h-[500px] w-full rounded shadow cursor-grab"/>
                  </TransformComponent>
                </TransformWrapper>
              )}

              {selectedOption === "temperature" && (
                <div className="h-[500px] w-full rounded overflow-hidden shadow">
                  <MapContainer
                    center={[15, 80]} // Center on India's seas
                    zoom={4}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="&copy; OpenStreetMap contributors"/>

                    {/* Animated Temperature Overlay (gradient) */}
                    <TileLayer
                      url="https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY"
                      attribution="&copy; OpenWeatherMap"
                      opacity={0.6}/>
                  </MapContainer>
                </div>
              )}

              {selectedOption === "migration" && (
                <TransformWrapper>
                  <TransformComponent>
                <img
                  src="/migration.png"
                  alt="Migration Map"
                  className="mx-auto max-h-96 rounded shadow"/>
                </TransformComponent>
                </TransformWrapper>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
