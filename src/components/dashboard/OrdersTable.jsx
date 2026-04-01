const ORDERS = [
  {
    id: "#ORD-5812",
    customer: "Rahim Uddin",
    items: 3,
    date: "31 Mar 2026",
    amount: "$128.00",
    status: "Delivered",
  },
  {
    id: "#ORD-5811",
    customer: "Karim Hossain",
    items: 5,
    date: "31 Mar 2026",
    amount: "$245.50",
    status: "Processing",
  },
  {
    id: "#ORD-5810",
    customer: "Nasrin Akter",
    items: 2,
    date: "30 Mar 2026",
    amount: "$64.00",
    status: "Pending",
  },
  {
    id: "#ORD-5809",
    customer: "Sohel Rana",
    items: 7,
    date: "30 Mar 2026",
    amount: "$389.00",
    status: "Cancelled",
  },
  {
    id: "#ORD-5808",
    customer: "Fatema Begum",
    items: 4,
    date: "29 Mar 2026",
    amount: "$172.25",
    status: "Delivered",
  },
];

const STATUS_STYLES = {
  Delivered: "bg-green-100 text-green-800",
  Processing: "bg-blue-100 text-blue-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-800",
};

const STATUS_ICONS = {
  Delivered: "✓",
  Processing: "⏳",
  Pending: "🕐",
  Cancelled: "✕",
};

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">🛍️ Recent Orders</h3>
        <button className="text-xs text-(--color-primary) font-semibold hover:underline">
          View All Orders →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {[
                "Order ID",
                "Customer",
                "Items",
                "Date",
                "Amount",
                "Status",
                "Action",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((order) => (
              <tr
                key={order.id}
                className="border-t border-gray-100 hover:bg-green-50/40 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <span className="font-mono text-xs text-gray-400">
                    {order.id}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm font-medium text-gray-700">
                  {order.customer}
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">
                  {order.items} items
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-5 py-3.5 font-mono text-sm font-bold text-gray-800">
                  {order.amount}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-5 py-3.5">
                  <button className="text-xs font-semibold text-(--color-primary) border border-(--color-primary) hover:bg-(--color-hover-primary) hover:text-white hover:border-(--color-hover-primary) px-3 py-1.5 rounded-lg transition-all">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_STYLES[status]}`}
    >
      <span>{STATUS_ICONS[status]}</span>
      {status}
    </span>
  );
}
