import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetAllOrdersQuery } from "../../services/orderApi";

const STATUS_STYLES = {
  delivered: "bg-green-100 text-green-800",
  processing: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-purple-100 text-purple-800",
};

export default function OrdersTable() {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);

  const { data, isLoading, isError } = useGetAllOrdersQuery({
    page: 1,
    limit: 7,
    search: "",
    status: "",
    paymentStatus: "",
    startDate: "",
    endDate: "",
  });

  const orders = data?.orders || [];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatCurrency = (amount) => `৳${Number(amount || 0).toLocaleString()}`;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-sm text-gray-500">Loading orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-sm text-red-500">Failed to load orders</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl md:rounded-2xl border border-green-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm md:text-base font-bold text-gray-800">
          🛍️ Recent Orders
        </h3>

        <Link
          to="/admin/orders"
          className="text-xs md:text-sm text-(--color-primary) font-semibold hover:underline"
        >
          View All →
        </Link>
      </div>

      {/* Empty */}
      {orders.length === 0 && (
        <div className="p-5 text-sm text-gray-500">No orders found</div>
      )}

      {/* Desktop */}
      {!isMobile && orders.length > 0 && (
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
                ].map((item) => (
                  <th
                    key={item}
                    className="px-5 py-3 text-left text-[11px] uppercase text-gray-400 font-semibold"
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-5 py-4 font-mono text-xs text-black">
                    {order.orderId}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-black">
                    {order.customer?.name || "Guest"}
                  </td>

                  <td className="px-5 py-4 text-sm text-black">
                    {order.itemsCount} items
                  </td>

                  <td className="px-5 py-4 text-sm text-black">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="px-5 py-4 font-semibold text-black">
                    {formatCurrency(order.total)}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile */}
      {isMobile && orders.length > 0 && (
        <div className="divide-y divide-gray-100">
          {orders.map((order) => (
            <div key={order._id} className="p-4">
              <div
                className="cursor-pointer"
                onClick={() => toggleRow(order._id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs text-gray-500">
                    {order.orderId}
                  </span>

                  <StatusBadge status={order.status} />
                </div>

                <div className="mt-2 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">
                      {order.customer?.name}
                    </p>

                    <p className="text-xs text-gray-400">
                      {order.itemsCount} items • {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <span className="font-bold text-(--color-primary)">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>

              {expandedRow === order._id && (
                <div className="mt-3 pt-3 border-t text-sm space-y-2">
                  <p>
                    <span className="text-black">Payment:</span>{" "}
                    {order.payment?.method}
                  </p>

                  <p>
                    <span className="text-black">Phone:</span>{" "}
                    {order.customer?.phone || "N/A"}
                  </p>

                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="block text-center mt-3 border rounded-lg py-2 text-(--color-primary) font-semibold"
                  >
                    View Details
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const key = status?.toLowerCase();

  return (
    <span
      className={`px-2 py-1 rounded-full text-[11px] font-semibold ${
        STATUS_STYLES[key] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
