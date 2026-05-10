import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input, Textarea } from '../components/ui';
import { tripsApi } from '../api';

const createTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required').max(255),
  description: z.string().max(1000).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_public: z.boolean().default(false),
});

export default function CreateTripPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createTripSchema),
    defaultValues: { is_public: false },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await tripsApi.create(data);
      toast.success('Trip created successfully!');
      navigate(`/trips/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-3xl font-display font-bold text-text-primary mb-6">Create New Trip</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl border border-border p-6 space-y-5">
        <Input
          {...register('name')}
          label="Trip Name"
          placeholder="e.g., Summer in Europe 2026"
          error={errors.name?.message}
        />

        <Textarea
          {...register('description')}
          label="Description"
          placeholder="Describe your dream trip..."
          rows={3}
          error={errors.description?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="text-sm font-medium text-text-secondary block mb-1.5">Start Date</label>
            <Calendar className="absolute left-4 top-[46px] w-5 h-5 text-text-secondary pointer-events-none" />
            <input
              {...register('start_date')}
              type="date"
              className="w-full pl-12 pr-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="relative">
            <label className="text-sm font-medium text-text-secondary block mb-1.5">End Date</label>
            <Calendar className="absolute left-4 top-[46px] w-5 h-5 text-text-secondary pointer-events-none" />
            <input
              {...register('end_date')}
              type="date"
              className="w-full pl-12 pr-4 py-2.5 bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            {...register('is_public')}
            type="checkbox"
            className="w-5 h-5 rounded border-border bg-surface text-primary focus:ring-primary/50"
          />
          <div>
            <span className="font-medium text-text-primary">Make trip public</span>
            <p className="text-sm text-text-secondary">Allow others to view your itinerary via a shared link</p>
          </div>
        </label>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create Trip
          </Button>
        </div>
      </form>
    </div>
  );
}
