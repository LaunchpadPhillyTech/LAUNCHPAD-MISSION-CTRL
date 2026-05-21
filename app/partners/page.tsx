'use client';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Mail, Edit2, TrendingUp, Trash2, Building2 } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/app/components/Button';

interface Partner {
  id: string;
  organizationName: string;
  logoUrl?: string | null;
  industry?: string | null;
  partnerStatus?: string | null;
  partnerType?: string | null;
  courseNumber?: number | null;
  earlyReleaseForSeniors: boolean;
  tags: string[];
  contacts: Array<{ id: string; name: string; email: string; title?: string | null }>;
}


function PartnerCard({ partner, onOpen }: { partner: Partner; onOpen: () => void }) {
  const primaryContact = partner.contacts[0];
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className="group flex bg-card border border-border rounded-lg p-4 hover:shadow-md hover:border-primary/20 transition-all items-center gap-4 min-h-[96px] max-h-[120px] cursor-pointer"
    >
      {partner.logoUrl && (
        <img src={partner.logoUrl} alt={partner.organizationName} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
      )}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 mb-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary truncate">{partner.organizationName}</h3>
          <span className={clsx(
            'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border',
            partner.partnerStatus === 'Active' ? 'bg-success/10 text-success border-success/20' :
            partner.partnerStatus === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' :
            'bg-muted/10 text-muted-foreground border-muted/20'
          )}>{partner.partnerStatus || 'N/A'}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-1">
          {partner.industry && <span className="bg-muted/50 px-2 py-0.5 rounded">{partner.industry}</span>}
          {partner.partnerType && <span className="bg-muted/50 px-2 py-0.5 rounded">{partner.partnerType}</span>}
          {partner.courseNumber && <span className="bg-muted/50 px-2 py-0.5 rounded">Course #{partner.courseNumber}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs">
          {primaryContact?.name && <span className="font-medium">{primaryContact.name}</span>}
          {primaryContact?.email && <span className="text-primary">{primaryContact.email}</span>}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <Link href={`/partners/${partner.id}/edit`} onClick={e => e.stopPropagation()} className="p-2 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors" title="Edit partner"><Edit2 size={16} /></Link>
        <Link href={`/email?partnerId=${partner.id}`} onClick={e => e.stopPropagation()} className="p-2 rounded bg-success/10 text-success hover:bg-success hover:text-white transition-colors" title="View interactions"><TrendingUp size={16} /></Link>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center py-10">
      <span className="text-muted-foreground">Loading...</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Building2 size={48} className="text-muted-foreground mb-4" />
      <p className="text-lg font-semibold text-foreground">No partners found</p>
      <p className="text-sm text-muted-foreground mt-1">Add a new partner to get started.</p>
    </div>
  );
}


export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrganizations() {
      setLoading(true);
      try {
        const res = await fetch('/api/organizations');
        if (!res.ok) throw new Error('Failed to fetch organizations');
        const data = await res.json();
        // Map organizations to Partner type for display
        const mapped = (Array.isArray(data) ? data : []).map((org: any) => ({
          id: org.id,
          organizationName: org.name,
          logoUrl: org.logoUrl,
          industry: org.industry,
          partnerStatus: org.status,
          partnerType: org.partnerType,
          courseNumber: org.courseNumber,
          earlyReleaseForSeniors: org.earlyReleaseForSeniors,
          tags: org.tags || [],
          contacts: org.contacts || [],
        }));
        setPartners(mapped);
      } catch (error) {
        console.error(error);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrganizations();
  }, []);


  // Delete logic can be added if needed

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Partners Directory</h1>
          <Link href="/partners/new">
            <Button className="flex items-center gap-2">
              <Plus size={18} /> Add Partner
            </Button>
          </Link>
        </div>
        {loading ? (
          <LoadingState />
        ) : partners.length > 0 ? (
          <div className="flex flex-col gap-3">
            {partners.map((p) => (
              <PartnerCard key={p.id} partner={p} onOpen={() => router.push(`/partners/${p.id}`)} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

