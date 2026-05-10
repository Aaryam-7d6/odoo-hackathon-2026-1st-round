import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button, Input } from '../components/ui';
import { authApi } from '../api';
import useAuthStore from '../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      const user = { id: res.data.user_id, email: res.data.email, name: res.data.name };
      login(user, res.data.access_token);
      toast.success('Welcome back to Traveloop!');
      window.location.href = '/';
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed. Please check your credentials and try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/travel-poopm.png" alt="Traveloop" className="w-20 h-20 rounded-2xl mx-auto mb-4" />
          <h1 className="text-4xl font-display font-bold text-primary mb-2">Traveloop</h1>
          <p className="text-text-secondary">Your personalized travel planner</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-2xl border border-border p-6 space-y-5">
          <h2 className="text-2xl font-display font-bold text-text-primary text-center">Welcome Back</h2>
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <Input
              {...register('email')}
              type="email"
              placeholder="Email address"
              className="pl-12"
              error={errors.email?.message}
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="pl-12 pr-12"
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Sign In
          </Button>

          <p className="text-center text-text-secondary text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
