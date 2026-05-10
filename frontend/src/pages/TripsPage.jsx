import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Map, Calendar, Globe, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardBody, EmptyState, Spinner } from '../components/ui';
import { tripsApi } from '../api';
import { formatDateRange } from '../utils';

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

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

  const handleDelete = async (trip, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${trip.name}"? This cannot be undone.`)) return;
    setDeleting(trip.id);
    try {
      await tripsApi.delete(trip.id);
      setTrips((prev) => prev.filter((t) => t.id !== trip.id));
      toast.success('Trip deleted');
    } catch (err) {
      toast.error('Failed to delete trip');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-text-primary">My Trips</h1>
        <Link
          to="/trips/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-background rounded-xl font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No trips yet"
          description="Plan your first adventure! Click the button above to create a new trip."
          action={
            <Link
              to="/trips/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-background rounded-xl font-semibold"
            >
              <Plus className="w-5 h-5" />
              Create Trip
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <Link key={trip.id} to={`/trips/${trip.id}`}>
              <Card hover className="h-full relative group">
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-8">
                      <h3 className="text-lg font-semibold text-text-primary truncate">{trip.name}</h3>
                      {trip.description && (
                        <p className="text-sm text-text-secondary mt-1 line-clamp-2">{trip.description}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDelete(trip, e)}
                      disabled={deleting === trip.id}
                      className="absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-error/10 text-text-secondary hover:text-error transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {formatDateRange(trip.start_date, trip.end_date)}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-lg ${trip.is_public ? 'bg-success/20 text-success' : 'bg-surface-2 text-text-secondary'}`}>
                      {trip.is_public ? 'Public' : 'Private'}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {trip.stops?.length || 0} stop{(trip.stops?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
