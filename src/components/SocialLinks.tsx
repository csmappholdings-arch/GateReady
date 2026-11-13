import React from 'react';
import { OFFICIAL_SOCIAL_LINKS } from '../data/socialLinks';

interface SocialLinksProps {
  variant?: 'footer' | 'darkFooter' | 'card';
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'footer',
  className = ''
}) => {
  const buttonClasses =
    variant === 'darkFooter'
      ? 'w-8 h-8 rounded-xl border border-slate-700/80 bg-slate-800/70 text-slate-400 hover:text-purple-300 hover:border-purple-500/60 hover:bg-slate-800 inline-flex items-center justify-center transition-colors'
      : variant === 'card'
        ? 'w-8 h-8 rounded-xl border border-purple-200 dark:border-purple-800/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 inline-flex items-center justify-center transition-colors'
        : 'w-7.5 h-7.5 rounded-lg border border-purple-100 dark:border-purple-900/70 bg-purple-50/50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-purple-100/60 dark:hover:bg-purple-950/60 inline-flex items-center justify-center transition-colors';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <a
        href={OFFICIAL_SOCIAL_LINKS.facebook}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GateReady on Facebook"
        title="Follow GateReady on Facebook"
        className={buttonClasses}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-3.5 h-3.5"
          aria-hidden="true"
        >
          <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.8V14h2.6v8h3.1z" />
        </svg>
      </a>

      <a
        href={OFFICIAL_SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GateReady on Instagram"
        title="Follow GateReady on Instagram"
        className={buttonClasses}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5"
          aria-hidden="true"
        >
          <rect x="2.5" y="2.5" width="19" height="19" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </a>
    </div>
  );
};
