import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Shield,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
} from 'lucide-react';
import { adminApi } from '../../services/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'active' | 'inactive'
  const [actionSuccess, setActionSuccess] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'All') params.status = statusFilter;

      const data = await adminApi.getUsers(params);
      setUsers(data || []);
    } catch (err) {
      console.warn('Failed to load users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadUsers();
  };

  const handleToggleStatus = async (user) => {
    const actionText = user.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${actionText} user "${user.name}"?`)) return;

    try {
      await adminApi.toggleUserStatus(user._id, !user.isActive);
      setActionSuccess(`User "${user.name}" has been ${user.isActive ? 'deactivated' : 'activated'}.`);
      setTimeout(() => setActionSuccess(''), 3000);
      loadUsers();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    if (!window.confirm(`Change role of "${user.name}" to ${newRole}?`)) return;

    try {
      await adminApi.updateUserRole(user._id, newRole);
      setActionSuccess(`User role updated to ${newRole}.`);
      setTimeout(() => setActionSuccess(''), 3000);
      loadUsers();
    } catch (err) {
      alert(`Role update failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Citizen User Accounts & Role Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            User Management
          </h1>
          <p className="text-xs text-slate-400">
            View registered users, search by name/email/phone, activate/deactivate access, and inspect analysis metrics.
          </p>
        </div>

        <button
          onClick={loadUsers}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-2 text-xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users by Name, Email, or Mobile Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-amber-500"
          />
        </form>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-400 text-[11px] mr-1">Status:</span>
          {[
            { label: 'All Users', val: 'All' },
            { label: 'Active', val: 'active' },
            { label: 'Inactive', val: 'inactive' },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setStatusFilter(item.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === item.val
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Registration Date</th>
                <th className="py-3.5 px-4 text-center">Analyses</th>
                <th className="py-3.5 px-4 text-center">Complaints</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No users found matching search criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 font-bold flex items-center justify-center font-mono">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200">{u.name}</p>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                              u.role === 'Admin'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            }`}
                          >
                            {u.role.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300 space-y-0.5">
                      <div className="flex items-center gap-1 text-[11px] text-slate-300">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{u.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-200">
                      {u.analysisCount ?? 0}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400">
                      {u.complaintCount ?? 0}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          u.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            u.isActive
                              ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
