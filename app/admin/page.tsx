'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { api } from '@/app/lib/api';

interface ActivityLog {
  id: string;
  user: { fullName: string };
  action: string;
  targetType: string;
  targetName?: string;
  additionalInfo?: string;
  createdAt: string;
}

const AdminPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getActivityLogs();
      setActivityLogs(data);
    } catch (e) {
      console.error('Error fetching activity logs:', e);
      setActivityLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch = log.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.additionalInfo?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const getActionStyles = (action: string) => {
    switch (action) {
      case 'ADDED': return 'bg-success/10 text-success border-success/20';
      case 'EDITED': return 'bg-primary/10 text-primary border-primary/20';
      case 'DELETED': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'LOGGED IN': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-8">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">Admin Controls</h1>
            <p className="mt-3 text-lg text-muted-foreground">Monitor system activity and manage logs.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-card px-5 py-3 rounded-xl border border-border shadow-soft">
            <Calendar size={18} className="text-primary" />
            <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </section>

        {/* Filters */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search by staff, target, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
            />
          </div>
          <div className="md:col-span-5 relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" size={16} />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-xl text-sm font-medium text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
            >
              <option value="all">All Actions</option>
              <option value="ADDED">Added</option>
              <option value="EDITED">Edited</option>
              <option value="DELETED">Deleted</option>
              <option value="LOGGED IN">Logged In</option>
            </select>
          </div>
        </section>

        {/* Table */}
        <section className="bg-card border border-border rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Staff</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-sm text-muted-foreground">Loading activity logs...</p>
                    </td>
                  </tr>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <tr key={log.id} className={clsx("hover:bg-muted/30 transition-colors duration-200", index % 2 === 0 ? "bg-background" : "bg-muted/10")}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                            {log.user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                          </div>
                          <span className="text-sm font-medium text-foreground">{log.user?.fullName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={clsx('px-3 py-1.5 rounded-lg text-xs font-bold border uppercase tracking-wide', getActionStyles(log.action))}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-foreground font-medium">{log.targetName || log.targetType}</td>
                      <td className="px-6 py-5 text-sm text-muted-foreground">{log.additionalInfo || 'No details'}</td>
                      <td className="px-6 py-5 text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <Search size={32} className="mx-auto text-muted-foreground mb-4" />
                      <p className="text-base font-medium text-foreground mb-1">No matching logs</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pagination */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">1–{filteredLogs.length}</span> of <span className="font-semibold text-foreground">{activityLogs.length}</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted hover:border-primary/20 transition-all duration-200 shadow-sm hover:shadow-md">
              <ChevronLeft size={16} /> Previous
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted hover:border-primary/20 transition-all duration-200 shadow-sm hover:shadow-md">
              Next <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminPage;

