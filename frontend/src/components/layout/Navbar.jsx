import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Map, Search, Wallet, Package, FileText, Home } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { mobileNavOpen, toggleMobileNav } = useUIStore();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/trips', icon: Map, label: 'My Trips' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/budget', icon: Wallet, label: 'Budget' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-surface/80 backdrop-blur-md border-b border-border z-40 px-4">
        <div className="flex items-center justify-between h-full max-w-screen-xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <img src="/travel-poopm.png" alt="Traveloop" className="w-10 h-10 rounded-xl" />
            <span className="text-xl font-display font-bold text-primary">Traveloop</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.slice(0, 4).map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-text-primary">{user.name}</span>
                  <span className="text-xs text-text-secondary">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-surface-2 rounded-lg transition-colors text-text-secondary hover:text-error"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-background rounded-xl font-semibold text-sm transition-colors"
              >
                Sign In
              </Link>
            )}
            <button
              onClick={toggleMobileNav}
              className="md:hidden p-2 hover:bg-surface-2 rounded-lg transition-colors text-text-secondary"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-30 md:hidden pt-16">
          <div className="absolute inset-0 bg-black/40" onClick={toggleMobileNav} />
          <div className="absolute top-16 left-0 right-0 bg-surface border-b border-border p-4 animate-fade-in">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                onClick={toggleMobileNav}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  location.pathname === path
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
