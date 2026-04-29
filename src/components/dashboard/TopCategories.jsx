import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetCategoryStatsQuery } from "../../services/categoryApi";

export default function TopCategories() {
  const [isMobile, setIsMobile] = useState(false);

  const {
    data: categoryStats,
    isLoading,
    isError,
  } = useGetCategoryStatsQuery();

  const categories = categoryStats?.data || [];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Loading UI
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl md:rounded-2xl border border-green-100 shadow-sm p-5">
        <p className="text-sm text-gray-500">Loading categories...</p>
      </div>
    );
  }

  // Error UI
  if (isError) {
    return (
      <div className="bg-white rounded-xl md:rounded-2xl border border-red-100 shadow-sm p-5">
        <p className="text-sm text-red-500">Failed to load categories</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-green-100 shadow-sm overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-gray-100">
        <h3 className="text-sm md:text-base font-bold text-gray-800">
          🔥 Top Categories
        </h3>

        <Link
          to="/admin/categories"
          className="text-xs md:text-sm text-(--color-primary) font-semibold hover:underline"
        >
          See All →
        </Link>
      </div>

      {/* Empty State */}
      {categories.length === 0 ? (
        <div className="p-5 text-sm text-gray-500">No category data found</div>
      ) : (
        <div className="divide-y divide-gray-100">
          {categories.slice(0, isMobile ? 5 : 8).map((cat) => (
            <div
              key={cat._id}
              className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-gray-50 transition-colors"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl overflow-hidden border bg-gray-50 flex items-center justify-center flex-shrink-0">
                <img
                  src={cat.icon}
                  alt={cat.name}
                  className="w-7 h-7 object-contain"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm md:text-base font-semibold text-gray-800 truncate">
                  {cat.name}
                </p>

                <p className="text-xs text-gray-400 mt-0.5">
                  {cat.products} products · {cat.stock} stock
                </p>
              </div>

              {/* Revenue */}
              <span className="font-mono text-xs md:text-sm font-bold text-(--color-primary)">
                ৳{Number(cat.revenue).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
