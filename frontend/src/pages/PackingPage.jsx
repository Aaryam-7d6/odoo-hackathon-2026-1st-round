import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, RotateCcw, Package, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardBody, Button, Input, Modal, Select, EmptyState, Spinner } from '../components/ui';
import { packingApi, tripsApi } from '../api';
import { packingCategories } from '../utils/constants';

export default function PackingPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(tripId || null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Clothing' });
  const [updating, setUpdating] = useState(null);

  useEffect(() => { loadTrips(); }, []);

  useEffect(() => {
    if (selectedTripId) loadItems();
  }, [selectedTripId]);

  const loadTrips = async () => {
    try {
      const res = await tripsApi.list();
      setTrips(res.data);
    } catch { toast.error('Failed to load trips'); }
  };

  const loadItems = async () => {
    if (!selectedTripId) return;
    setLoading(true);
    try {
      const res = await packingApi.list(selectedTripId);
      setItems(res.data);
    } catch { toast.error('Failed to load packing list'); }
    finally { setLoading(false); }
  };

  const addItem = async () => {
    if (!newItem.name.trim()) return;
    try {
      const res = await packingApi.add(selectedTripId, newItem);
      setItems([...items, res.data]);
      setShowAddModal(false);
      setNewItem({ name: '', category: 'Clothing' });
      toast.success('Item added');
    } catch { toast.error('Failed to add item'); }
  };

  const toggleItem = async (item) => {
    setUpdating(item.id);
    const originalItems = [...items];
    const toggled = items.map(i => i.id === item.id ? { ...i, is_packed: !i.is_packed } : i);
    setItems(toggled);
    try {
      await packingApi.toggle(item.id, { is_packed: !item.is_packed });
    } catch {
      setItems(originalItems);
      toast.error('Failed to update');
      setUpdating(null);
    }
  };

  const deleteItem = async (item) => {
    try {
      await packingApi.delete(item.id);
      setItems(items.filter(i => i.id !== item.id));
      toast.success('Item removed');
    } catch { toast.error('Failed to remove item'); }
  };

  const resetAll = async () => {
    const packed = items.filter(i => i.is_packed);
    if (packed.length === 0) return;
    try {
      for (const item of packed) {
        await packingApi.toggle(item.id, { is_packed: false });
      }
      loadItems();
      toast.success('All items unpacked');
    } catch { toast.error('Failed to reset'); }
  };

  const packedCount = items.filter(i => i.is_packed).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  const categorizedItems = packingCategories.reduce((acc, cat) => {
    acc[cat] = items.filter(i => i.category === cat);
    return acc;
  }, {});

  if (!tripId && trips.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-text-primary">Packing List</h1>
        <div className="text-center py-12">
          <p className="text-text-secondary">Create a trip first to manage your packing list</p>
          <Button onClick={() => navigate('/trips/create')} className="mt-4">Create Trip</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-display font-bold text-text-primary">Packing List</h1>
        {trips.length > 0 && !tripId && (
          <Select
            value={selectedTripId || ''}
            onChange={(e) => setSelectedTripId(Number(e.target.value))}
            options={trips.map(t => ({ value: t.id, label: t.name }))}
            className="sm:w-48"
          />
        )}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {packedCount} / {totalCount} items packed
            </p>
          </div>
          <Button size="sm" variant="ghost" onClick={resetAll} disabled={packedCount === 0}>
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
        <div className="w-full h-3 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </Card>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Packing list is empty"
          description="Add items to make sure you don't forget anything for your trip."
          action={<Button onClick={() => setShowAddModal(true)}><Plus className="w-4 h-4" /> Add Item</Button>}
        />
      ) : (
        <div className="space-y-4">
          {packingCategories.map((cat) => {
            const catItems = categorizedItems[cat];
            if (catItems.length === 0) return null;
            return (
              <Card key={cat}>
                <CardBody>
                  <h3 className="text-lg font-display font-semibold text-text-primary mb-3">{cat}</h3>
                  <div className="space-y-2">
                    {catItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-2 transition-colors group">
                        <button
                          onClick={() => toggleItem(item)}
                          disabled={updating === item.id}
                          className="flex-shrink-0"
                        >
                          {item.is_packed ? (
                            <CheckSquare className="w-5 h-5 text-success" />
                          ) : (
                            <Square className="w-5 h-5 text-text-secondary" />
                          )}
                        </button>
                        <span className={`flex-1 ${item.is_packed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                          {item.name}
                        </span>
                        <button
                          onClick={() => deleteItem(item)}
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-error/10 text-text-secondary hover:text-error rounded transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            );
          })}
          <Button onClick={() => setShowAddModal(true)} variant="outline" className="w-full">
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      )}

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Packing Item" size="sm">
        <div className="space-y-4">
          <Input
            label="Item Name"
            placeholder="e.g., Passport, Charger, Sunscreen"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            error={!newItem.name.trim() ? 'Item name is required' : ''}
          />
          <Select
            label="Category"
            value={newItem.category}
            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            options={packingCategories.map(c => ({ value: c, label: c }))}
          />
          <Button onClick={addItem} className="w-full" disabled={!newItem.name.trim()}>
            Add to List
          </Button>
        </div>
      </Modal>
    </div>
  );
}
