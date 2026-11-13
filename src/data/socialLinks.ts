export const OFFICIAL_SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/Gateready.ca',
  instagram: 'https://www.instagram.com/gateready.ca/',
  reddit: 'https://www.reddit.com/r/GateReady/'
} as const;

export const OFFICIAL_SAME_AS: string[] = [
  OFFICIAL_SOCIAL_LINKS.facebook,
  OFFICIAL_SOCIAL_LINKS.instagram,
  OFFICIAL_SOCIAL_LINKS.reddit
];

export const FACEBOOK_SVG_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.3-1.5 1.6-1.5h1.7V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.8V14h2.6v8h3.1z"/></svg>';

export const INSTAGRAM_SVG_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>';
