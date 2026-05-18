'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import clsx from 'clsx';
import { AlertCircle, Mail, Users, TrendingUp, ClipboardList } from 'lucide-react';

interface EmailLog {
  id: string;
  userId: string;
  to: string;
  subject: string;
  sentAt: Date;
}

interface DashboardData {
  totalStudents: number;
  activeStudents: number;
  earlyReleaseEligible: number;
  addedThisMonth: number;
  recentEmails: EmailLog[];
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    return null; // Or a redirect component
  }
  
  const quickActions = [
    { label: 'Add Student', description: 'Add a new student', icon: Users, href: '/students/add', color: 'primary' as const },
    { label: 'Log Interaction', description: 'Record interaction', icon: ClipboardList, href: '/interactions/log', color: 'accent' as const },
    { label: 'Manage Partners', description: 'Update partners', icon: Users, href: '/partners', color: 'success' as const },
    { label: 'Send Email', description: 'Launch outreach', icon: Mail, href: '/email', color: 'warning' as const },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full p-8 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Mission Control Dashboard</h1>
        </div>
      </div>

      {error && (
        <div className="w-full bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {stats && !error && (
        <>
          {/* Top Row - Briefing Area */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="group flex flex-col items-center p-3 bg-muted/50 rounded-lg transition-all hover:bg-muted hover:shadow-sm"
                    >
                      <div className={clsx(
                        'w-6 h-6 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110',
                        action.color === 'primary' ? 'bg-primary/10 text-primary' :
                        action.color === 'accent' ? 'bg-accent/10 text-accent' :
                        action.color === 'success' ? 'bg-success/10 text-success' :
                        'bg-warning/10 text-warning'
                      )}>
                        <Icon size={14} />
                      </div>
                      <h4 className="font-medium text-xs text-foreground text-center">{action.label}</h4>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Daily Briefing */}
            <div className="bg-card border border-border rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <ul className="space-y-3">
                {stats.recentEmails.map((log: EmailLog) => (
                  <li key={log.id} className="flex items-center text-sm">
                    <Mail size={14} className="text-muted-foreground mr-3" />
                    <span className="text-muted-foreground">
                      Emailed <span className="font-semibold text-foreground">{log.to}</span>
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {new Date(log.sentAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card border border-border rounded-xl shadow-soft p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <AlertCircle size={18} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Daily Reminder</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Prioritize partner communication and verify student eligibility for early release missions.
              </p>
              <Link
                href="/email"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Mail size={16} />
                Check Email
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <StatCard label="Total Students" value={stats.totalStudents} color="primary" />
            <StatCard label="Active Students" value={stats.activeStudents} color="primary" />
            <StatCard label="Early Release Ready" value={stats.earlyReleaseEligible} color="success" />
            <StatCard label="Added This Month" value={stats.addedThisMonth} color="accent" />
          </div>

          {/* Recent Activity */}
          <div className="w-full bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <ul className="divide-y divide-border">
              {stats.recentEmails.length === 0 ? (
                <li className="py-3 flex items-center gap-3 text-muted-foreground">No recent activity.</li>
              ) : (
                stats.recentEmails.map((log) => (
                  <li key={log.id} className="py-3 flex flex-col gap-1">
                    <span className="font-medium text-foreground">{log.subject || 'Email Sent'}</span>
                    <span className="text-sm text-muted-foreground">{log.to}</span>
                    <span className="text-xs text-muted-foreground">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(log.sentAt))}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
  color: 'primary' | 'success' | 'accent' | 'warning';
};

function StatCard({ label, value, color }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    primary: 'text-primary',
    success: 'text-success',
    accent: 'text-accent',
    warning: 'text-warning',
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 transition-all hover:shadow-sm">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className={clsx('text-2xl font-bold', colorClasses[color])}>{value}</p>
    </div>
  );
}



