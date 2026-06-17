// Utilitaires de formatage

export function formatPrix(montant, devise = 'XOF') {
  if (devise === 'XOF') {
    return `${montant.toLocaleString('fr-FR')} FCFA`;
  }
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: devise }).format(montant);
}

export function formatDate(date, locale = 'fr-FR') {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date(date));
}

export function formatDateShort(date, locale = 'fr-FR') {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(new Date(date));
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function timeAgo(date, locale = 'fr') {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = [
    { label: { fr: 'an', en: 'year' }, seconds: 31536000 },
    { label: { fr: 'mois', en: 'month' }, seconds: 2592000 },
    { label: { fr: 'jour', en: 'day' }, seconds: 86400 },
    { label: { fr: 'heure', en: 'hour' }, seconds: 3600 },
    { label: { fr: 'minute', en: 'minute' }, seconds: 60 }
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      const label = interval.label[locale] || interval.label.fr;
      return locale === 'fr'
        ? `il y a ${count} ${label}${count > 1 && label !== 'mois' ? 's' : ''}`
        : `${count} ${label}${count > 1 ? 's' : ''} ago`;
    }
  }
  return locale === 'fr' ? "à l'instant" : 'just now';
}

export function slugify(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(str, maxLength = 120) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + '…';
}
