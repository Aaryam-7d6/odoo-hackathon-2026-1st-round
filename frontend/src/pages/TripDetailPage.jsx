import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Calendar, Plus, Share2, Edit, ArrowLeft, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardBody, Spinner, EmptyState } from '../components/ui';
import { tripsApi } from '../api';
import { formatDateRange, getDaysBetween } from '../utils';

export default function TripDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [id]);

  const loadTrip = async () => {
    try {
      const res = await tripsApi.get(id);
      setTrip(res.data);
    } catch (err) {
      toast.error('Trip not found');
      navigate('/trips');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const res = await tripsApi.share(id);
      await navigator.clipboard.writeText(`${window.location.origin}/trip/share/${res.data.share_token}`);
      toast.success('Share link copied to clipboard!');
      setTrip((prev) => ({ ...prev, is_public: true, share_token: res.data.share_token }));
    } catch (err) {
      toast.error('Failed to generate share link');
    } finally {
      setSharing(false);
    }
  };

  if (loading) return <Spinner />;
  if (!trip) return null;

  const totalDays = getDaysBetween(trip.start_date, trip.end_date);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-surface rounded-lg transition-colors text-text-secondary hover:text-text-primary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-display font-bold text-text-primary">{trip.name}</h1>
          {trip.description && <p className="text-text-secondary mt-1">{trip.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/trips/${id}/itinerary`)} className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-background rounded-xl font-semibold transition-colors">
            <Edit className="w-4 h-4" />
            Build Itinerary
          </button>
          <button onClick={handleShare} disabled={sharing} className="p-2.5 hover:bg-surface-2 rounded-xl transition-colors text-text-secondary hover:text-text-primary">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-text-secondary">Dates</p>
              <p className="font-medium text-text-primary">{formatDateRange(trip.start_date, trip.end_date)}</p>
              {totalDays > 0 && <p className="text-xs text-text-secondary">{totalDays} day{totalDays !== 1 ? 's' : ''}</p>}
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-sm text-text-secondary">Stops</p>
              <p className="font-medium text-text-primary">{trip.stops?.length || 0} cities</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Share2 className="w-5 h-5 text-success" />
            <div>
              <p className="text-sm text-text-secondary">Visibility</p>
              <p className="font-medium text-text-primary">{trip.is_public ? 'Public' : 'Private'}</p>
            </div>
          </div>
        </Card>
      </div>

      {trip.share_token && (
        <Card className="p-5 bg-success/5 border-success/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium text-text-primary">Share Link Active</p>
                <p className="text-sm text-text-secondary">{window.location.origin}/trip/share/{trip.share_token}</p>
              </div>
            </div>
            <button onClick={() => navigate(`/trip/share/${trip.share_token}`)} className="text-success hover:text-success/80 text-sm font-medium">
              Preview
            </button>
          </div>
        </Card>
      )}

      <div>
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">Your Itinerary</h2>
        {trip.stops?.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No stops planned yet"
            description="Start building your itinerary by adding cities to visit."
            action={
              <Link to={`/trips/${id}/itinerary`} className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-background rounded-xl font-semibold">
                <Plus className="w-4 h-4" />
                Add First Stop
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {trip.stops?.map((stop, idx) => (
              <Card key={stop.id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary">{stop.city?.name}</h3>
                    <p className="text-sm text-text-secondary">{stop.city?.country}</p>
                  </div>
                  <div className="text-right text-sm text-text-secondary">
                    {stop.arrival_date && <p>{stop.arrival_date}</p>}
                    {stop.departure_date && <p>- {stop.departure_date}</p>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to={`/trips/${id}/itinerary`} className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2 hover:bg-surface-2/80 rounded-xl font-medium transition-colors">
          <MapPin className="w-4 h-4" />
          Itinerary Builder
        </Link>
        <Link to={`/budget/${id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2 hover:bg-surface-2/80 rounded-xl font-medium transition-colors">
          Budget & Costs
        </Link>
        <Link to={`/packing/${id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2 hover:bg-surface-2/80 rounded-xl font-medium transition-colors">
          Packing List
        </Link>
        <Link to={`/notes/${id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-surface-2 hover:bg-surface-2/80 rounded-xl font-medium transition-colors">
          Trip Notes
        </Link>
      </div>
    </div>
  );
}
