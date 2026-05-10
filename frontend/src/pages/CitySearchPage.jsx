import { useEffect, useState } from 'react';
import { Search, MapPin, Star, DollarSign, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardBody, Input, Spinner } from '../components/ui';
import { citiesApi } from '../api';
import { formatCurrency } from '../utils';

export default function CitySearchPage() {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInitialCities();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const timer = setTimeout(() => searchCities(query), 300);
      return () => clearTimeout(timer);
    } else if (query.length === 0) {
      loadInitialCities();
    }
  }, [query]);

  const loadInitialCities = async () => {
    setLoading(true);
    try {
      const res = await citiesApi.list({ limit: 20 });
      setCities(res.data);
    } catch { toast.error('Failed to load cities'); }
    finally { setLoading(false); }
  };

  const searchCities = async (searchQuery) => {
    setLoading(true);
    try {
      const res = await citiesApi.list({ search: searchQuery, limit: 20 });
      setCities(res.data);
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  };

  const renderCostIndex = (index) => {
    const filled = Math.min(10, Math.round(index));
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <DollarSign key={i} className={`w-3 h-3 ${i <= filled ? 'text-primary' : 'text-text-secondary/30'}`} />
        ))}
      </div>
    );
  };

  const renderStars = (score) => {
    const filled = Math.min(5, Math.round(score / 2));
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`w-3 h-3 ${i <= filled ? 'text-warning fill-warning' : 'text-text-secondary/30'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary">Explore Cities</h1>
        <p className="text-text-secondary mt-1">Discover destinations for your next adventure</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cities by name, country, or region..."
          className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map((city) => (
            <Card key={city.id} hover className="overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 flex items-center justify-center">
                <Globe className="w-12 h-12 text-primary/40" />
              </div>
              <CardBody>
                <h3 className="text-lg font-display font-bold text-text-primary">{city.name}</h3>
                <p className="text-sm text-text-secondary flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {city.country} {city.region && `• ${city.region}`}
                </p>
                {city.description && (
                  <p className="text-sm text-text-secondary mt-2 line-clamp-2">{city.description}</p>
                )}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-text-secondary mb-1">Cost Index</p>
                    {renderCostIndex(city.cost_index)}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-secondary mb-1">Popularity</p>
                    {renderStars(city.popularity_score)}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {!loading && cities.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-text-primary">No cities found</h3>
          <p className="text-text-secondary">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
