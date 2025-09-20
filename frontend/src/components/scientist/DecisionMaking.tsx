import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/Button';

export const DecisionMaking: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-amber-200 bg-amber-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-600';
      case 'amber': return 'text-amber-600';
      case 'green': return 'text-green-600';
      case 'blue': return 'text-blue-600';
      default: return 'text-gray-600';
    }
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
                selectedOption === 'abundance'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
              onClick={() => setSelectedOption('abundance')}>
              Fish Abundance
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === 'temperature'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
              onClick={() => setSelectedOption('temperature')}>
              Temperature
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 ${
                selectedOption === 'migration'
                  ? 'border-sky-500 text-sky-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-sky-500'
              }`}
              onClick={() => setSelectedOption('migration')}>
              Migration Map
            </Button>
          </div>

          {/* Show Visual Only If Option Selected */}
      {selectedOption && (
      <div className="mt-6 border rounded-lg bg-gray-50 p-6 text-center">
        {selectedOption === "abundance" && (
          <img
            src="/fish.png"
            alt="Fish Abundance"
            className="mx-auto max-h-96 rounded shadow"
          />
        )}
        {selectedOption === "temperature" && (
          <img
            src="/temperature.png"
            alt="Sea Surface Temperature"
            className="mx-auto max-h-96 rounded shadow"
          />
        )}
        {selectedOption === "migration" && (
          <img
            src="/migration.png"
            alt="Migration Map"
            className="mx-auto max-h-96 rounded shadow"
          />
        )}
      </div>
      )}
        </CardContent>
      </Card>
    </div>
  );
};
