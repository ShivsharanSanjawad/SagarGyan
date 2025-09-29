import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface FishData {
  genus: string;
  species: string;
  common_name: string;
  family: string;
  order: string;
  class: string;
  phylum: string;
  description: string;
  conservation_status: string;
  habitat: string;
  geographic_distribution: string;
  max_length_cm: number;
  average_weight_kg: number;
  diet: string;
  behavior: string;
  reproduction: string;
  temperature_range_c: string;
  salinity_range: string;
  fishing_method: string;
  commercial_value: string;
}

const hardcodedFish: FishData = {
  genus: "Mullus",
  species: "barbatus",
  common_name: "Red Mullet",
  family: "Mullidae",
  order: "Perciformes",
  class: "Actinopterygii",
  phylum: "Chordata",
  description:
    "A small, colorful benthic fish commonly found along the sandy and muddy coasts of the Indian Ocean.",
  conservation_status: "Least Concern",
  habitat: "Sandy or muddy seabeds in shallow coastal waters",
  geographic_distribution:
    "Indian Ocean, including coasts of India, Sri Lanka, and East Africa",
  max_length_cm: 30.0,
  average_weight_kg: 0.3,
  diet: "Small invertebrates, crustaceans, worms",
  behavior: "Benthic, often found in small schools, migrates seasonally",
  reproduction: "Spawns in spring to summer; eggs and larvae are planktonic",
  temperature_range_c: "22-28",
  salinity_range: "33-36 ppt",
  fishing_method: "Trawling, gillnets, artisanal fishing",
  commercial_value: "High; popular in regional cuisine for its flavor",
};

