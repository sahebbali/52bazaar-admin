import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ activeNav, onNavChange }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex font-[Sora,sans-serif]">
      <Sidebar
        collapsed={collapsed}
        activeNav={activeNav}
        onNavChange={onNavChange}
      />

      <div
        className="flex flex-col flex-1 min-h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? "64px" : "248px" }}
      >
        <Topbar
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          activeNav={activeNav}
        />

        <main className="flex-1 mt-16 p-7">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
