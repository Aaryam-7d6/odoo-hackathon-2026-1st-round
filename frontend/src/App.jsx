import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout';
import { PageLoader } from './components/ui';
import { PrivateRoute, PublicRoute } from './router/PrivateRoute';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const TripsPage = lazy(() => import('./pages/TripsPage'));
const CreateTripPage = lazy(() => import('./pages/CreateTripPage'));
const TripDetailPage = lazy(() => import('./pages/TripDetailPage'));
const ItineraryBuilderPage = lazy(() => import('./pages/ItineraryBuilderPage'));
const CitySearchPage = lazy(() => import('./pages/CitySearchPage'));
const BudgetPage = lazy(() => import('./pages/BudgetPage'));
const PackingPage = lazy(() => import('./pages/PackingPage'));
const NotesPage = lazy(() => import('./pages/NotesPage'));
const PublicSharePage = lazy(() => import('./pages/PublicSharePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' },
          success: { iconTheme: { primary: '#10b981', secondary: '#f8fafc' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#f8fafc' } },
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicRoute><LoginPage /></PublicRoute>} path="/login" />
          <Route element={<PublicRoute><RegisterPage /></PublicRoute>} path="/register" />
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route element={<DashboardPage />} path="/" />
            <Route element={<TripsPage />} path="/trips" />
            <Route element={<CreateTripPage />} path="/trips/create" />
            <Route element={<TripDetailPage />} path="/trips/:id" />
            <Route element={<ItineraryBuilderPage />} path="/trips/:id/itinerary" />
            <Route element={<CitySearchPage />} path="/search" />
            <Route element={<BudgetPage />} path="/budget" />
            <Route element={<BudgetPage />} path="/budget/:tripId" />
            <Route element={<PackingPage />} path="/packing" />
            <Route element={<PackingPage />} path="/packing/:tripId" />
            <Route element={<NotesPage />} path="/notes/:tripId" />
            <Route element={<ProfilePage />} path="/profile" />
          </Route>
          <Route element={<PublicSharePage />} path="/trip/share/:token" />
          <Route path="*" element={<div className="p-8 text-center"><h1 className="text-2xl font-display">404 — Page Not Found</h1></div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
