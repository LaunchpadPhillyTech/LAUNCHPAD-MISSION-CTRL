'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Mail } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  title?: string | null;
  type: 'leadership' | 'primary' | 'secondary';
}

interface PartnerDetails {
  id: string;
  organizationName: string;
  partnerType?: string | null;
  partnerStatus?: string | null;
  officialStartDate?: string | null;
  earlyReleaseForSeniors: boolean;
  pastCohorts: string[];
  contacts: Contact[];
  activityLogs: Array<{
    id: string;
    action: string;
    details: string;
    createdAt: string;
  }>;
}

export default function PartnerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [partner, setPartner] = useState<PartnerDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchPartner() {
      setLoading(true);
      const res = await fetch(`/api/partners/${id}`);
      const data = await res.json();
      setPartner(data);
      setLoading(false);
    }
    fetchPartner();
  }, [id]);

  if (loading || !partner) return <div className="p-10 text-center">Loading...</div>;

  const leadership = partner.contacts.filter(c => c.type === 'leadership');
  const primary = partner.contacts.filter(c => c.type === 'primary');
  const secondary = partner.contacts.filter(c => c.type === 'secondary');

  return (
    <div className="w-full max-w-5xl mx-auto px-8 py-12 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">{partner.organizationName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Leadership */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-2">Leadership</h2>
          {leadership.length === 0 && <div className="text-muted-foreground text-sm">No leadership contacts.</div>}
          {leadership.map(c => (
            <div key={c.id} className="mb-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-muted-foreground">{c.title}</div>
              <div className="text-sm text-primary">{c.email}</div>
            </div>
          ))}
        </div>
        {/* Primary */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-2">Primary</h2>
          {primary.length === 0 && <div className="text-muted-foreground text-sm">No primary contacts.</div>}
          {primary.map(c => (
            <div key={c.id} className="mb-3 flex items-center gap-2">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-muted-foreground">{c.title}</div>
                <div className="text-sm text-primary">{c.email}</div>
              </div>
              <button
                className="ml-2 p-2 rounded bg-primary text-white hover:bg-primary/80"
                onClick={() => window.location.href = `mailto:${c.email}`}
                title="Quick Email"
              >
                <Mail size={16} />
              </button>
            </div>
          ))}
        </div>
        {/* Secondary */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-2">Secondary</h2>
          {secondary.length === 0 && <div className="text-muted-foreground text-sm">No secondary contacts.</div>}
          {secondary.map(c => (
            <div key={c.id} className="mb-3">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-muted-foreground">{c.title}</div>
              <div className="text-sm text-primary">{c.email}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Sidebar Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="md:col-start-3 bg-card border border-border rounded-lg p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-2">Partnership Status</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div><span className="font-medium">Partner Type:</span> {partner.partnerType || 'N/A'}</div>
            <div><span className="font-medium">Partner Status:</span> {partner.partnerStatus || 'N/A'}</div>
            <div><span className="font-medium">Official Start Date:</span> {partner.officialStartDate ? new Date(partner.officialStartDate).toLocaleDateString() : 'N/A'}</div>
            <div>
              <span className="font-medium">Early Release Eligibility:</span>
              {partner.earlyReleaseForSeniors ? (
                <span className="ml-2 px-2 py-0.5 rounded bg-success/10 text-success">True</span>
              ) : (
                <span className="ml-2 px-2 py-0.5 rounded bg-destructive/10 text-destructive">False</span>
              )}
            </div>
            <div>
              <span className="font-medium">Past Cohorts:</span>
              <ul className="ml-4 mt-1 list-disc">
                {partner.pastCohorts.length === 0 ? <li className="text-muted-foreground">None</li> : partner.pastCohorts.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Recent Activity Log */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Recent Activity Log</h2>
        <div className="bg-card border border-border rounded-lg p-4">
          {partner.activityLogs.length === 0 ? (
            <div className="text-muted-foreground text-sm">No recent activity.</div>
          ) : (
            <ul className="divide-y divide-border/50">
              {partner.activityLogs.map(log => (
                <li key={log.id} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-medium">{log.action}</span>: {log.details}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
