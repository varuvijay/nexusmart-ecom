import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Menu } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-[13vh] right-5 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>
          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 rounded-md transition-colors",
                activeTab === 'dashboard' ? "bg-gray-700" : "hover:bg-gray-700"
              )}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('products');
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 rounded-md transition-colors",
                activeTab === 'products' ? "bg-gray-700" : "hover:bg-gray-700"
              )}
            >
              Products
            </button>
            <button
              onClick={() => {
                setActiveTab('orders');
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 rounded-md transition-colors",
                activeTab === 'orders' ? "bg-gray-700" : "hover:bg-gray-700"
              )}
            >
              Orders
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}