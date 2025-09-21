import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const QuerySearch: React.FC = () => {
  return (
    <div className="flex h-screen w-auto bg-gray-50">
      <Card className="w-full max-w-2xl shadow-lg border border-gray-200">
        <CardContent className="p-8">
          {/* Title & Note (Top-Left) */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Scientific Query Engine
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Use this search to query scientific research and analysis results.
            </p>
          </div>

          {/* Search Bar (Below) */}
          <div className="flex space-x-2">
            <Input
              placeholder="Enter your query..."
              className="flex-1 rounded-lg border-gray-300 focus:ring-sky-500 focus:border-sky-500"
            />
            <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-6 transition">
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
