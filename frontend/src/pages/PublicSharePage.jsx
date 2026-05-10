import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Globe, Calendar, MapPin, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardBody, Spinner } from '../components/ui';
import { tripsApi } from '../api';
import { formatDateRange } from '../utils';

export default function PublicSharePage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrip();
  }, [token]);

  const loadTrip = async () => {
    try {
      const res = await tripsApi.getShared(token);
      setTrip(res.data);
    } catch {
      toast.error('Trip not found or not shared');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md p-8 text-center">
          <Globe className="w-16 h-16 text-text-secondary/30 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-text-primary mb-2">Trip Not Found</h1>
          <p className="text-text-secondary">This trip may not exist or has not been shared.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center mb-8">
          <img src="/travel-poopm.png" alt="Traveloop" className="h-16 w-auto object-contain mx-auto mb-4" />
          <h1 className="text-4xl font-display font-bold text-primary mb-2">Traveloop</h1>
          <p className="text-text-secondary">Shared Itinerary</p>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">{trip.name}</h2>
          {trip.description && <p className="text-text-secondary mb-4">{trip.description}</p>}
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDateRange(trip.start_date, trip.end_date)}
            </span>
          </div>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-xl font-display font-bold text-text-primary mb-4">Itinerary</h3>
            {trip.stops?.length === 0 ? (
              <p className="text-text-secondary text-center py-8">No stops in this itinerary yet.</p>
            ) : (
              <div className="space-y-4">
                {trip.stops?.map((stop, idx) => (
                  <div key={stop.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-text-primary">{stop.city?.name}</h4>
                      <p className="text-sm text-text-secondary">{stop.city?.country}</p>
                      <div className="flex gap-3 mt-1 text-xs text-text-secondary">
                        {stop.arrival_date && <span>Arr: {stop.arrival_date}</span>}
                        {stop.departure_date && <span>Dep: {stop.departure_date}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <div className="text-center text-sm text-text-secondary">
          <p>Powered by</p>
          <a href="/" className="text-primary hover:text-primary-dark font-semibold">Traveloop</a>
        </div>
      </div>
    </div>
  );
}
