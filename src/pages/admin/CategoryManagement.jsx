import { useState, useEffect, useRef } from "react";
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../services/categoryApi";
import { Notification } from "../../components/ToastNotification";

/* ─── MOCK DATA ───────────────────────────────── */
const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Vegetables",
    slug: "vegetables",
    status: "active",
    products: 142,
    parent: null,
    icon: "🥦",
    description: "Fresh organic vegetables",
    metaTitle: "Buy Fresh Vegetables Online",
    metaDesc: "Shop the best organic vegetables.",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Fruits",
    slug: "fruits",
    status: "active",
    products: 98,
    parent: null,
    icon: "🍎",
    description: "Seasonal and exotic fruits",
    metaTitle: "Fresh Fruits Online",
    metaDesc: "Order fresh fruits delivered.",
    createdAt: "2024-01-18",
  },
  {
    id: 3,
    name: "Meat & Fish",
    slug: "meat-fish",
    status: "active",
    products: 64,
    parent: null,
    icon: "🥩",
    description: "Premium meat and seafood",
    metaTitle: "Fresh Meat & Fish Delivery",
    metaDesc: "Premium quality meat online.",
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    name: "Dairy",
    slug: "dairy",
    status: "active",
    products: 47,
    parent: null,
    icon: "🥛",
    description: "Fresh dairy products",
    metaTitle: "Dairy Products Online",
    metaDesc: "Fresh milk, cheese & more.",
    createdAt: "2024-02-10",
  },
  {
    id: 5,
    name: "Leafy Greens",
    slug: "leafy-greens",
    status: "active",
    products: 38,
    parent: 1,
    icon: "🥬",
    description: "Spinach, lettuce, kale",
    metaTitle: "Fresh Leafy Greens",
    metaDesc: "Order leafy greens online.",
    createdAt: "2024-02-20",
  },
  {
    id: 6,
    name: "Root Veggies",
    slug: "root-veggies",
    status: "inactive",
    products: 22,
    parent: 1,
    icon: "🥕",
    description: "Carrots, beetroot, radish",
    metaTitle: "Root Vegetables Online",
    metaDesc: "Buy root vegetables fresh.",
    createdAt: "2024-03-01",
  },
  {
    id: 7,
    name: "Citrus Fruits",
    slug: "citrus-fruits",
    status: "active",
    products: 18,
    parent: 2,
    icon: "🍊",
    description: "Oranges, lemons, limes",
    metaTitle: "Fresh Citrus Fruits",
    metaDesc: "Vitamin C rich citrus fruits.",
    createdAt: "2024-03-05",
  },
  {
    id: 8,
    name: "Bakery",
    slug: "bakery",
    status: "inactive",
    products: 0,
    parent: null,
    icon: "🍞",
    description: "Breads, cakes and pastries",
    metaTitle: "Fresh Bakery Products",
    metaDesc: "Freshly baked goods daily.",
    createdAt: "2024-03-10",
  },
];

/* ─── HELPERS ─────────────────────────────────── */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* ─── SHARED UI ───────────────────────────────── */
function Badge({ status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide",
        status === "active"
          ? "bg-green-100 text-(--color-primary)"
          : "bg-gray-100 text-gray-500",
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "active" ? "bg-(--color-primary)" : "bg-gray-400",
        )}
      />
      {status === "active" ? "Active" : "Inactive"}
    </span>
  );
}

function Btn({
  variant = "primary",
  size = "md",
  children,
  className,
  ...props
}) {
  const base =
    "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-150 cursor-pointer border";
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
  };
  const variants = {
    primary:
      "bg-(--color-primary) text-white border-(--color-primary) hover:bg-(--color-primary-hover) hover:border-(--color-primary-hover) shadow-sm shadow-(--color-primary)/20",
    secondary:
      "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50",
    danger:
      "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700",
    ghost:
      "bg-transparent text-gray-500 border-transparent hover:bg-gray-100 hover:text-gray-700",
  };
  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

function Checkbox({ checked, onChange, indeterminate }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-gray-300 accent-(--color-primary) cursor-pointer"
    />
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white pointer-events-auto",
            t.type === "success"
              ? "bg-(--color-primary)"
              : t.type === "error"
                ? "bg-red-600"
                : "bg-gray-800",
          )}
        >
          <span>
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ─── SECTION CARD ────────────────────────────── */
function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
        <span className="text-base">{icon}</span>
        <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