export const QuerySearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FishData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [delayedResults, setDelayedResults] = useState<FishData[]>([]);
  const [delayedSelectedIndex, setDelayedSelectedIndex] = useState<number | null>(null);

  const handleSearch = () => {
    setLoading(true);
    setResults([]);
    setSelectedIndex(null);
    
    // Simulate API delay (2-3 seconds)
    setTimeout(() => {
      // For demo purposes, always return the hardcoded fish
      const simulatedResults = [hardcodedFish];
      setResults(simulatedResults);
      setLoading(false);
    }, 3500); // 2.5 second delay
  };

  // Handle delayed display of results
  useEffect(() => {
    if (results.length > 0) {
      const timer = setTimeout(() => {
        setDelayedResults(results);
        setDelayedSelectedIndex(0); // Auto-select first result
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setDelayedResults([]);
      setDelayedSelectedIndex(null);
    }
  }, [results]);

  const selectedFish = delayedSelectedIndex !== null ? delayedResults[delayedSelectedIndex] : null;

  return (
    <div className="min-h-screen bg-[#fdf2df] p-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900">Scientific Query Engine</h1>
          <p className="mt-1 text-slate-600">Search our database using Natural language Query for detailed insights.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Search & results list */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="shadow rounded-2xl border border-slate-100 bg-white">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-sky-900 mb-2">
                  Scientific Query Engine
                </h1>
                <p className="text-sm text-sky-600 mb-4">
                  Search our database using Natural language Query for detailed insights.
                </p>

                <div className="flex flex-col md:flex-row gap-3">
                  <Input
                    placeholder="Enter your query..."
                    className="flex-1 rounded-lg border-sky-300 focus:ring-sky-500 focus:border-sky-500"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    className={`rounded-lg px-6 transition ${loading ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600 text-white'}`}
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results list */}
            {delayedResults.length > 0 && (
              <Card className="shadow rounded-2xl border border-slate-100 bg-white">
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold text-sky-800 mb-2">
                    Results
                  </h2>
                  <ul>
                    {delayedResults.map((fish, idx) => (
                      <li
                        key={idx}
                        className={`p-3 cursor-pointer rounded-lg transition flex items-center justify-between ${
                          idx === delayedSelectedIndex ? "bg-sky-50 shadow-sm" : "hover:bg-slate-50"
                        }`}
                        onClick={() => setDelayedSelectedIndex(idx)}
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{fish.common_name}</div>
                          <div className="text-xs text-slate-500">{fish.genus} {fish.species}</div>
                        </div>

                        <div className="text-xs text-slate-400">{fish.habitat}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Left-side key information */}
            {selectedFish && (
              <Card className="shadow rounded-2xl border border-slate-100 bg-white">
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold text-sky-800 mb-3">
                    Key Characteristics
                  </h2>
                  <div className="grid grid-cols-2 gap-3 text-sm text-sky-800">
                    <p>
                      <span className="font-semibold">Habitat:</span>{" "}
                      {selectedFish.habitat}
                    </p>
                    <p>
                      <span className="font-semibold">Distribution:</span>{" "}
                      {selectedFish.geographic_distribution}
                    </p>
                    <p>
                      <span className="font-semibold">Max Length:</span>{" "}
                      {selectedFish.max_length_cm} cm
                    </p>
                    <p>
                      <span className="font-semibold">Avg Weight:</span>{" "}
                      {selectedFish.average_weight_kg} kg
                    </p>
                    <p>
                      <span className="font-semibold">Diet:</span>{" "}
                      {selectedFish.diet}
                    </p>
                    <p>
                      <span className="font-semibold">Conservation:</span>{" "}
                      {selectedFish.conservation_status}
                    </p>
                  </div>
                  <p className="mt-3 text-gray-700 italic text-sm">
                    {selectedFish.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Informatics box */}
          <div className="w-full">
            {selectedFish ? (
              <Card className="shadow rounded-2xl border border-slate-100 bg-white">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-sky-900 mb-4">
                    {selectedFish.common_name}
                  </h2>
                  <img
                    src="/mullus-barbatus.jpg"
                    alt={selectedFish.common_name}
                    className="w-full h-64 object-cover rounded-xl shadow mb-4"
                  />
                  <div className="grid grid-cols-2 gap-4 text-sm text-sky-800">
                    <p>
                      <span className="font-semibold">Genus:</span>{" "}
                      {selectedFish.genus}
                    </p>
                    <p>
                      <span className="font-semibold">Species:</span>{" "}
                      {selectedFish.species}
                    </p>
                    <p>
                      <span className="font-semibold">Family:</span>{" "}
                      {selectedFish.family}
                    </p>
                    <p>
                      <span className="font-semibold">Order:</span>{" "}
                      {selectedFish.order}
                    </p>
                    <p>
                      <span className="font-semibold">Class:</span>{" "}
                      {selectedFish.class}
                    </p>
                    <p>
                      <span className="font-semibold">Phylum:</span>{" "}
                      {selectedFish.phylum}
                    </p>
                  </div>

                  <p className="mt-4 text-gray-700 italic">
                    {selectedFish.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-sky-800">
                    <p>
                      <span className="font-semibold">Conservation Status:</span>{" "}
                      {selectedFish.conservation_status}
                    </p>
                    <p>
                      <span className="font-semibold">Habitat:</span>{" "}
                      {selectedFish.habitat}
                    </p>
                    <p>
                      <span className="font-semibold">Distribution:</span>{" "}
                      {selectedFish.geographic_distribution}
                    </p>
                    <p>
                      <span className="font-semibold">Max Length:</span>{" "}
                      {selectedFish.max_length_cm} cm
                    </p>
                    <p>
                      <span className="font-semibold">Avg Weight:</span>{" "}
                      {selectedFish.average_weight_kg} kg
                    </p>
                    <p>
                      <span className="font-semibold">Diet:</span>{" "}
                      {selectedFish.diet}
                    </p>
                    <p>
                      <span className="font-semibold">Behavior:</span>{" "}
                      {selectedFish.behavior}
                    </p>
                    <p>
                      <span className="font-semibold">Reproduction:</span>{" "}
                      {selectedFish.reproduction}
                    </p>
                    <p>
                      <span className="font-semibold">Temperature Range:</span>{" "}
                      {selectedFish.temperature_range_c} °C
                    </p>
                    <p>
                      <span className="font-semibold">Salinity Range:</span>{" "}
                      {selectedFish.salinity_range}
                    </p>
                    <p>
                      <span className="font-semibold">Fishing Method:</span>{" "}
                      {selectedFish.fishing_method}
                    </p>
                    <p>
                      <span className="font-semibold">Commercial Value:</span>{" "}
                      {selectedFish.commercial_value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow rounded-2xl border border-slate-100 bg-white/90">
                <CardContent className="p-4 text-sky-600">
                  {loading ? "Fetching data..." : "Enter a query to explore species"}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuerySearch;
