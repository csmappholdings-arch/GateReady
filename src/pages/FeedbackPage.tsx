import React, { useState } from 'react';
import { PageLayout } from './PageLayout';
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';
import { useAuth } from '../context/AuthContext';

type FeedbackTopic = 'Bug report' | 'Feature idea' | 'Pricing or billing' | 'Something else';

export const FeedbackPage: React.FC = () => {
  const { tier, isTrialActive, isReferralPlatinumActive } = useSubscription();
  const { user } = useAuth();

  const [topic, setTopic] = useState<FeedbackTopic>('Bug report');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [honeypot, setHoneypot] = useState(''); // Hidden spam trap

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Derive plan tier name for context
  const planTier = isReferralPlatinumActive 
    ? 'Platinum (Referral)' 
    : isTrialActive 
      ? 'Platinum (Trial)' 
      : user 
        ? tier 
        : 'Guest';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedMessage = message.trim();
    if (!trimmedMessage || trimmedMessage.length < 10) {
      setErrorMessage('Please enter at least 10 characters describing your feedback.');
      return;
    }

    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address or leave the field blank.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic,
          message: trimmedMessage,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          honeypot,
          referrer: typeof document !== 'undefined' ? document.referrer || 'Direct' : 'Direct',
          timestamp: new Date().toISOString(),
          planTier
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setMessage('');
      } else {
        setErrorMessage(data.error || 'Unable to submit feedback right now. Please try again or visit our contact page.');
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again or visit our contact page.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout pathname="/feedback">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Intro */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            <span>Send Us Your Feedback</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Encountered a bug, have an idea to improve packing, or want to share your travel experience? We read every submission.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-5 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Thank You for Your Feedback!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Your input has been delivered directly to the GateReady product and engineering team. We use your insights to refine luggage calculators, tare deductions, and departure checklists.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="h-10 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Send Another Response
              </button>
              <a
                href="/"
                className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <span>Back to Packing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Topic Selector - Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="feedback-topic" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                What is this regarding? <span className="text-purple-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="feedback-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value as FeedbackTopic)}
                  className="w-full h-11 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-purple-500 transition-colors cursor-pointer appearance-none"
                >
                  <option value="Bug report">Bug report</option>
                  <option value="Feature idea">Feature idea</option>
                  <option value="Pricing or billing">Pricing or billing</option>
                  <option value="Something else">Something else</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1.5">
              <label htmlFor="feedback-message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Your Message <span className="text-purple-600">*</span>
              </label>
              <textarea
                id="feedback-message"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what happened, what feature you'd like to see, or how we can improve..."
                className="w-full p-3.5 text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500 transition-colors resize-y min-h-[120px]"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Minimum 10 characters</span>
                <span className={message.trim().length >= 10 ? 'text-emerald-600 font-medium' : 'text-slate-400'}>
                  {message.trim().length} chars
                </span>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label htmlFor="feedback-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Your Name <span className="text-slate-400 text-[10px] font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="feedback-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="feedback-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Your Email <span className="text-slate-400 text-[10px] font-normal lowercase">(so we can reply)</span>
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full h-10 px-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Honeypot field (hidden from genuine users) */}
            <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
              <label htmlFor="confirm_website">Leave this field blank</label>
              <input
                id="confirm_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Privacy notice */}
            <div className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Feedback is used only to improve GateReady.</span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p>{errorMessage}</p>
                  <p className="mt-1 text-[11px] text-rose-700 dark:text-rose-300">
                    If this error persists, you can reach out via our <a href="/contact" className="font-bold underline">contact page</a>.
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <a
                href="/contact"
                className="text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors"
              >
                Need general support instead?
              </a>

              <button
                type="submit"
                disabled={isSubmitting || message.trim().length < 10}
                className="h-11 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-purple-600/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Feedback</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
};
