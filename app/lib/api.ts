const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const api = {
  async getPartners() {
    const res = await fetch(`${API_BASE}/api/partners`);
    if (!res.ok) throw new Error('Failed to fetch partners');
    return res.json();
  },

  async getActivityLogs() {
    const res = await fetch(`${API_BASE}/api/activity-logs`);
    if (!res.ok) throw new Error('Failed to fetch activity logs');
    return res.json();
  },

  async generateEmail(data: { partnerId: string }) {
    const res = await fetch(`${API_BASE}/api/generate-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to generate email');
    return res.json();
  },
};
