import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo/52-bazaar-logo.webp";

const NAV = [
  {
    section: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: "📊",
        path: "/admin/dashboard",
      },
    ],
  },
  {
    section: "Catalog",
    items: [
      {
        id: "category",
        label: "Category",
        icon: "🗂️",
        path: "/admin/categories",
      },
      {
        id: "product",
        label: "Product",
        icon: "📦",
        path: "/admin/products",
      },
    ],
  },
  {
    section: "Sales",
    items: [
      {
        id: "order",
        label: "Order",
        icon: "🛍️",
        badge: 12,
        path: "/admin/orders",
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: "📦",
        badge: 8,
        path: "/admin/inventory",
      },
      {
        id: "coupon",
        label: "Coupons",
        icon: "🎟️",
        path: "/admin/coupons",
      },
    ],
  },
  {
    section: "Settings",
    items: [
      {
        id: "customers",
        label: "Customers",
        icon: "👥",
        path: "/admin/customers",
      },
      {
        id: "settings",
        label: "Settings",
        icon: "⚙️",
        path: "/admin/settings",
      },
    ],
  },
];

export default function Sidebar({ collapsed, activeNav, onNavChange }) {
  const location = useLocation();
  const [openSubs, setOpenSubs] = useState({});

  // Auto-expand current section based on active path
  useEffect(() => {
    const currentItem = NAV.flatMap((section) => section.items).find(
      (item) => item.path === location.pathname,
    );
    if (currentItem && currentItem.sub) {
      setOpenSubs((prev) => ({ ...prev, [currentItem.id]: true }));
    }
  }, [location.pathname]);

  const toggleSub = (id) => {
    setOpenSubs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col z-50 transition-all duration-300 shadow-2xl ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-700/50 flex-shrink-0">
        {!collapsed ? (
          <Link to="/admin/dashboard" className="flex items-center group">
            <img
              src={Logo}
              alt="52bazaar Logo"
              className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-105"
            />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              52Bazaar
            </span>
          </Link>
        ) : (
          <Link to="/admin/dashboard" className="group">
            <img
              src={Logo}
              alt="52bazaar Logo"
              className="h-10 w-auto object-contain transition-all duration-300 group-hover:scale-110"
            />
          </Link>
        )}
      </div>

      {/* Navigation Container - No Scrollbar */}
      <div
        className="flex-1 overflow-y-auto py-4 px-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>
          {`
            .flex-1::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {NAV.map(({ section, items }) => (
          <div key={section} className="mb-6">
            {!collapsed && (
              <div className="px-3 mb-2">
                <p className="text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
                  {section}
                </p>
              </div>
            )}

            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.id}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      onNavChange(item.id);
                      if (item.sub) toggleSub(item.id);
                    }}
                    className={`
                      group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                      transition-all duration-200 ease-in-out
                      ${collapsed ? "justify-center" : ""}
                      ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    {/* Icon Container */}
                    <div
                      className={`
                      flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                      transition-all duration-200
                      ${
                        isActive(item.path)
                          ? "bg-white/20"
                          : "bg-gray-800/50 group-hover:bg-white/10"
                      }
                    `}
                    >
                      <span className="text-lg">{item.icon}</span>
                    </div>

                    {/* Label & Badge */}
                    {!collapsed && (
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        <span className="text-sm font-medium truncate">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className={`
                            ml-2 px-2 py-0.5 text-xs font-bold rounded-full
                            ${
                              isActive(item.path)
                                ? "bg-white/20 text-white"
                                : "bg-orange-500/20 text-orange-400"
                            }
                          `}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.sub && (
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ml-1 ${
                              openSubs[item.id] ? "rotate-90" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        )}
                      </div>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                        {item.label}
                        {item.badge && ` (${item.badge})`}
                      </div>
                    )}
                  </Link>

                  {/* Sub Menu */}
                  {item.sub && !collapsed && openSubs[item.id] && (
                    <div className="ml-11 mt-1 space-y-1">
                      {item.sub.map((subItem) => (
                        <Link
                          key={subItem}
                          to={`${item.path}/${subItem.toLowerCase().replace(/\s+/g, "-")}`}
                          className="block px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="flex-shrink-0 p-3 border-t border-gray-700/50">
        <div
          className={`
            flex items-center gap-3 p-2 rounded-xl cursor-pointer
            transition-all duration-200 hover:bg-white/10
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
              AD
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full"></div>
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                Admin User
              </p>
              <p className="text-gray-400 text-xs truncate">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
