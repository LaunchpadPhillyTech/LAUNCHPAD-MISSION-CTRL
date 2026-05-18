import { prisma } from '@/app/lib/db';
import Link from 'next/link';
import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function PartnershipsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken');

  if (!token) {
    redirect('/login');
  }

  let organizations: Array<{
    id: string;
    name: string;
    logoUrl?: string | null;
    industry?: string | null;
    status: string;
    description?: string | null;
  }> = [];
  let error: unknown = null;
  try {
    organizations = await prisma.organization.findMany({ orderBy: { partnershipDate: 'desc' } });
  } catch (e) {
    error = e;
  }

  return (
    <main className="main-content">
      <h1 className="partnerships-title">Partnered Organizations</h1>
      {error ? (
        <div className="partnerships-error">Error loading organizations.</div>
      ) : organizations.length === 0 ? (
        <div className="partnerships-empty">No organizations found. Mission Control is standing by.</div>
      ) : (
        <div className="partnerships-gallery">
          {organizations.map((org) => (
            <div className="card" key={org.id}>
              <span className={`status-badge ${org.status === 'Active' ? 'active' : 'inactive'}`}>{org.status}</span>
              {org.logoUrl && (
                <img src={org.logoUrl} alt={org.name} className="org-logo" />
              )}
              <div className="card-content">
                <h2 className="org-name">{org.name}</h2>
                <div className="org-industry">{org.industry}</div>
                <div className="org-description">{org.description}</div>
              </div>
              <Link href={`/organizations/${org.id}`} className="view-details-btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
