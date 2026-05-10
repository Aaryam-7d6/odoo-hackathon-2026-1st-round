import { Link, useLocation } from 'react-router-dom';
import { Map, Home, Search, Wallet, User, Plus, Package, FileText } from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/trips', icon: Map, label: 'My Trips' },
  { path: '/search', icon: Search, label: 'Search' },
  { path: '/budget', icon: Wallet, label: 'Budget' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-md border-t border-border z-40 md:hidden">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[56px] ${
              location.pathname === path
                ? 'text-primary'
                : 'text-text-secondary'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
