import React from 'react';
import clsx from 'clsx';

const TONES = [
  { value: 'professional', label: 'WARM & PROFESSIONAL' },
  { value: 'formal', label: 'STRICT & FORMAL' },
  { value: 'casual', label: 'CASUAL & FRIENDLY' },
  { value: 'enthusiastic', label: 'ENTHUSIASTIC & DRIVEN' },
];

export default function AIEmailSection({
  aiText,
  setAiText,
  tone,
  setTone,
  onSend,
  loading,
}: {
  aiText: string;
  setAiText: (v: string) => void;
  tone: string;
  setTone: (v: string) => void;
  onSend: () => void;
  loading?: boolean;
}) {
  return (
    <div className="dashboard-surface" style={{ width: '100%', margin: 0, padding: 0 }}>
      <div className="component-stack" style={{ gap: 24 }}>
        <div className="tone-segmented" style={{ marginBottom: 16 }}>
          {TONES.map((t) => (
            <button
              key={t.value}
              type="button"
              className={clsx(tone === t.value && 'selected')}
              onClick={() => setTone(t.value)}
              disabled={loading}
            >
              {t.label}
            </button>
          ))}
        </div>
        <textarea
          className="w-full rounded-xl border p-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical shadow-sm"
          style={{ fontFamily: 'JetBrains Mono, Fira Mono, Menlo, Consolas, monospace', minHeight: 180, maxHeight: 400, background: '#f8fafc', lineHeight: 1.6 }}
          value={aiText}
          onChange={e => setAiText(e.target.value)}
          placeholder="AI-generated email will appear here. You can edit before sending."
          disabled={loading}
        />
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16, width: '100%', justifyContent: 'flex-end' }}>
          <button
            className="btn-primary"
            onClick={onSend}
            disabled={loading}
            style={{ minWidth: 160 }}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}