/* ─── CATEGORY LIST PAGE ──────────────────────── */
function CategoryList({ categories, onEdit, onDelete, onAdd, showToast }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const filtered = categories
    .filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.slug.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let va = sortBy === "name" ? a.name : a.createdAt;
      let vb = sortBy === "name" ? b.name : b.createdAt;
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const allChecked =
    paginated.length > 0 && paginated.every((c) => selected.includes(c.id));
  const someChecked =
    paginated.some((c) => selected.includes(c.id)) && !allChecked;

  const toggleAll = () => {
    if (allChecked)
      setSelected((s) => s.filter((id) => !paginated.find((c) => c.id === id)));
    else
      setSelected((s) => [...new Set([...s, ...paginated.map((c) => c.id)])]);
  };
  const toggleOne = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  const handleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("asc");
    }
  };
  const SortIcon = ({ col }) => (
    <span className="ml-1 opacity-40 text-[10px]">
      {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );
  const getParentName = (parentId) => {
    if (!parentId) return "—";
    const p = categories.find((c) => c.id === parentId);
    return p ? p.name : "—";
  };

  const confirmDelete = () => {
    if (deleteModal === "single") {
      onDelete([deleteTarget]);
    } else {
      onDelete(selected);

      setSelected([]);
    }
    setDeleteModal(null);
    setDeleteTarget(null);
  };

  const activeCount = categories.filter((c) => c.status === "active").length;
  const inactiveCount = categories.filter(
    (c) => c.status === "inactive",
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your product categories and subcategories
          </p>
        </div>
        <Btn
          onClick={onAdd}
          size="md"
          className="w-full sm:w-auto justify-center"
        >
          <span>＋</span> Add Category
        </Btn>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            label: "Total",
            value: categories.length,
            icon: "🗂️",
            bg: "bg-green-50",
            color: "text-black ",
          },
          {
            label: "Active",
            value: activeCount,
            icon: "✅",
            bg: "bg-emerald-50",
            color: "text-emerald-700",
          },
          {
            label: "Inactive",
            value: inactiveCount,
            icon: "⏸️",
            bg: "bg-gray-50",
            color: "text-gray-500",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-2xl border border-gray-100 p-3 sm:p-4 flex items-center gap-2 sm:gap-4 shadow-sm",
              s.bg,
            )}
          >
            <div className="text-xl sm:text-2xl">{s.icon}</div>
            <div>
              <p className="text-[10px]  sm:text-xs text-black font-medium">
                {s.label}
              </p>
              <p
                className={cn(
                  "text-xl sm:text-2xl font-bold font-mono tracking-tight",
                  s.color,
                )}
              >
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 sm:px-5 py-4 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 rounded-xl px-3 py-2 w-full sm:w-64 transition-all">
            <span className="text-gray-400 text-sm">🔍</span>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search categories…"
              className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {["all", "active", "inactive"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={cn(
                  "flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all",
                  statusFilter === s
                    ? "bg-white text-(!--color-primary) shadow-sm"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 sm:ml-auto">
            <span className="text-xs text-gray-400 font-medium">Sort:</span>
            {[
              ["name", "Name"],
              ["createdAt", "Date"],
            ].map(([col, label]) => (
              <button
                key={col}
                onClick={() => handleSort(col)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                  sortBy === col
                    ? "bg-green-50 text-(--color-primary) border-green-200"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
                )}
              >
                {label} <SortIcon col={col} />
              </button>
            ))}
          </div>

          {selected.length > 0 && (
            <Btn
              variant="danger"
              size="sm"
              onClick={() => setDeleteModal("bulk")}
            >
              🗑 Delete ({selected.length})
            </Btn>
          )}
        </div>

        {/* Table — desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-t border-gray-100">
                <th className="px-5 py-3 w-10">
                  <Checkbox
                    checked={allChecked}
                    indeterminate={someChecked}
                    onChange={toggleAll}
                  />
                </th>
                {[
                  "Category",
                  "Slug",
                  "Parent",
                  "Status",
                  "Products",
                  "Created",
                  "Actions",
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
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">🔍</span>
                      <p className="font-medium">No categories found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((cat) => (
                  <tr
                    key={cat.id}
                    className={cn(
                      "border-t border-gray-100 transition-colors",
                      selected.includes(cat.id)
                        ? "bg-green-50/60"
                        : "hover:bg-gray-50/60",
                    )}
                  >
                    <td className="px-5 py-4">
                      <Checkbox
                        checked={selected.includes(cat.id)}
                        onChange={() => toggleOne(cat.id)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0 border border-green-100">
                          {cat.icon}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {cat.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 max-w-[180px]">
                            {cat.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-mono">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">
                        {getParentName(cat.parent)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge status={cat.status} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-bold text-gray-800">
                        {cat.products}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-400">
                        {cat.createdAt}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Btn
                          variant="secondary"
                          size="sm"
                          onClick={() => onEdit(cat)}
                        >
                          ✏️ Edit
                        </Btn>
                        <Btn
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => {
                            setDeleteModal("single");
                            setDeleteTarget(cat.id);
                          }}
                        >
                          🗑
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards — mobile */}
        <div className="md:hidden divide-y divide-gray-100 border-t border-gray-100">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
              <span className="text-4xl">🔍</span>
              <p className="font-medium">No categories found</p>
            </div>
          ) : (
            paginated.map((cat) => (
              <div
                key={cat.id}
                className={cn(
                  "p-4 transition-colors",
                  selected.includes(cat.id)
                    ? "bg-green-50/60"
                    : "hover:bg-gray-50/40",
                )}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selected.includes(cat.id)}
                    onChange={() => toggleOne(cat.id)}
                  />
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0 border border-green-100">
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-gray-800">
                        {cat.name}
                      </p>
                      <Badge status={cat.status} />
                    </div>
                    <code className="text-[11px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono mt-1 inline-block">
                      {cat.slug}
                    </code>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>Parent: {getParentName(cat.parent)}</span>
                      <span>•</span>
                      <span>{cat.products} products</span>
                      <span>•</span>
                      <span>{cat.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 ml-11">
                  <Btn
                    variant="secondary"
                    size="sm"
                    onClick={() => onEdit(cat)}
                  >
                    ✏️ Edit
                  </Btn>
                  <Btn
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => {
                      setDeleteModal("single");
                      setDeleteTarget(cat.id);
                    }}
                  >
                    🗑 Delete
                  </Btn>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing {(page - 1) * PER_PAGE + 1}–
              {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}{" "}
              results
            </p>
            <div className="flex items-center gap-1.5">
              <Btn
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </Btn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-semibold transition-all",
                    page === p
                      ? "bg-(--color-primary) text-white"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-(--color-primary)",
                  )}
                >
                  {p}
                </button>
              ))}
              <Btn
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </Btn>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Confirm Delete"
      >
        <div className="flex flex-col gap-4">
          {/* <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-3xl mx-auto">
            🗑️
          </div> */}
          <p className="text-center text-gray-700 text-sm leading-relaxed">
            {deleteModal === "bulk"
              ? `Are you sure you want to delete ${selected.length} selected categories? This action cannot be undone.`
              : "Are you sure you want to delete this category? This action cannot be undone."}
          </p>
          <div className="flex gap-3">
            <Btn
              variant="secondary"
              className="flex-1 justify-center"
              onClick={() => setDeleteModal(null)}
            >
              Cancel
            </Btn>
            <Btn
              variant="danger"
              className="flex-1 justify-center"
              onClick={confirmDelete}
            >
              Yes, Delete
            </Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ─── ADD / EDIT FORM (NO TABS) ────────────────── */
