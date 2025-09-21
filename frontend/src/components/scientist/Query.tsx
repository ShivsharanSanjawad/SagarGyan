import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface FishData {
  genus: string;
  species: string;
  common_name: string;
  family: string;
  description: string;
}

export const QuerySearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FishData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/elasticsearch?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: FishData[] = await response.json();
      console.log("Search results:", data);
      setResults(data);
      setSelectedIndex(data.length ? 0 : null); // auto-select first result
    } catch (err) {
      console.error("Error fetching search results:", err);
      setResults([]);
      setSelectedIndex(null);
    }
  };

  const selectedFish = selectedIndex !== null ? results[selectedIndex] : null;

  return (
    <div className="flex h-screen w-full bg-gray-50 p-4 space-x-4">
      {/* Left: Search & results list */}
      <div className="flex-1">
        <Card className="shadow-lg border border-gray-200 mb-4">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Scientific Query Engine
            </h1>
            <p className="text-sm text-gray-500 mb-4">
              Use this search to query scientific research and analysis results.
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter your query..."
                className="flex-1 rounded-lg border-gray-300 focus:ring-sky-500 focus:border-sky-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-6 transition"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results list */}
        {results.length > 0 && (
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Results</h2>
              <ul>
                {results.map((fish, idx) => (
                  <li
                    key={idx}
                    className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${idx === selectedIndex ? "bg-sky-100" : ""
                      }`}
                    onClick={() => setSelectedIndex(idx)}
                  >
                    {fish.common_name} ({fish.genus} {fish.species})
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right: Informatics box */}
      <div className="w-1/3">
        {selectedFish ? (
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-2">{selectedFish.common_name}</h2>
              <p>
                <span className="font-semibold">Genus:</span> {selectedFish.genus}
              </p>
              <p>
                <span className="font-semibold">Species:</span> {selectedFish.species}
              </p>
              <p>
                <span className="font-semibold">Family:</span> {selectedFish.family}
              </p>
              <p className="mt-2">{selectedFish.description}</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-4 text-gray-500">Select a fish to see details</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
