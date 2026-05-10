import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, X, Calendar, GripVertical, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardBody, Button, Input, Modal, EmptyState, Spinner } from '../components/ui';
import { tripsApi, citiesApi, activitiesApi } from '../api';

function SortableStopCard({ stop, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: stop.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center gap-3">
        <button {...attributes} {...listeners} className="p-1 cursor-grab text-text-secondary hover:text-text-primary">
          <GripVertical className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
          {stop.order_index + 1}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">{stop.city?.name}</h3>
          <p className="text-sm text-text-secondary">{stop.city?.country}</p>
          <div className="flex gap-2 mt-1">
            {stop.arrival_date && <span className="text-xs text-text-secondary">Arr: {stop.arrival_date}</span>}
            {stop.departure_date && <span className="text-xs text-text-secondary">Dep: {stop.departure_date}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onMoveUp(stop)} disabled={isFirst} className="p-1 hover:bg-surface-2 rounded disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
          <button onClick={() => onMoveDown(stop)} disabled={isLast} className="p-1 hover:bg-surface-2 rounded disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
          <button onClick={() => onDelete(stop)} className="p-1 hover:bg-error/10 text-text-secondary hover:text-error rounded"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

export default function ItineraryBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCityModal, setShowCityModal] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stopDates, setStopDates] = useState({ arrival_date: '', departure_date: '' });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => { loadTrip(); }, [id]);

  const loadTrip = async () => {
    try {
      const res = await tripsApi.get(id);
      setTrip(res.data);
    } catch { toast.error('Failed to load trip'); }
    finally { setLoading(false); }
  };

  const searchCities = async (query) => {
    setSearching(true);
    try {
      const res = await citiesApi.list({ search: query, limit: 20 });
      setCities(res.data);
    } catch { toast.error('Search failed'); }
    finally { setSearching(false); }
  };

  useEffect(() => {
    if (citySearch.length >= 2) {
      const timer = setTimeout(() => searchCities(citySearch), 300);
      return () => clearTimeout(timer);
    }
    setCities([]);
  }, [citySearch]);

  const addStop = async () => {
    if (!selectedCity) return;
    try {
      await tripsApi.addStop(id, { city_id: selectedCity.id, ...stopDates });
      toast.success(`Added ${selectedCity.name} to your trip`);
      setShowCityModal(false);
      setSelectedCity(null);
      setCitySearch('');
      setStopDates({ arrival_date: '', departure_date: '' });
      loadTrip();
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed to add stop'); }
  };

  const deleteStop = async (stop) => {
    if (!confirm(`Remove ${stop.city?.name} from your itinerary?`)) return;
    try {
      await tripsApi.deleteStop(stop.id);
      loadTrip();
      toast.success('Stop removed');
    } catch { toast.error('Failed to remove stop'); }
  };

  const moveStop = async (stop, direction) => {
    const stops = [...(trip.stops || [])];
    const idx = stops.findIndex(s => s.id === stop.id);
    if (direction === 'up' && idx > 0) {
      const newStops = arrayMove(stops, idx, idx - 1);
      const reorderData = newStops.map((s, i) => ({ id: s.id, order_index: i }));
      setTrip({ ...trip, stops: newStops });
      try {
        await tripsApi.reorderStops({ stops: reorderData });
      } catch { loadTrip(); }
    } else if (direction === 'down' && idx < stops.length - 1) {
      const newStops = arrayMove(stops, idx, idx + 1);
      const reorderData = newStops.map((s, i) => ({ id: s.id, order_index: i }));
      setTrip({ ...trip, stops: newStops });
      try {
        await tripsApi.reorderStops({ stops: reorderData });
      } catch { loadTrip(); }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-primary">Itinerary Builder</h1>
          <p className="text-text-secondary">{trip?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate(`/trips/${id}`)}>Back to Trip</Button>
          <Button onClick={() => setShowCityModal(true)}>
            <Plus className="w-4 h-4" /> Add Stop
          </Button>
        </div>
      </div>

      {(!trip?.stops || trip.stops.length === 0) ? (
        <EmptyState
          icon={Calendar}
          title="No stops yet"
          description="Add your first city to start building your itinerary."
          action={<Button onClick={() => setShowCityModal(true)}><Plus className="w-4 h-4" /> Add First City</Button>}
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-text-secondary mb-2">
            <span>{trip.stops.length} stop{trip.stops.length !== 1 ? 's' : ''}</span>
          </div>
          {trip.stops.map((stop, idx) => (
            <SortableStopCard
              key={stop.id}
              stop={stop}
              onDelete={deleteStop}
              onMoveUp={(s) => moveStop(s, 'up')}
              onMoveDown={(s) => moveStop(s, 'down')}
              isFirst={idx === 0}
              isLast={idx === trip.stops.length - 1}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showCityModal} onClose={() => { setShowCityModal(false); setSelectedCity(null); setCitySearch(''); }} title="Add City" size="lg">
        <div className="space-y-4">
          <Input
            label="Search cities"
            placeholder="Search by city or country..."
            value={citySearch}
            onChange={(e) => { setCitySearch(e.target.value); setSelectedCity(null); }}
          />
          {searching && <div className="flex justify-center py-4"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>}
          {cities.length > 0 && (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`w-full text-left p-3 rounded-xl border transition-colors ${
                    selectedCity?.id === city.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-surface-2'
                  }`}
                >
                  <p className="font-medium text-text-primary">{city.name}</p>
                  <p className="text-sm text-text-secondary">{city.country} {city.region && `• ${city.region}`}</p>
                </button>
              ))}
            </div>
          )}
          {selectedCity && (
            <div className="space-y-3 pt-2 border-t border-border">
              <p className="font-medium text-text-primary">Selected: {selectedCity.name}, {selectedCity.country}</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Arrival Date"
                  type="date"
                  value={stopDates.arrival_date}
                  onChange={(e) => setStopDates(prev => ({ ...prev, arrival_date: e.target.value }))}
                />
                <Input
                  label="Departure Date"
                  type="date"
                  value={stopDates.departure_date}
                  onChange={(e) => setStopDates(prev => ({ ...prev, departure_date: e.target.value }))}
                />
              </div>
              <Button onClick={addStop} className="w-full">Add to Itinerary</Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
