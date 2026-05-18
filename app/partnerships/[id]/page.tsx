import { prisma } from '@/app/lib/db';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: { id: string };
}

export default async function PartnershipDetailsPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken');

  if (!token) {
    redirect('/login');
  }

  const org = await prisma.organization.findUnique({
    where: { id: params.id },
  });
  if (!org) return notFound();

  return (
    <main className="main-content max-w-5xl mx-auto px-8 py-12 flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">{org.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization Details */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-2">Organization Details</h2>
          <div className="space-y-2">
            <div><strong>Industry:</strong> {org.industry || 'N/A'}</div>
            <div><strong>Status:</strong> {org.status}</div>
            <div><strong>Website:</strong> {org.website ? <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-primary">{org.website}</a> : 'N/A'}</div>
            <div><strong>Partnership Date:</strong> {org.partnershipDate ? new Date(org.partnershipDate).toLocaleDateString() : 'N/A'}</div>
          </div>
        </div>
        {/* Description */}
        <div className="bg-card border border-border rounded-lg p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground">{org.description || 'No description available.'}</p>
        </div>
      </div>
    </main>
  );
}
