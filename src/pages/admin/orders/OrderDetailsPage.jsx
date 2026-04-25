// pages/OrderDetailsPage.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useParams, useNavigate } from "react-router-dom";
import OrderTimeline from "./components/OrderTimeline";
import OrderStatusModal from "./components/OrderStatusModal";
import {
  useGetOrdersByIdQuery,
  useUpdateOrderStatusMutation,
} from "../../../services/orderApi";
import { Notification } from "../../../components/ToastNotification";
import PrintInvoice from "../../../components/PrintInvoice";
import Logo from "../../../assets/logo/52-bazaar-logo.webp";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // console.log("OrderDetailsPage rendered with ID:", id);

  const { data: orderDetails, isLoading } = useGetOrdersByIdQuery(id);
  console.log("API Response for order details:", orderDetails, isLoading);
  const [
    updateOrderStatus,
    { data: updateData, isError, isLoading: isUpdating },
  ] = useUpdateOrderStatusMutation();

  useEffect(() => {
    if (updateData) {
      Notification(updateData.message, "success");
      navigate("/admin/orders");
    } else if (isError) {
      Notification("Failed to update status", "error");
    }
  }, [updateData, isError]);

  useEffect(() => {
    // Fetch order details
    const fetchOrder = async () => {
      setLoading(true);
      setOrder(orderDetails?.order || null); // Adjust based on actual API response structure
      setLoading(false);
    };
    fetchOrder();
  }, [id, orderDetails]);

  console.log("Order Details:", order);
  const handleUpdateStatus = async (status, note, sendEmail) => {
    // console.log(orderDetails.order.orderId);
    const id = orderDetails.order.orderId;
    // consol.log("Updating order status with:", { status, note, sendEmail });
    // API call to update status
    console.log("Updating status:", id, status, note, sendEmail);
    await updateOrderStatus({ id, status, note, sendEmail });
    setShowStatusModal(false);
    // Refresh order data
  };

  const handlePrintInvoice = () => {
    const toBase64 = (url) =>
      fetch(url)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(blob);
            }),
        );

    toBase64(Logo).then((base64Logo) => {
      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow.document;
      const printTime = new Date().toLocaleString("en-GB").replace(",", "");

      const prevDue = order.previousDue ?? 0;
      const cashPaid = order.cashPaid ?? order.total ?? 0;
      const discount = order.discount ?? 0;
      const cashBack = order.cashBack ?? 0;
      const balance = prevDue - cashPaid - discount - cashBack;
      const balanceColor = balance > 0 ? "#c0392b" : "#1a7a1a";

      const shippingCity = order.shippingAddress?.[0]?.city ?? "—";
      const orderDate = new Date(order.createdAt)
        .toLocaleDateString("en-GB")
        .replace(/\//g, ".");

      iframeDoc.open();
      iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&display=swap" rel="stylesheet" />
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              display: flex;
              justify-content: center;
              padding: 20px;
              background: #fff;
              font-family: 'IBM Plex Mono', 'Courier New', monospace;
            }
            .receipt { width: 320px; font-size: 12px; color: #111; padding: 20px 16px; }
            .center { text-align: center; }
            .logo-wrap {
              text-align: center;
              margin-bottom: 6px;
            }
            .logo-wrap img {
              width: 72px;
              height: 72px;
              object-fit: contain;
              display: inline-block;
            }
            .divider { border: none; border-top: 1px dashed #aaa; margin: 10px 0; }
            .divider-solid { border: none; border-top: 1px dashed #ccc; margin: 8px 0; }
            .row { display: flex; justify-content: space-between; padding: 3px 0; font-size: 11.5px; }
            .row .label { color: #444; }
            .row .value { font-weight: 500; }
            .amount-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
            .balance-row {
              display: flex;
              justify-content: space-between;
              border-top: 2px solid #111;
              margin-top: 6px;
              padding-top: 8px;
              font-weight: 700;
              font-size: 14px;
              color: ${balanceColor};
            }
            .store-name {
              font-size: 17px;
              font-weight: 700;
              text-align: center;
              margin: 4px 0 2px;
            }
            .store-sub {
              font-size: 10px;
              color: #555;
              line-height: 1.5;
              text-align: center;
              margin: 0 0 4px;
            }
            .receipt-title {
              text-align: center;
              font-weight: 700;
              font-size: 13px;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
            .footer {
              text-align: center;
              font-size: 9px;
              color: #888;
              padding-top: 8px;
              margin-top: 8px;
            }
            .signature {
              text-align: center;
              font-size: 11px;
              color: #555;
              margin-top: 12px;
            }
          </style>
        </head>
        <body>
          <div class="receipt">

            <div class="logo-wrap">
              <img src="${base64Logo}" alt="52 Bazar Logo" />
            </div>

            <p class="store-name">52 Bazar</p>
            <p class="store-sub">
              Wholesale &amp; Retail Rice Supplier<br/>
              A 33, Bhoar Sahara Bazar (Near Masjid Al-Aqsa)<br/>
              Vatara, Dhaka-1229
            </p>
            <p class="center" style="font-size:11px; margin:0 0 8px;">01818-207859</p>

            <hr class="divider"/>
            <p class="receipt-title">Receipt</p>
            <hr class="divider"/>

            <div class="row">
              <span class="label">Receipt No</span>
              <span class="value">${order.orderId}</span>
            </div>
            <div class="row">
              <span class="label">Date</span>
              <span class="value">${orderDate}</span>
            </div>
            <div class="row">
              <span class="label">Name</span>
              <span class="value">${order.customer?.name ?? "—"}</span>
            </div>
            <div class="row">
              <span class="label">Address</span>
              <span class="value">${shippingCity}</span>
            </div>
            <div class="row">
              <span class="label">Mobile No</span>
              <span class="value">${order.customer?.phone ?? "—"}</span>
            </div>

            <hr class="divider"/>

            <div class="amount-row">
              <span>Previous Due</span>
              <span>${prevDue.toLocaleString("en-IN")}</span>
            </div>
            <div class="amount-row">
              <span>Cash Paid</span>
              <span>${cashPaid.toLocaleString("en-IN")}</span>
            </div>
            <div class="amount-row">
              <span>Discount</span>
              <span>${discount.toLocaleString("en-IN")}</span>
            </div>
            <div class="amount-row">
              <span>Cash Back</span>
              <span>${cashBack.toLocaleString("en-IN")}</span>
            </div>

            <div class="balance-row">
              <span>Balance</span>
              <span>${Math.abs(balance).toLocaleString("en-IN")}</span>
            </div>

            <hr class="divider"/>

            <div class="row">
              <span class="label">Note:</span>
              <span class="value">${order.note ?? ""}</span>
            </div>

            <p class="signature">Signature</p>
            <hr class="divider-solid"/>

            <div class="footer">
              SOFTWARE: explore IT | 01777615690<br/>
              Printing Time: ${printTime}
            </div>

          </div>
        </body>
      </html>
    `);
      iframeDoc.close();

      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          document.body.removeChild(iframe);
        }, 900);
      };
    });
  };

  const handleSendEmail = () => {
    // Send email notification
    console.log("Sending email...");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order {order.orderId}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStatusModal(true)}
                className="px-4 py-2 cursor-pointer bg-(--color-primary) text-white rounded-md hover:bg-(--color-primary-hover)"
              >
                Update Status
              </button>
              <button
                onClick={handlePrintInvoice}
                className="px-4 py-2 cursor-pointer bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Print Invoice
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 cursor-pointer bg-(--color-primary) text-white rounded-md hover:bg-(--color-primary-hover)"
              >
                Send Email
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg text-black font-semibold mb-4">
                Order Summary
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-medium text-black">{order.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-black">
                    {new Date(order.timeline[0].date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <h2 className="text-lg text-black font-semibold p-6 border-b">
                Order Items
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            SKU: {item.sku}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          ৳{item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-black text-right font-medium"
                      >
                        Subtotal:
                      </td>
                      <td className="px-6 py-4 font-medium text-black">
                        ৳{order.subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-black text-right font-medium"
                      >
                        Shipping:
                      </td>
                      <td className="px-6 py-4 font-medium text-black">
                        ৳{order.shipping.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-4 text-black text-right font-bold"
                      >
                        Total:
                      </td>
                      <td className="px-6 py-4 font-bold text-lg text-black">
                        ৳{order.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg text-black font-semibold mb-4">
                Customer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-black">
                    <span className="text-sm text-gray-600 mr-2">Name:</span>
                    {order.customer.name}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-black">
                    <span className="text-sm text-gray-600 mr-2">Email:</span>
                    {order.customer.email}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-black">
                    <span className="text-sm text-gray-600 mr-2">Phone:</span>
                    {order.customer.phone}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-black">
                    <span className="text-sm text-gray-600 mr-2">
                      Shipping Address:
                    </span>

                    {order.shippingAddress?.[0]
                      ? `${order.shippingAddress[0].street}, ${order.shippingAddress[0].city}, ${order.shippingAddress[0].state}, ${order.shippingAddress[0].postalCode}, ${order.shippingAddress[0].country}`
                      : "No address available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg text-black font-semibold mb-4">
                Payment Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-black">
                    <span className="text-sm text-gray-600 mr-2">Method:</span>
                    {order.payment.method}
                  </p>
                </div>

                <div>
                  <p className="font-medium text-black">
                    <span className="text-sm text-gray-600 mr-2">
                      Transaction ID:
                    </span>
                    {order.payment.transactionId}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status:</span>

                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <OrderTimeline timeline={order.timeline} />
          </div>
        </div>

        {/* Status Update Modal */}
        {showStatusModal && (
          <OrderStatusModal
            currentStatus={order.status}
            onClose={() => setShowStatusModal(false)}
            onUpdate={handleUpdateStatus}
          />
        )}
      </div>
    </div>
  );
};

// Mock order details
const mockOrderDetails = {
  id: "ORD-001",
  date: "2024-01-15T10:30:00",
  status: "processing",
  paymentStatus: "paid",
  subtotal: 249.98,
  shipping: 5.99,
  total: 255.97,
  customer: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    address: "123 Main St\nApt 4B\nNew York, NY 10001\nUSA",
  },
  items: [
    { name: "Product 1", sku: "SKU001", quantity: 2, price: 49.99 },
    { name: "Product 2", sku: "SKU002", quantity: 1, price: 149.99 },
  ],
  payment: {
    method: "Credit Card (Visa)",
    transactionId: "txn_123456789",
  },
  timeline: [
    {
      status: "Order Placed",
      date: "2024-01-15T10:30:00",
      note: "Order received",
    },
    {
      status: "Payment Confirmed",
      date: "2024-01-15T10:31:00",
      note: "Payment successful",
    },
    {
      status: "Processing",
      date: "2024-01-15T11:00:00",
      note: "Order is being processed",
    },
  ],
};

export default OrderDetailsPage;
