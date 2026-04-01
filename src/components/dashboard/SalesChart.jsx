const MONTHS = [
  { label: "Jan", pct: 40 },
  { label: "Feb", pct: 60 },
  { label: "Mar", pct: 50 },
  { label: "Apr", pct: 75 },
  { label: "May", pct: 55 },
  { label: "Jun", pct: 90, active: true },
  { label: "Jul", pct: 65 },
  { label: "Aug", pct: 80 },
];

export default function SalesChart() {
  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">📈 Monthly Sales</h3>
        <button className="text-xs text-(--color-primary) font-semibold hover:underline">
          View Report →
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-end gap-2.5 h-40">
          {MONTHS.map((m) => (
            <div
              key={m.label}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
            >
              <div
                title={`${m.pct}%`}
                className={`w-full rounded-t-md border transition-all duration-500 cursor-pointer hover:opacity-75 ${
                  m.active
                    ? "bg-(--color-primary) border-(--color-hover-primary)"
                    : "bg-green-100 border-green-300"
                }`}
                style={{ height: `${m.pct}%` }}
              />
              <span className="text-[10px] text-gray-400 font-medium">
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
