'use client';

import { useAuth } from '@/app/context/AuthContext';
import Sidebar from '@/app/components/sidebar';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Redirect unauthenticated users to login (except when already on login)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Show nothing while loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-center space-y-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-primary animate-spin mx-auto"
            style={{
              borderColor: 'rgba(14, 165, 164, 0.1)',
              borderTopColor: 'var(--primary)',
            }}
          />
          <p style={{ color: 'var(--muted-foreground)' }} className="text-sm font-medium">
            Loading Mission Control...
          </p>
        </div>
      </div>
    );
  }

  // Only show login page when unauthenticated
  if (!isAuthenticated) {
    // Only render the login page route
    if (pathname === '/login') {
      return <div style={{ backgroundColor: 'var(--background)' }}>{children}</div>;
    } else {
      // Redirect any other route to login
      if (typeof window !== 'undefined') {
        window.location.replace('/login');
      }
      return null;
    }
  }

  // Show dashboard with sidebar for authenticated users
  return (
    <div className="app-shell flex min-h-screen w-full">
      <aside className="sidebar flex-shrink-0 h-screen sticky top-0 z-40">
        <Sidebar />
      </aside>
      <main className="main-content flex flex-col flex-1 min-h-screen bg-[var(--background)]">
        {children}
      </main>
    </div>
  );
}
