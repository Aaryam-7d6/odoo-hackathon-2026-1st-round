import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-20 md:pb-6 px-4">
        <div className="max-w-screen-xl mx-auto py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
