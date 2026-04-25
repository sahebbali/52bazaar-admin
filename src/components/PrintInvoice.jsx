import React from "react";
import Logo from "../assets/logo/52-bazaar-logo.webp";

const PrintInvoice = ({ order }) => {
  const printTime = new Date().toLocaleString("en-GB").replace(",", "");

  const prevDue = order.previousDue ?? 0;
  const cashPaid = order.cashPaid ?? order.total ?? 0;
  const discount = order.discount ?? 0;
  const cashBack = order.cashBack ?? 0;
  const balance = prevDue - cashPaid - discount - cashBack;

  return (
    <div
      id="print-invoice"
      style={{
        width: "320px",
        fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
        fontSize: "12px",
        color: "#111",
        padding: "20px 16px",
        background: "#fff",
        margin: "0 auto",
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "4px" }}>
        <img
          src={Logo}
          alt="52Bazar Logo"
          className="w-6 h-6 object-contain image-rendering-auto"
        />{" "}
      </div>

      {/* Store Info */}
      <p
        style={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "17px",
          margin: "4px 0 2px",
        }}
      >
        আরিফ ট্রেডার্স
      </p>
      <p
        style={{
          textAlign: "center",
          fontSize: "10px",
          color: "#555",
          lineHeight: "1.5",
          margin: "0 0 4px",
        }}
      >
        বিভিন্ন প্রকার চাউলের পাইকারি ও খুচরা সরবরাহকারী
        <br />
        এ ৩৩, ভোয়ার সাহারা বাজার (মসজিদুল আক্বা সংলগ্ন)
        <br />
        ভাটারা, ঢাকা-১২২৯
      </p>
      <p style={{ textAlign: "center", fontSize: "11px", margin: "0 0 8px" }}>
        01818-207859
      </p>

      <Divider />
      <p
        style={{
          textAlign: "center",
          fontWeight: "700",
          fontSize: "13px",
          letterSpacing: "1px",
        }}
      >
        রশিদ
      </p>
      <Divider />

      {/* Receipt Meta */}
      <Row label="রশিদ নং" value={order.orderId} />
      <Row
        label="তারিখ"
        value={new Date(order.createdAt)
          .toLocaleDateString("en-GB")
          .replace(/\//g, ".")}
      />
      <Row label="নাম" value={order.customer?.name ?? "—"} />
      <Row label="ঠিকানা" value={order.shippingAddress?.[0]?.city ?? "—"} />
      <Row label="মোবাই নং" value={order.customer?.phone ?? "—"} />

      <Divider />

      {/* Financials */}
      <AmountRow
        label="পূর্বের বকেয়া"
        value={prevDue.toLocaleString("en-IN")}
      />
      <AmountRow label="নগদ দান" value={cashPaid.toLocaleString("en-IN")} />
      <AmountRow label="ছাড়" value={discount.toLocaleString("en-IN")} />
      <AmountRow label="ক্যাশ ব্যাক" value={cashBack.toLocaleString("en-IN")} />

      {/* Balance */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #111",
          marginTop: "6px",
          paddingTop: "8px",
          fontWeight: "700",
          fontSize: "14px",
          color: balance > 0 ? "#c0392b" : "#1a7a1a",
        }}
      >
        <span>ব্যালেন্স</span>
        <span>{balance.toLocaleString("en-IN")}</span>
      </div>

      <Divider />
      <Row label="মন্তব্য" value={order.note ?? ""} />
      <p
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#555",
          marginTop: "12px",
        }}
      >
        স্বাক্ষর
      </p>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          fontSize: "9px",
          color: "#888",
          borderTop: "1px dashed #ccc",
          paddingTop: "8px",
          marginTop: "8px",
        }}
      >
        SOFTWARE: explore IT | 01777615690
        <br />
        Printing Time: {printTime}
      </div>
    </div>
  );
};

const Divider = () => (
  <hr
    style={{ border: "none", borderTop: "1px dashed #aaa", margin: "10px 0" }}
  />
);

const Row = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "3px 0",
      fontSize: "11.5px",
    }}
  >
    <span style={{ color: "#444" }}>{label}</span>
    <span style={{ fontWeight: "500" }}>{value}</span>
  </div>
);

const AmountRow = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "4px 0",
      fontSize: "12px",
    }}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default PrintInvoice;
