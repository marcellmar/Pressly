import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { globalSearch } from '../services/search';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Leaf, 
  ChevronRight, 
  MapPin, 
  Heart,
  Filter,
  Loader 
} from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'All';
  
  const [results, setResults] = useState({
    designs: [],
    producers: [],
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category);

  const categories = [
    { name: 'All', icon: <Filter className="w-4 h-4" /> },
    { name: 'T-Shirts', icon: <Filter className="w-4 h-4" /> },
    { name: 'Business Cards', icon: <Filter className="w-4 h-4" /> },
    { name: 'Posters', icon: <Filter className="w-4 h-4" /> },
    { name: 'Eco-Friendly', icon: <Leaf className="w-4 h-4" /> }
  ];

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const searchResults = await globalSearch(query, { category: selectedCategory });
        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', err);
        setError('An error occurred while searching. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {query ? `Search results for "${query}"` : 'Search Pressly'}
        </h1>
        <p className="text-gray-600">
          {results.total > 0 
            ? `Found ${results.total} results`
            : loading 
              ? 'Searching...' 
              : query 
                ? 'No results found. Try a different search term or browse by category.'
                : 'Enter a search term to find designs, producers, or services.'}
        </p>
      </div>

      {/* Category filters */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Filter by category:</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryChange(cat.name)}
              className={`flex items-center px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Designs Section */}
          {results.designs.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Designs ({results.designs.length})</h2>
                <Link to="/designs" className="text-blue-600 hover:underline flex items-center">
                  See all designs <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.designs.map((design) => (
                  <Link to={`/designs/${design.id}`} key={design.id}>
                    <div className="group">
                      <div className="aspect-square overflow-hidden rounded-lg mb-2 relative bg-gray-100">
                        {design.imageUrl ? (
                          <img
                            src={design.imageUrl}
                            alt={design.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No image
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2">
                          <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                            <Heart className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">{design.title}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">{design.designer || 'Unknown designer'}</span>
                        <span className="font-semibold">{design.price || '$--'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Producers Section */}
          {results.producers.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Print Producers ({results.producers.length})</h2>
                <Link to="/producers" className="text-blue-600 hover:underline flex items-center">
                  See all producers <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.producers.map(producer => (
                  <Card key={producer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-semibold">{producer.name}</h3>
                        <Badge className="bg-blue-100 text-blue-800 font-medium">
                          <MapPin className="w-3 h-3 mr-1" /> {producer.location}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{producer.description}</p>
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm flex items-center">
                            <Leaf className="w-4 h-4 text-green-500 mr-1" /> Sustainability Score
                          </span>
                          <span className="font-semibold">{producer.sustainabilityScore}/100</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              producer.sustainabilityScore > 90
                                ? 'bg-green-500'
                                : producer.sustainabilityScore > 75
                                ? 'bg-blue-500'
                                : 'bg-yellow-500'
                            }`}
                            style={{ width: `${producer.sustainabilityScore}%` }}
                          ></div>
                        </div>
                      </div>
                      {producer.services && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-700 font-medium mb-2">Services:</p>
                          <div className="flex flex-wrap gap-2">
                            {producer.services.map(service => (
                              <Badge key={service} className="bg-gray-100 text-gray-800">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Link to={`/producers/${producer.id}`} className="inline-flex items-center text-blue-600 hover:underline">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {results.total === 0 && query && !loading && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any designs or producers matching "{query}".
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/designs">
                  <Button size="lg" variant="outline">Browse Designs</Button>
                </Link>
                <Link to="/producers">
                  <Button size="lg">View All Producers</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;