const CATEGORIES = [
  {
    icon: "🥦",
    name: "Vegetables",
    products: 142,
    orders: 38,
    revenue: "$4,320",
    bg: "bg-green-50",
  },
  {
    icon: "🍎",
    name: "Fruits",
    products: 98,
    orders: 55,
    revenue: "$3,210",
    bg: "bg-yellow-50",
  },
  {
    icon: "🥩",
    name: "Meat & Fish",
    products: 64,
    orders: 29,
    revenue: "$5,840",
    bg: "bg-red-50",
  },
  {
    icon: "🥛",
    name: "Dairy",
    products: 47,
    orders: 72,
    revenue: "$2,190",
    bg: "bg-blue-50",
  },
];

export default function TopCategories() {
  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">🔥 Top Categories</h3>
        <button className="text-xs text-(--color-primary) font-semibold hover:underline">
          See All →
        </button>
      </div>

      <div>
        {CATEGORIES.map((cat, i) => (
          <div
            key={cat.name}
            className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors ${
              i < CATEGORIES.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${cat.bg}`}
            >
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {cat.products} products · {cat.orders} orders
              </p>
            </div>
            <span className="font-mono text-sm font-bold text-(--color-primary)">
              {cat.revenue}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
