import StatCard from './StatCard';

export default function DashboardOverview({ stats }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Orders" value={stats.totalOrders} color="blue" />
        <StatCard title="Total Merchants" value={stats.totalMerchants} color="green" />
        <StatCard title="Total Customers" value={stats.totalCustomers} color="purple" />
        <StatCard title="Pending Products" value={stats.pendingProducts} color="yellow" />
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="bg-white shadow rounded-lg p-6">
          {/* Recent activity would go here */}
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  );
}