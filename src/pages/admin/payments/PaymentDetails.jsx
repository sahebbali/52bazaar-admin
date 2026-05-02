// pages/admin/payments/PaymentDetails.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loading } from "../../../common/Loading";
import { METHOD_CONFIG, STATUS_CONFIG } from "./PaymentList";
import {
  useGetPaymentsByIdQuery,
  useUpdatePaymentStatusMutation,
} from "../../../services/paymentApi";
import { Notification } from "../../../components/ToastNotification";

export default function PaymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  const { data: paymentData, isLoading } = useGetPaymentsByIdQuery(id);
  const [
    updatePaymentStatus,
    { data: updateData, isLoading: isUpdating, isError, error },
  ] = useUpdatePaymentStatusMutation();

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
    }
    if (updateData) {
      Notification(updateData.message, "success");
    }
    if (isError) {
      console.error("Error updating payment status:", error);
      Notification(error.data.message, "error");
    }
  }, [isLoading, updateData, isError]);
  useEffect(() => {
    setTimeout(() => {
      setPayment(paymentData);
      setSelectedStatus(paymentData?.data?.status ?? "");
      setLoading(false);
    }, 500);
  }, [id, paymentData]);

  const handleRefund = () => navigate(`/admin/payments/${id}/refund`);

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === payment.data.status) return;
    console.log("Updating status to:", selectedStatus, id);
    setStatusUpdating(true);
    try {
      const obj = { orderId: id, status: selectedStatus };
      await updatePaymentStatus(obj).unwrap();
      setPayment((prev) => ({
        ...prev,
        data: { ...prev.data, status: selectedStatus },
      }));
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading)
    return (
      <Loading type="spinner" size="lg" text="Loading payment details..." />
    );

  if (!payment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment not found
          </h2>
          <p className="text-gray-500 mb-4">
            The payment you're looking for doesn't exist
          </p>
          <Link
            to="/admin/payments"
            className="text-(--color-primary) hover:underline"
          >
            Back to Payments
          </Link>
        </div>
      </div>
    );
  }

  const d = payment.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Link
                to="/admin/payments"
                className="text-(--color-primary) hover:underline text-sm mb-2 inline-block"
              >
                ← Back to Payments
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Payment Details
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Transaction ID: {d.transactionId}
              </p>
            </div>
            <div className="flex gap-3">
              {d.refundable && d.status === "completed" && (
                <button
                  onClick={handleRefund}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  ↩️ Process Refund
                </button>
              )}
              <button className="px-4 py-2 bg-(--color-primary) text-white border border-gray-300 rounded-lg hover:opacity-90 transition-colors">
                📥 Download Receipt
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Transaction Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Transaction ID
                  </label>
                  <p className="font-mono text-sm font-semibold text-gray-900 mt-1">
                    {d.transactionId}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Order ID
                  </label>
                  <Link
                    to={`/admin/orders/${d.orderId}`}
                    className="text-sm text-(--color-primary) hover:underline block mt-1"
                  >
                    {d.orderId} →
                  </Link>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Amount
                  </label>
                  <p className="text-2xl font-bold text-(--color-primary) mt-1">
                    ৳ {d.total?.toFixed(2)}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[d.status]?.color}`}
                    >
                      {STATUS_CONFIG[d.status]?.icon}{" "}
                      {STATUS_CONFIG[d.status]?.label}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Payment Method
                  </label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${METHOD_CONFIG[d.method]?.color}`}
                    >
                      {METHOD_CONFIG[d.method]?.icon}{" "}
                      {METHOD_CONFIG[d.method]?.label}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Transaction Date
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(d.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* bKash Number — only show if method is bkash */}
                {d.method === "bkash" && d.bkashNumber && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase">
                      bKash Number
                    </label>
                    <p className="text-sm font-semibold text-pink-600 mt-1">
                      📱 {d.bkashNumber}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Gateway Response
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {d.gatewayResponse ?? "—"}
                  </p>
                </div>

                {d.notes && (
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-500 uppercase">
                      Notes
                    </label>
                    <p className="text-sm text-gray-700 mt-1 bg-gray-50 rounded px-3 py-2">
                      {d.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                    <th className="text-left pb-3">Product</th>
                    <th className="text-center pb-3">Qty</th>
                    <th className="text-right pb-3">Price</th>
                    <th className="text-right pb-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {d.items?.map((item) => (
                    <tr key={item._id} className="border-b border-gray-100">
                      <td className="py-3 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-contain rounded bg-gray-50 border border-gray-100"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">{item.sku}</p>
                        </div>
                      </td>
                      <td className="py-3 text-center text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-3 text-right text-gray-700">
                        ৳{item.price?.toFixed(2)}
                      </td>
                      <td className="py-3 text-right font-medium text-gray-900">
                        ৳{(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-4 space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>৳{d.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Discount</span>
                  <span>- ৳{d.discount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax / VAT</span>
                  <span>+ ৳{d.tax?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>+ ৳{d.shipping?.toFixed(2)}</span>
                </div>

                <div className="flex justify-between font-bold text-base text-gray-900 border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-(--color-primary)">
                    ৳{d.total?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Customer Name
                  </label>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {d.customer?.name || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Customer Email
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {d.customer?.email || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Phone Number
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {d.customer?.phone || "—"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">
                    Billing Address
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {d.customer?.address || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            {/* Timeline — from real data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Timeline
              </h2>
              <div className="space-y-4">
                {d.timeline?.map((event, index) => {
                  const isLast = index === d.timeline.length - 1;
                  const iconMap = {
                    pending: { bg: "bg-yellow-100", icon: "⏳" },
                    completed: { bg: "bg-green-100", icon: "✅" },
                    refunded: { bg: "bg-orange-100", icon: "↩️" },
                    failed: { bg: "bg-red-100", icon: "❌" },
                    cancelled: { bg: "bg-gray-100", icon: "🚫" },
                  };
                  const style = iconMap[event.status] ?? {
                    bg: "bg-gray-100",
                    icon: "📋",
                  };

                  return (
                    <div key={event._id} className="flex gap-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 ${style.bg} rounded-full flex items-center justify-center`}
                      >
                        <span>{style.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {event.status}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(event.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          {new Date(event.date).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {event.note && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {event.note}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions — with status changer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Actions
              </h2>
              <div className="space-y-3">
                {/* Change Payment Status */}
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">
                    Change Payment Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border text-black cursor-pointer border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="paid">✅ paid</option>
                    <option value="failed">❌ Failed</option>
                    <option value="refunded">↩️ Refunded</option>
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={statusUpdating || selectedStatus === d.status}
                    className="mt-2 w-full px-4 cursor-pointer py-2 bg-(--color-primary) text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {statusUpdating ? "Updating..." : "Update Status"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
