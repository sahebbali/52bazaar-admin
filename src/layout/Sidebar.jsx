import { useEffect, useState } from "react";
import Logo from "../assets/logo/52-bazaar-logo.webp";
import { Link, useLocation } from "react-router-dom";

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
        // sub: ["All Categories", "Add Category", "Sub Categories"],
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
        sub: ["All Orders", "Pending", "Processing", "Delivered", "Returns"],
      },
      { id: "coupon", label: "Coupons", icon: "🎟️" },
    ],
  },
  {
    section: "Settings",
    items: [
      { id: "customers", label: "Customers", icon: "👥" },
      { id: "settings", label: "Settings", icon: "⚙️" },
    ],
  },
];

export default function Sidebar({ collapsed, activeNav, onNavChange }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);
  console.log("Current path:", location.pathname);
  const currentMainNav = location.pathname;

  const [openSubs, setOpenSubs] = useState({ order: true });
  console.log("Active Nav:", activeNav, "Open Subs:", openSubs);

  const toggleSub = (id) =>
    setOpenSubs((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-(--color-primary) flex flex-col z-50 transition-all duration-300 ${
        collapsed ? "w-16" : "w-62"
      }`}
      style={{ width: collapsed ? "64px" : "248px" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-10 py-4 border-b border-white/10 flex-shrink-0">
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="hidden lg:flex items-center">
              <Link to="/admin/dashboard" className="flex items-center group">
                <img
                  src={Logo}
                  alt="52bazaar Logo"
                  className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto scrollbar-hide">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            {!collapsed && (
              <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold px-3 pt-4 pb-1">
                {section}
              </p>
            )}
            {collapsed && <div className="my-2 border-t border-white/10" />}

            {items.map((item) => (
              <div key={item.id}>
                <Link
                  to={item.path}
                  onClick={() => {
                    onNavChange(item.id);
                    if (item.sub) toggleSub(item.id);
                  }}
                  className={`w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 text-left group
                    ${
                      activeNav === item.id
                        ? "bg-green-500 text-white shadow-lg shadow-green-900/40"
                        : "text-white/60 hover:bg-white/8 hover:text-white"
                    }
                    ${collapsed ? "justify-center" : ""}
                  `}
                >
                  <span
                    className={`text-base flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all
                    ${activeNav === item.path ? "bg-white/20" : "group-hover:bg-white/10"}`}
                  >
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium flex-1 truncate">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                          {item.badge}
                        </span>
                      )}
                      {item.sub && (
                        <span
                          className={`text-[10px] opacity-50 transition-transform duration-200 ${
                            openSubs[item.id] ? "rotate-90" : ""
                          }`}
                        >
                          ▶
                        </span>
                      )}
                    </>
                  )}
                </Link>

                {/* Sub menu */}
                {item.sub && !collapsed && openSubs[item.id] && (
                  <div className="pl-11 pr-2 pb-1">
                    {item.sub.map((s) => (
                      <button
                        key={s}
                        className="w-full cursor-pointer text-left px-3 py-2 text-xs text-white/50 hover:text-white hover:bg-white/6 rounded-lg transition-all mb-0.5"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10 flex-shrink-0">
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-white/8 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            AD
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-white text-xs font-semibold truncate">
                Admin User
              </div>
              <div className="text-white/40 text-[10px]">Super Admin</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
