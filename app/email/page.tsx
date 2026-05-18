'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AIEmailSection from '../components/AIEmailSection';
import { clsx } from 'clsx';
import { sendEmailAction, generateAIEmailAction } from './actions';
import { Mail, Send, Save, Eye, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';

interface Organization {
  id: string;
  name: string;
  organizationName?: string;
  contacts: Array<{
    id: string;
    name: string;
    email: string;
    contactType: string;
  }>;
}

const EmailComposerPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [tone, setTone] = useState('professional');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [primaryContacts, setPrimaryContacts] = useState<{ email: string; name: string; org: string }[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [partners, setPartners] = useState<Organization[]>([]);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  // Auth Guard
  useEffect(() => {
    const checkAuth = async () => {
      // This is a client component, so we can't use server-side cookies()
      // We rely on the AuthContext, which should be initialized by now.
      if (!isLoading && !isAuthenticated) {
        router.replace('/login');
      }
    };
    checkAuth();
  }, [isAuthenticated, isLoading, router]);


  const insertableVariables = [
    'PartnerName',
    'Primary Contact',
    'Staff Name',
    'Interaction Date',
    'Student Count',
  ];

  const fetchPrimaryContacts = async () => {
    try {
      const res = await fetch(`${API_BASE}/partners`);
      if (res.ok) {
        const data = await res.json();
        // Flatten all primary contacts from all organizations
        const contacts = [];
        for (const partner of data) {
          if (partner.contacts && Array.isArray(partner.contacts)) {
            for (const c of partner.contacts) {
              if (c.contactType === 'PRIMARY' || c.contactType === 'primary') {
                contacts.push({
                  email: c.email,
                  name: c.name,
                  org: partner.organizationName || partner.name || '',
                });
              }
            }
          }
        }
        setPrimaryContacts(contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch(`${API_BASE}/partners`);
      if (res.ok) {
        const data = await res.json();
        setPartners(data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchPrimaryContacts();
      await fetchPartners();
      // Load from localStorage
      const savedDraft = localStorage.getItem('email_draft');
      if (savedDraft) {
        const { to, subject, body, selectedRecipient, tone, aiPrompt, selectedPartnerId } = JSON.parse(savedDraft);
        if (to) setTo(to);
        if (subject) setSubject(subject);
        if (body) setEmailBody(body);
        if (selectedRecipient) setSelectedRecipient(selectedRecipient);
        if (tone) setTone(tone);
        if (aiPrompt) setAiPrompt(aiPrompt);
        if (selectedPartnerId) setSelectedPartnerId(selectedPartnerId);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    // Save to localStorage
    const draft = { to, subject, body: emailBody, selectedRecipient, tone, aiPrompt, selectedPartnerId };
    localStorage.setItem('email_draft', JSON.stringify(draft));
  }, [to, subject, emailBody, selectedRecipient, tone, aiPrompt, selectedPartnerId]);



  const handleGenerateAI = async () => {
    if (!selectedPartnerId || !aiPrompt) {
      setMessage({ type: 'error', text: 'Select a partner and provide a prompt for AI' });
      return;
    }
    setAiLoading(true);
    setMessage(null);
    try {
      const { email } = await generateAIEmailAction({ userPrompt: aiPrompt, partnerId: selectedPartnerId, tone });
      const subjectMatch = email.match(/Subject: (.*)/i);
      const bodyMatch = email.replace(/Subject: .*/i, '').trim();
      if (subjectMatch) setSubject(subjectMatch[1]);
      setEmailBody(bodyMatch);
      setMessage({ type: 'success', text: 'AI Draft generated' });
    } catch (error) {
      setMessage({ type: 'error', text: 'AI Generation failed. Check API key.' });
    }
    setAiLoading(false);
  };

  const [isPending, startTransition] = useTransition();
  const handleSendEmail = () => {
    if (!to || !subject || !emailBody) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }
    setLoading(true);
    setMessage(null);
    startTransition(async () => {
      try {
        await sendEmailAction({ to, subject, text: emailBody });
        setMessage({ type: 'success', text: 'Email sent successfully!' });
        setTo('');
        setSubject('');
        setEmailBody('');
        localStorage.removeItem('email_draft');
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to send email.' });
      }
      setLoading(false);
    });
  };
  // Copy to clipboard
  const handleCopy = () => {
    if (emailBody) {
      navigator.clipboard.writeText(emailBody);
      setMessage({ type: 'success', text: 'Copied to clipboard!' });
    }
  };

  const handleRecipientSelect = (email: string) => {
    setSelectedRecipient(email);
    setTo(email);
  };

  const handleClear = () => {
    setTo('');
    setSubject('');
    setEmailBody('');
    setMessage(null);
    setSelectedPartnerId('');
    setAiPrompt('');
    localStorage.removeItem('email_draft');
  };

  return (
    <div className="min-h-screen bg-background font-sans p-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="page-wrapper" style={{ maxWidth: 1100, margin: '0 auto', gap: 24 }}>
        <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">Email Terminal</h1>
        <p className="text-muted-foreground font-semibold flex items-center gap-2 uppercase tracking-widest text-sm mb-6">
          <Mail size={18} className="text-primary" /> Strategic Communication Interface
        </p>
        {message && (
          <div className={clsx(
            'flex items-center gap-4 px-8 py-4 rounded-xl border text-base font-bold tracking-wide shadow-sm',
            message.type === 'success'
              ? 'bg-success/5 border-success/20 text-success'
              : 'bg-destructive/5 border-destructive/20 text-destructive',
            'transition-all duration-200'
          )}>
            {message.type === 'success' ? <CheckCircle size={22} strokeWidth={3} /> : <AlertCircle size={22} strokeWidth={3} />}
            {message.text}
          </div>
        )}
        <div className="flex flex-col gap-6 w-full">
          {/* Partner Dropdown */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest" htmlFor="partner-select">TARGET PARTNER</label>
            <select
              id="partner-select"
              value={selectedPartnerId}
              onChange={(e) => {
                setSelectedPartnerId(e.target.value);
                setSelectedRecipient(''); // Reset recipient when partner changes
              }}
              className="w-full px-4 py-2 bg-white border border-[#e2e8f0] rounded-lg text-base text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none cursor-pointer shadow-sm"
            >
              <option value="">CHOOSE PARTNER...</option>
              {partners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.organizationName || p.name}
                </option>
              ))}
            </select>
          </div>
          {/* Recipient Dropdown */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest" htmlFor="recipient-select">RECIPIENT</label>
            <select
              id="recipient-select"
              value={selectedRecipient}
              onChange={(e) => handleRecipientSelect(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-[#e2e8f0] rounded-lg text-base text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none cursor-pointer shadow-sm"
            >
              <option value="">CHOOSE RECIPIENT...</option>
              {(() => {
                const partner = partners.find(p => p.id === selectedPartnerId);
                if (!partner || !partner.contacts) return null;
                return partner.contacts
                  .filter(c => (c.contactType || c.contactType) === 'PRIMARY' || (c.contactType || c.contactType) === 'primary')
                  .map((c, idx) => (
                    <option key={c.email + idx} value={c.email}>
                      {c.name} ({c.email})
                    </option>
                  ));
              })()}
            </select>
          </div>
          {/* Subject */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest" htmlFor="subject-input">MISSION SUBJECT</label>
            <input
              id="subject-input"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="STRATEGIC FOLLOW-UP..."
              className="w-full px-4 py-2 bg-white border border-[#e2e8f0] rounded-lg text-base text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
            />
          </div>
          {/* AI Prompt + Generate */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest" htmlFor="ai-prompt-input">AI MISSION OBJECTIVES</label>
            <div className="flex flex-row gap-2 w-full">
              <input
                id="ai-prompt-input"
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="E.G., FOLLOW UP ON INFOSESSION, PROPOSE NEXT MEETING..."
                className="w-full px-4 py-2 bg-white border border-[#e2e8f0] rounded-lg text-base text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm"
              />
              <button
                onClick={handleGenerateAI}
                disabled={aiLoading}
                className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold uppercase tracking-widest shadow-sm hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                style={{ minWidth: 120 }}
              >
                {aiLoading ? 'Generating...' : 'Generate AI Email'}
              </button>
            </div>
          </div>
          {/* Tone Selector */}
          <div className="flex flex-row flex-wrap gap-3 items-center justify-start w-full">
            {['professional', 'formal', 'casual', 'enthusiastic'].map((t) => (
              <button
                key={t}
                type="button"
                className={clsx(
                  'px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest border transition-all duration-200 cursor-pointer',
                  tone === t
                    ? 'bg-primary text-white border-primary shadow'
                    : 'bg-white text-foreground border-[#e2e8f0] hover:bg-primary/10 hover:text-primary',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20'
                )}
                onClick={() => setTone(t)}
                disabled={aiLoading}
                style={{ minWidth: 160 }}
              >
                {t === 'professional' && 'WARM & PROFESSIONAL'}
                {t === 'formal' && 'STRICT & FORMAL'}
                {t === 'casual' && 'CASUAL & FRIENDLY'}
                {t === 'enthusiastic' && 'ENTHUSIASTIC & DRIVEN'}
              </button>
            ))}
          </div>
          {/* Editable Email Body */}
          <div className="flex flex-col gap-3 w-full" style={{ flexGrow: 1 }}>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Editable Email Body</label>
            <textarea
              value={emailBody}
              onChange={e => setEmailBody(e.target.value)}
              placeholder="AI-generated email will appear here. You can edit before sending."
              className="w-full rounded-xl border border-[#e2e8f0] p-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical shadow-sm"
              style={{ flexGrow: 1, minHeight: 180, maxHeight: 400, background: '#fff' }}
              disabled={aiLoading}
            />
            <div className="flex flex-row gap-4 w-full mt-2">
              <button
                className="flex-1 py-3 rounded-lg bg-primary text-white font-bold text-base uppercase tracking-widest shadow-sm hover:bg-primary/90 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                onClick={handleSendEmail}
                disabled={loading || isPending}
              >
                {loading || isPending ? 'Sending...' : 'Send Email'}
              </button>
              <button
                className="py-3 px-5 rounded-lg border border-[#e2e8f0] text-foreground font-bold text-base uppercase tracking-widest shadow-sm hover:bg-muted transition-all duration-200 cursor-pointer"
                onClick={handleCopy}
                disabled={!emailBody}
              >
                Copy
              </button>
              <button
                className="py-3 px-5 rounded-lg border border-accent text-accent font-bold text-base uppercase tracking-widest shadow-sm hover:bg-accent/10 hover:text-accent transition-all duration-200 cursor-pointer"
                onClick={() => setShowPreview((p) => !p)}
              >
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
            </div>
          </div>
          {/* Preview Overlay */}
          {showPreview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" style={{ backdropFilter: 'blur(4px)' }}>
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 shadow-xl max-w-lg w-full mx-auto flex flex-col gap-6 relative items-center" style={{ boxShadow: '0 4px 16px 0 rgb(0 0 0 / 0.10)' }}>
                <button className="absolute top-4 right-4 text-destructive font-bold text-2xl" onClick={() => setShowPreview(false)} style={{ lineHeight: 1 }}>&times;</button>
                <h3 className="text-2xl font-extrabold text-foreground mb-2 tracking-tight">Email Preview</h3>
                <div className="text-sm text-muted-foreground mb-2">To: <span className="text-foreground font-semibold">{to || 'NO TARGET SPECIFIED'}</span></div>
                <div className="text-sm text-muted-foreground mb-2">Subject: <span className="text-primary italic uppercase font-semibold">{subject || 'UNSPECIFIED MISSION'}</span></div>
                <div className="whitespace-pre-wrap text-foreground leading-relaxed italic border border-[#e2e8f0] rounded-xl p-6 bg-muted/30 min-h-[120px] w-full" style={{ fontSize: 16 }}>{emailBody || 'AWAITING MISSION INTEL...'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailComposerPage;