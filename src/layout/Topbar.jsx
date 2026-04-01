import { useState } from "react";

const BREADCRUMBS = {
  dashboard: ["Admin", "Dashboard"],
  category: ["Admin", "Catalog", "Category"],
  product: ["Admin", "Catalog", "Product"],
  order: ["Admin", "Sales", "Order"],
  inventory: ["Admin", "Sales", "Inventory"],
  coupon: ["Admin", "Sales", "Coupons"],
  customers: ["Admin", "Customers"],
  settings: ["Admin", "Settings"],
};

export default function Topbar({ collapsed, onToggle, activeNav }) {
  const [searchVal, setSearchVal] = useState("");
  const crumbs = BREADCRUMBS[activeNav] || ["Admin", "Dashboard"];

  return (
    <header
      className="fixed top-0 right-0 z-40 h-16 bg-white border-b border-green-100 flex items-center gap-4 px-6 transition-all duration-300"
      style={{ left: collapsed ? "64px" : "248px" }}
    >
      {/* Hamburger */}
      <button
        onClick={onToggle}
        className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-600 hover:text-white text-green-700 flex items-center justify-center transition-all duration-200 flex-shrink-0 text-base"
        title="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-400">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i < crumbs.length - 1 ? (
              <>
                <span className="hover:text-green-600 cursor-pointer transition-colors">
                  {c}
                </span>
                <span className="text-gray-300 text-xs">›</span>
              </>
            ) : (
              <strong className="text-gray-800 font-semibold">{c}</strong>
            )}
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="ml-auto flex items-center gap-2 bg-gray-50 border border-gray-200 hover:border-green-400 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 rounded-xl px-3 py-2 w-60 transition-all">
        <span className="text-gray-400 text-sm">🔍</span>
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search products, orders…"
          className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full font-[Sora,sans-serif]"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <ActionBtn icon="🔔" badge />
        <ActionBtn icon="💬" />
        <ActionBtn icon="🔄" />

        {/* User chip */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 hover:border-green-400 hover:bg-green-50 rounded-xl cursor-pointer transition-all ml-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-xs font-bold text-white">
            AD
          </div>
          <span className="text-sm font-semibold text-gray-800">Admin</span>
          <span className="text-[10px] text-gray-400">▾</span>
        </div>
      </div>
    </header>
  );
}

function ActionBtn({ icon, badge }) {
  return (
    <button className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-green-50 hover:text-green-700 text-gray-500 flex items-center justify-center transition-all text-base">
      {icon}
      {badge && (
        <span className="absolute top-1.5 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
}
