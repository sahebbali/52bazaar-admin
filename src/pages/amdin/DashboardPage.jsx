import SalesChart from "./../../components/dashboard/SalesChart";
import TopCategories from "./../../components/dashboard/TopCategories";
import OrdersTable from "./../../components/dashboard/OrdersTable";
import StatCard from "./../../components/dashboard/StatCard";

const STATS = [
  {
    icon: "💰",
    label: "Total Revenue",
    value: "$24,580",
    change: "12.5% vs last month",
    up: true,
    iconBg: "bg-green-100",
  },
  {
    icon: "🛍️",
    label: "Total Orders",
    value: "1,284",
    change: "8.2% vs last month",
    up: true,
    iconBg: "bg-yellow-100",
  },
  {
    icon: "👥",
    label: "Customers",
    value: "3,921",
    change: "5.1% vs last month",
    up: true,
    iconBg: "bg-blue-100",
  },
  {
    icon: "📦",
    label: "Products",
    value: "486",
    change: "2 out of stock",
    up: false,
    iconBg: "bg-red-100",
  },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-start justify-between mb-7 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Welcome back, Admin! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-(--color-primary) bg-white border border-gray-200 hover:border-green-400 hover:bg-green-50 rounded-xl transition-all">
            📥 Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-(--color-primary) hover:bg-(--color-hover-primary) rounded-xl shadow-md shadow-green-900/20 transition-all">
            ➕ Add Product
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Chart + Categories */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="col-span-2">
          <SalesChart />
        </div>
        <div className="col-span-1">
          <TopCategories />
        </div>
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