function CategoryForm({ categories, editData, onSave, onCancel, showToast }) {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    name: editData?.name ?? "",
    slug: editData?.slug ?? "",
    description: editData?.description ?? "",
    parent: editData?.parent ?? "",
    status: editData?.status ?? "active",
    icon: editData?.icon ?? "🗂️",
    metaTitle: editData?.metaTitle ?? "",
    metaDesc: editData?.metaDesc ?? "",
  });

  const [slugManual, setSlugManual] = useState(isEdit);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [addCategory, { data, isLoading, isError }] = useAddCategoryMutation();
  const [
    updateCategory,
    { data: updateData, isLoading: updateLoading, isError: updateIsError },
  ] = useUpdateCategoryMutation();

  useEffect(() => {
    if (data) {
      Notification(data.message, "success");
      onCancel();
    }
    if (isError) {
      console.log("Error:", isError);
      Notification(isError?.data?.message || "Something went wrong", "error");
    }
  }, [data, isError]);

  useEffect(() => {
    if (updateData) {
      Notification(updateData.message, "success");
      onCancel();
    }
    if (updateIsError) {
      console.log("Error:", updateIsError);
      Notification(
        updateIsError?.data?.message || "Something went wrong",
        "error",
      );
    }
  }, [updateData, updateIsError]);

  const ICONS = [
    "🗂️",
    "🥦",
    "🍎",
    "🥩",
    "🥛",
    "🥬",
    "🥕",
    "🍊",
    "🍞",
    "🐟",
    "🧀",
    "🥚",
    "🌽",
    "🧅",
    "🍇",
    "🫐",
    "🥑",
    "🧄",
  ];

  useEffect(() => {
    if (!slugManual) setForm((f) => ({ ...f, slug: slugify(f.name) }));
  }, [form.name, slugManual]);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Category name is required";
    if (!form.slug.trim()) e.slug = "Slug is required";
    if (form.metaTitle.length > 60)
      e.metaTitle = "Meta title should be under 60 characters";
    if (form.metaDesc.length > 160)
      e.metaDesc = "Meta description should be under 160 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      showToast("Please fix the errors.", "error");
      return;
    }
    const object = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      parent: form.parent,
      status: form.status,
      icon: form.icon,
      metaTitle: form.metaTitle,
      metaDesc: form.metaDesc,
    };
    console.log({ object });
    if (isEdit) {
      await updateCategory({ id: editData.id, ...object });
    } else {
      await addCategory(object);
    }
    showToast(isEdit ? "Category updated!" : "Category created!", "success");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const parentOptions = categories.filter((c) => c.id !== editData?.id);
  const metaTitleLen = form.metaTitle.length;
  const metaDescLen = form.metaDesc.length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors flex-shrink-0"
          >
            ←
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight truncate">
              {isEdit ? "Edit Category" : "Add New Category"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5 truncate">
              {isEdit
                ? `Editing: ${editData.name}`
                : "Fill in the details below"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-shrink-0">
          <Btn
            variant="secondary"
            onClick={onCancel}
            className="flex-1 sm:flex-none justify-center"
          >
            Discard
          </Btn>
          <Btn
            variant="primary"
            onClick={handleSubmit}
            className="flex-1 sm:flex-none justify-center"
          >
            {isEdit ? "💾 Save" : "✅ Create"}
          </Btn>
        </div>
      </div>

      {/* Two-column layout on large screens, stacked on mobile */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* ── LEFT: Main Form (all sections visible, no tabs) ── */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">
          {/* ① Basic Information */}
          <SectionCard title="Basic Information" icon="📋">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Fresh Vegetables"
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 bg-white placeholder-gray-400 outline-none transition-all",
                  "border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100",
                  errors.name && "border-red-400",
                )}
              />
              {errors.name && (
                <p className="text-[11px] text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative min-w-0">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono select-none hidden sm:inline">
                    /categories/
                  </span>
                  <input
                    value={form.slug}
                    onChange={(e) => {
                      setSlugManual(true);
                      set("slug", e.target.value);
                    }}
                    placeholder="auto-generated-slug"
                    className={cn(
                      "w-full sm:pl-[100px] pl-3.5 pr-3.5 py-2.5 rounded-xl border text-sm text-gray-800 bg-white placeholder-gray-400 outline-none transition-all font-mono",
                      "border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100",
                      errors.slug && "border-red-400",
                    )}
                  />
                </div>
                <button
                  onClick={() => {
                    setSlugManual(false);
                    set("slug", slugify(form.name));
                  }}
                  title="Regenerate"
                  className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 flex-shrink-0"
                >
                  🔄
                </button>
              </div>
              {errors.slug && (
                <p className="text-[11px] text-red-500">{errors.slug}</p>
              )}
              <p className="text-[11px] text-gray-400">
                Auto-generated from name. Click 🔄 to reset.
              </p>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe this category…"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm text-gray-800 bg-white placeholder-gray-400 outline-none transition-all resize-none"
              />
              <p className="text-[11px] text-gray-400">
                Optional. Shown on category pages.
              </p>
            </div>

            {/* Parent + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Parent Category
                </label>
                <select
                  value={form.parent ?? ""}
                  onChange={(e) =>
                    set("parent", e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 text-sm text-gray-800 bg-white outline-none appearance-none cursor-pointer"
                >
                  <option value="">— None (Top Level) —</option>
                  {parentOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </label>
                <div className="flex gap-2">
                  {["active", "inactive"].map((s) => (
                    <button
                      key={s}
                      onClick={() => set("status", s)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl border text-sm font-semibold capitalize transition-all",
                        form.status === s
                          ? s === "active"
                            ? "bg-(--color-primary) text-white border-(--color-primary) shadow-sm"
                            : "bg-gray-500 text-white border-gray-500"
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300",
                      )}
                    >
                      {s === "active" ? "✅" : "⏸️"}{" "}
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* ② Icon & Image */}
          <SectionCard title="Icon & Image" icon="🖼️">
            {/* Icon Picker */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Choose Icon Emoji
              </label>
              <div className="flex flex-wrap gap-2">
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => set("icon", ic)}
                    className={cn(
                      "w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-xl transition-all border",
                      form.icon === ic
                        ? "bg-green-100 border-(--color-primary) scale-110 shadow"
                        : "bg-gray-50 border-gray-200 hover:border-(--color-primary) hover:bg-(--color-primary)/10",
                    )}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Upload Category Image
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-200 hover:border-green-400 rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all group"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-28 h-28 object-cover rounded-xl"
                  />
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center text-2xl transition-colors">
                      📁
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700">
                        Click to upload
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG, WEBP up to 2MB
                      </p>
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              {imagePreview && (
                <button
                  onClick={() => setImagePreview(null)}
                  className="text-xs text-red-500 hover:text-red-600 font-medium w-fit"
                >
                  ✕ Remove Image
                </button>
              )}
            </div>
          </SectionCard>

          {/* ③ SEO */}
          <SectionCard title="SEO Settings" icon="🔍">
            {/* Meta Title */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Meta Title
                </label>
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    metaTitleLen > 60 ? "text-red-500" : "text-gray-400",
                  )}
                >
                  {metaTitleLen}/60
                </span>
              </div>
              <input
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                placeholder="SEO friendly page title…"
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 bg-white placeholder-gray-400 outline-none transition-all",
                  "border-gray-200 hover:border-gray-300 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/30",
                  errors.metaTitle && "border-red-400",
                )}
              />
              {errors.metaTitle && (
                <p className="text-[11px] text-red-500">{errors.metaTitle}</p>
              )}
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div
                  className={cn(
                    "h-1 rounded-full transition-all",
                    metaTitleLen > 60
                      ? "bg-red-500"
                      : metaTitleLen > 45
                        ? "bg-yellow-500"
                        : "bg-green-500",
                  )}
                  style={{
                    width: `${Math.min(100, (metaTitleLen / 60) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Meta Description */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Meta Description
                </label>
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    metaDescLen > 160 ? "text-red-500" : "text-gray-400",
                  )}
                >
                  {metaDescLen}/160
                </span>
              </div>
              <textarea
                value={form.metaDesc}
                onChange={(e) => set("metaDesc", e.target.value)}
                placeholder="Brief description for search engines…"
                rows={4}
                className={cn(
                  "w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 bg-white placeholder-gray-400 outline-none transition-all resize-none",
                  "border-gray-200 hover:border-gray-300 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/30",
                  errors.metaDesc && "border-red-400",
                )}
              />
              {errors.metaDesc && (
                <p className="text-[11px] text-red-500">{errors.metaDesc}</p>
              )}
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div
                  className={cn(
                    "h-1 rounded-full transition-all",
                    metaDescLen > 160
                      ? "bg-red-500"
                      : metaDescLen > 130
                        ? "bg-yellow-500"
                        : "bg-(--color-primary)",
                  )}
                  style={{
                    width: `${Math.min(100, (metaDescLen / 160) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Search Preview */}
            {(form.metaTitle || form.metaDesc) && (
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-2">
                  Search Preview
                </p>
                <p className="text-blue-600 text-sm font-medium hover:underline cursor-pointer truncate">
                  {form.metaTitle || form.name || "Page Title"}
                </p>
                <p className="text-(--color-primary) text-xs mt-0.5">
                  yourstore.com/categories/{form.slug || "slug"}
                </p>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                  {form.metaDesc ||
                    form.description ||
                    "No description provided."}
                </p>
              </div>
            )}
          </SectionCard>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-5 flex-shrink-0">
          {/* Live Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              Live Preview
            </h3>
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-20 h-20 rounded-2xl bg-green-50 border-2 border-green-100 flex items-center justify-center text-5xl shadow-inner">
                {form.icon || "🗂️"}
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 text-lg leading-tight">
                  {form.name || "Category Name"}
                </p>
                {form.parent && (
                  <p className="text-xs text-gray-400 mt-1">
                    Under:{" "}
                    {categories.find((c) => c.id === Number(form.parent))?.name}
                  </p>
                )}
                <code className="text-xs text-gray-400 mt-1 block font-mono">
                  /{form.slug || "slug"}
                </code>
              </div>
              <Badge status={form.status} />
              {form.description && (
                <p className="text-xs text-gray-500 text-center line-clamp-2">
                  {form.description}
                </p>
              )}
            </div>
          </div>

          {/* Quick Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Quick Details
            </h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Status</span>
              <button
                onClick={() =>
                  set(
                    "status",
                    form.status === "active" ? "inactive" : "active",
                  )
                }
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold transition-all",
                  form.status === "active"
                    ? "bg-green-100 text-(--color-primary) hover:bg-red-100 hover:text-red-600"
                    : "bg-gray-100 text-gray-500 hover:bg-(--color-primary) hover:text-(--color-primary)",
                )}
              >
                {form.status === "active" ? "Active" : "Inactive"}
              </button>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Icon</span>
              <span className="text-xl">{form.icon}</span>
            </div>
            {isEdit && (
              <>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Products</span>
                  <span className="font-mono font-bold text-gray-800">
                    {editData.products}
                  </span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Created</span>
                  <span className="text-xs text-gray-400">
                    {editData.createdAt}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Save / Cancel */}
          <Btn
            variant="primary"
            className="w-full justify-center py-3"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {/* {loading ? "Saving..." : null} */}
            {isEdit ? "💾 Save Changes" : "✅ Create Category"}
          </Btn>
          <Btn
            variant="secondary"
            className="w-full justify-center"
            onClick={onCancel}
          >
            Cancel
          </Btn>
        </div>
      </div>
    </div>
  );
}

/* ─── ROOT APP ────────────────────────────────── */
export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [view, setView] = useState("list");
  const [editData, setEditData] = useState(null);
  const [toasts, setToasts] = useState([]);

  const { data, isLoading } = useGetAllCategoriesQuery();
  // console.log("Categories from API:", data, "Loading:", isLoading);
  const [deleteCategory, { data: deleteData, isError: deleteError }] =
    useDeleteCategoryMutation();

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  useEffect(() => {
    if (deleteData) {
      showToast(deleteData.message, "success");
    } else if (deleteError) {
      showToast(deleteError.data.message, "error");
    }
  }, [deleteData, deleteError]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  };

  const handleAdd = () => {
    setEditData(null);
    setView("add");
  };
  const handleEdit = (cat) => {
    setEditData(cat);
    setView("edit");
  };
  const handleCancel = () => {
    setView("list");
    setEditData(null);
  };

  const handleSave = (formData) => {
    if (editData) {
      setCategories((cats) =>
        cats.map((c) => (c.id === editData.id ? { ...c, ...formData } : c)),
      );
    } else {
      const newCat = {
        ...formData,
        id: Date.now(),
        products: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setCategories((cats) => [...cats, newCat]);
    }
    setView("list");
  };

  const handleDelete = async (ids) => {
    console.log("Deleting categories with IDs:", ids);
    const object = {
      id: ids[0],
    };
    await deleteCategory(object);
    // setCategories((cats) => cats.filter((c) => !ids.includes(c.id)));
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-3 sm:p-6"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto">
        {view === "list" && (
          <CategoryList
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            showToast={showToast}
          />
        )}
        {(view === "add" || view === "edit") && (
          <CategoryForm
            categories={categories}
            editData={editData}
            onSave={handleSave}
            onCancel={handleCancel}
            showToast={showToast}
          />
        )}
      </div>
      <Toast toasts={toasts} />
    </div>
  );
}
