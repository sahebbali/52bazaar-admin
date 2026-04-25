import { useEffect, useRef, useState } from "react";
import Breadcrumb from "./Topbar/Breadcrumb";
import SearchBar from "./Topbar/SearchBar";
import ActionButton from "./Topbar/ActionButton";
import UserChip from "./Topbar/UserChip";
import { useNavigate } from "react-router-dom";

/**
 * Topbar
 *
 * Props:
 *  collapsed  — desktop sidebar collapsed state
 *  isMobile   — true when viewport < 768px
 *  onToggle   — hamburger click handler
 *  activeNav  — current nav id
 *  onLogout   — logout function
 */
export default function Topbar({ collapsed, isMobile, onToggle, activeNav }) {
  const navigate = useNavigate();
  const leftOffset = isMobile ? 0 : collapsed ? 80 : 256;

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const onLogout = () => {
    localStorage.removeItem("52bazaarToken");
    setOpenMenu(false);
    window.location.reload();
    navigate("/");
  };

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="fixed top-0 right-0 z-40 h-16 bg-white border-b border-green-100 flex items-center gap-3 px-4 md:px-6 transition-all duration-300"
      style={{ left: `${leftOffset}px` }}
    >
      {/* Sidebar Toggle */}
      <button
        onClick={onToggle}
        aria-label="Toggle sidebar"
        className="w-9 h-9 rounded-xl cursor-pointer bg-green-50 hover:bg-green-600 hover:text-white text-green-700 flex items-center justify-center transition-all duration-200 flex-shrink-0 text-base"
      >
        ☰
      </button>

      <Breadcrumb activeNav={activeNav} />

      <div className="ml-auto flex items-center gap-2">
        <SearchBar />

        <ActionButton icon="🔔" badge label="Notifications" />
        <ActionButton icon="💬" label="Messages" />
        <ActionButton icon="🔄" label="Refresh" />

        {/* User Dropdown */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setOpenMenu(!openMenu)}
            className="cursor-pointer"
          >
            <UserChip />
          </div>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              <button
                className="w-full cursor-pointer text-left px-4 py-3 text-black hover:bg-(--color-primary) transition"
                onClick={() => {
                  setOpenMenu(false);
                  onLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
