import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  Eye,
  Lock,
} from "lucide-react";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    // Mock API call
    const mockUsers = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        avatar:
          "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff",
        role: "super_admin",
        roleLabel: "Super Admin",
        lastLogin: "2024-01-15T10:30:00",
        status: "active",
        createdAt: "2023-01-01",
        permissions: ["all"],
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        avatar:
          "https://ui-avatars.com/api/?name=Jane+Smith&background=10B981&color=fff",
        role: "admin",
        roleLabel: "Admin",
        lastLogin: "2024-01-14T15:45:00",
        status: "active",
        createdAt: "2023-03-15",
        permissions: ["products", "orders", "customers"],
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        avatar:
          "https://ui-avatars.com/api/?name=Mike+Johnson&background=F59E0B&color=fff",
        role: "editor",
        roleLabel: "Editor",
        lastLogin: "2024-01-13T09:15:00",
        status: "active",
        createdAt: "2023-06-20",
        permissions: ["products", "blog"],
      },
      {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Wilson&background=EF4444&color=fff",
        role: "viewer",
        roleLabel: "Viewer",
        lastLogin: "2024-01-10T11:20:00",
        status: "inactive",
        createdAt: "2023-09-10",
        permissions: ["view"],
      },
      {
        id: 5,
        name: "David Brown",
        email: "david.brown@example.com",
        avatar:
          "https://ui-avatars.com/api/?name=David+Brown&background=8B5CF6&color=fff",
        role: "admin",
        roleLabel: "Admin",
        lastLogin: "2024-01-12T14:30:00",
        status: "active",
        createdAt: "2023-11-05",
        permissions: ["products", "orders", "customers", "reports"],
      },
    ];
    setUsers(mockUsers);
    setLoading(false);
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      super_admin: "bg-purple-100 text-purple-800",
      admin: "bg-blue-100 text-(--color-primary)",
      editor: "bg-green-100 text-green-800",
      viewer: "bg-gray-100 text-gray-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status) => {
    if (status === "active") {
      return {
        icon: <CheckCircle size={14} />,
        text: "Active",
        className: "bg-green-100 text-green-800",
      };
    }
    return {
      icon: <XCircle size={14} />,
      text: "Inactive",
      className: "bg-red-100 text-red-800",
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    superAdmins: users.filter((u) => u.role === "super_admin").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-8 h-8 text-(--color-primary)" />
                Admin Users
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Manage system administrators and their permissions
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/users/add")}
              className="w-full sm:w-auto bg-(--color-primary) cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-(--color-primary-hover) transition flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Invite New Admin
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-(--color-primary) rounded-full p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.inactive}
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Super Admins</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.superAdmins}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border cursor-pointer text-black border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Filter size={18} />
                  Filters
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Role
                    </label>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="w-full px-3 py-2 border cursor-pointer text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    >
                      <option value="all">All Roles</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filter by Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border text-black cursor-pointer border-gray-300 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Users Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const statusBadge = getStatusBadge(user.status);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
                        >
                          {user.roleLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${statusBadge.className}`}
                        >
                          {statusBadge.icon}
                          {statusBadge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/users/edit/${user.id}`)
                            }
                            className="text-(--color-primary) cursor-pointer hover:text-(--color-primary-hover)"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 cursor-pointer hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Cards - Mobile & Tablet */}
        <div className="lg:hidden space-y-4">
          {filteredUsers.map((user) => {
            const statusBadge = getStatusBadge(user.status);
            return (
              <div key={user.id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                      className="p-1 text-(--color-primary) hover:bg-(--color-primary-hover) rounded"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Role</p>
                      <span
                        className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
                      >
                        {user.roleLabel}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center gap-1 mt-1 px-2 py-1 text-xs font-semibold rounded-full ${statusBadge.className}`}
                      >
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Last Login</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {formatDate(user.lastLogin)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
