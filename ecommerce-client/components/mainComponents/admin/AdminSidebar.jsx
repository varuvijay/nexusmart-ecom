import { cn } from '@/lib/utils';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="mt-6">
        <div 
          className={cn(
            "px-6 py-3 cursor-pointer hover:bg-gray-100",
            activeTab === 'dashboard' && "bg-gray-200 border-l-4 border-blue-500"
          )}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </div>
        <div 
          className={cn(
            "px-6 py-3 cursor-pointer hover:bg-gray-100",
            activeTab === 'products' && "bg-gray-200 border-l-4 border-blue-500"
          )}
          onClick={() => setActiveTab('products')}
        >
          Products Approval
        </div>
        <div 
          className={cn(
            "px-6 py-3 cursor-pointer hover:bg-gray-100",
            activeTab === 'orders' && "bg-gray-200 border-l-4 border-blue-500"
          )}
          onClick={() => setActiveTab('orders')}
        >
          Orders Management
        </div>
      </nav>
    </div>
  );
}