import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Loader2 className="animate-spin text-primary mb-6" size={56} />
      <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--primary)' }}>
        Verifying Mission Credentials...
      </span>
    </div>
  );
}
