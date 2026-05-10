import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, Plus, ArrowRight, TrendingUp, Globe, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardBody, EmptyState } from '../components/ui';
import { tripsApi } from '../api';
import useAuthStore from '../store/authStore';
import { formatDateRange } from '../utils';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const res = await tripsApi.list();
      setTrips(res.data);
    } catch (err) {
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const upcomingTrips = trips.filter(t => t.start_date && new Date(t.start_date) >= new Date()).slice(0, 3);
  const recentTrips = trips.slice(0, 6);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary">
            Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}
          </h1>
          <p className="text-text-secondary mt-1">Where to next on your adventure?</p>
        </div>
        <Link
          to="/trips/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-background rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Trip
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Map className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold text-text-primary">Total Trips</span>
          </div>
          <p className="text-3xl font-display font-bold text-primary">{trips.length}</p>
        </div>
        <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 border border-secondary/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-6 h-6 text-secondary" />
            <span className="text-lg font-semibold text-text-primary">Upcoming</span>
          </div>
          <p className="text-3xl font-display font-bold text-secondary">{upcomingTrips.length}</p>
        </div>
        <div className="bg-gradient-to-br from-success/20 to-success/5 border border-success/20 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-success" />
            <span className="text-lg font-semibold text-text-primary">Countries</span>
          </div>
          <p className="text-3xl font-display font-bold text-success">
            {new Set(trips.flatMap(t => t.stops?.map(s => s.city?.country) || []).filter(Boolean)).size || 0}
          </p>
        </div>
      </div>

      {trips.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No trips yet"
          description="Start planning your next adventure! Create your first trip and begin exploring destinations."
          action={
            <Link
              to="/trips/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-background rounded-xl font-semibold transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create Your First Trip
            </Link>
          }
        />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-text-primary">Your Trips</h2>
            <Link to="/trips" className="text-primary hover:text-primary-dark text-sm font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentTrips.map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}`}>
                <Card hover className="h-full">
                  <CardBody>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">{trip.name}</h3>
                        {trip.description && (
                          <p className="text-sm text-text-secondary mt-1 line-clamp-2">{trip.description}</p>
                        )}
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-lg ${trip.is_public ? 'bg-success/20 text-success' : 'bg-surface-2 text-text-secondary'}`}>
                        {trip.is_public ? 'Public' : 'Private'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateRange(trip.start_date, trip.end_date)}
                      </span>
                    </div>
                    {trip.stops?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-xs text-text-secondary">
                          {trip.stops.length} stop{trip.stops.length !== 1 ? 's' : ''} planned
                        </p>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-border p-6">
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/trips/create" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-2 hover:bg-surface-2/80 transition-colors text-center">
            <Plus className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">New Trip</span>
          </Link>
          <Link to="/search" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-2 hover:bg-surface-2/80 transition-colors text-center">
            <Globe className="w-6 h-6 text-secondary" />
            <span className="text-sm font-medium">Search Cities</span>
          </Link>
          <Link to="/trips" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-2 hover:bg-surface-2/80 transition-colors text-center">
            <Map className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">My Trips</span>
          </Link>
          <Link to="/budget" className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-2 hover:bg-surface-2/80 transition-colors text-center">
            <TrendingUp className="w-6 h-6 text-success" />
            <span className="text-sm font-medium">Budget</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
