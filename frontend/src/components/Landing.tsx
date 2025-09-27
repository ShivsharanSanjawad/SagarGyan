import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Waves, 
  Database, 
  Brain, 
  BarChart3, 
  Search, 
  Eye, 
  Users,
  ArrowRight,
  Fish,
  Microscope,
  Map
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/input';

interface LandingPageProps {
  onLoginClick: () => void;
}

export const Landing: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [taxonomyInput, setTaxonomyInput] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [taxonomyResult, setTaxonomyResult] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTaxonomyDemo = async () => {
    if (!taxonomyInput.trim()) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const mockResults: Record<string, string> = {
        'sardinella longiceps': 
      "Family: Clupeidae\nGenus: Sardinella\nKingdom: Animalia\nPhylum: Chordata\nParent: Sardinella",
    'alectis indica': 
      "Family: Carangidae\nGenus: Alectis\nKingdom: Animalia\nPhylum: Chordata\nParent: Alectis",
    'indian mackerel': 
      "Family: Scombridae\nGenus: Rastrelliger\nKingdom: Animalia\nPhylum: Chordata\nParent: Rastrelliger",
      };
      
      const key = taxonomyInput.toLowerCase();
      const result = mockResults[key] || 
        `${taxonomyInput} - Species classification requires full platform access`;

      setTaxonomyResult(result);
      setIsProcessing(false);
    }, 1200);
  };

  const handleQueryDemo = async () => {
    if (!queryInput.trim()) return;
    
    setIsProcessing(true);
    setTimeout(() => {
      const randomResults = [
        'Red mullet: A small, colorful fish prized for its delicate flavor in Mediterranean cuisine.',
        'Sardines: Small, oily fish found in large schools, rich in omega-3 fatty acids.',
        'Indian billfish: A fast, elongated predator known for its long bill and impressive speed.'
      ];
      const result = randomResults[Math.floor(Math.random() * randomResults.length)];
      
      setQueryResult(result);
      setIsProcessing(false);
    }, 1000);
  };

  const features = [
    {
      icon: Database,
      title: 'Unified Data Platform',
      description: 'Access oceanographic, fisheries, and biodiversity data in one place',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Brain,
      title: 'AI Classification',
      description: 'Automated species identification and marine life classification',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'SST mapping, decision-making tools and predictive insights',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Eye,
      title: 'Data Visualization',
      description: 'Interactive 2D/3D visualizations and cross-domain analysis',
      color: 'text-teal-600 bg-teal-100'
    },
    {
      icon: Search,
      title: 'Smart Query Engine',
      description: 'Natural language queries for complex data retrieval',
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: Users,
      title: 'Collaborative Platform',
      description: 'Multi-role access for scientists, researchers and data injectors',
      color: 'text-indigo-600 bg-indigo-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <Waves className="h-8 w-8 text-blue-950" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">SagarGyaan</h1>
                <p className="text-sm text-slate-600">AI-Driven Ocean Data Platform</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition">
              Sign In
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            <h1 className="text-5xl font-bold text-slate-800 mb-6">
              Unified Ocean Intelligence
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Harness the power of AI to unlock insights from oceanographic, fisheries, 
              and molecular biodiversity data. Make informed decisions for marine conservation 
              and sustainable resource management.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-teal-500" onClick={() => window.location.href = '/login'}>
                Get Full Access
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Platform Features</h2>
            <p className="text-slate-600">Comprehensive tools for marine research and analysis</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`p-3 rounded-full ${feature.color} w-fit mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-800 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Try Our AI Features</h2>
            <p className="text-slate-600">Experience the power of our AI-driven analysis tools</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Taxonomy Classification Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Microscope className="h-5 w-5 mr-2 text-purple-600" />
                  Species Taxonomical Classification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Enter a marine species name to see AI-powered taxonomic classification
                  </p>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="e.g., sardinella longiceps, alectis indica..."
                      value={taxonomyInput}
                      onChange={(e) => setTaxonomyInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTaxonomyDemo()}/>
                    <Button 
                      onClick={handleTaxonomyDemo}
                      disabled={!taxonomyInput.trim() || isProcessing}>
                      {isProcessing ? 'Processing...' : 'Classify'}
                    </Button>
                  </div>
                  {taxonomyResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-start space-x-2">
                        <Fish className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-purple-800">Classification Result:</p>
                          <p className="text-sm text-purple-700 whitespace-pre-line">{taxonomyResult}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div className="text-xs text-slate-500">* Limited species query only</div>
                </div>
              </CardContent>
            </Card>

            {/* Query Engine Demo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-teal-600" />
                  Smart Query Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Ask questions about oceanographic data in natural language
                  </p>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="e.g., give me an indian ocean fish..."
                      value={queryInput}
                      onChange={(e) => setQueryInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleQueryDemo()}/>
                    <Button 
                      onClick={handleQueryDemo}
                      disabled={!queryInput.trim() || isProcessing}>
                      {isProcessing ? 'Searching...' : 'Query'}
                    </Button>
                  </div>
                  {queryResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-teal-50 p-4 rounded-lg border border-teal-200"
                    >
                      <div className="flex items-start space-x-2">
                        <Map className="h-5 w-5 text-teal-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-teal-800">Query Result:</p>
                          <p className="text-sm text-teal-700">{queryResult}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {/* <div className="text-xs text-slate-500">
                    * Demo version with random short descriptions
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-teal-400 mb-2">20+</div>
              <div className="text-slate-300">Datasets Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
              <div className="text-slate-300">Species Classified</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">3</div>
              <div className="text-slate-300">Active Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">91.3%</div>
              <div className="text-slate-300">AI Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}>
            <h2 className="text-4xl font-bold mb-6">
              Ready to Dive Deeper?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Access the full platform for analysing species, visualisation tools, 
              and comprehensive ocean data analysis.
            </p>
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/login'}
              className="bg-white text-teal-600 hover:bg-slate-100">
              Get Full Platform Access
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-slate-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Waves className="h-6 w-6 text-teal-400" />
                <span className="text-xl font-bold">SagarDnyan</span>
              </div>
              <p className="text-slate-300">
                AI-driven platform for comprehensive ocean data analysis and marine research.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Data Analytics</li>
                <li>Species Classification</li>
                <li>Visualization Tools</li>
                <li>Natural Language Querying</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-300">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Demo Link</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 SagarGyaan. Built for Smart India Hackathon 2025.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
