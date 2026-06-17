function getLang() {
  if (typeof localStorage === 'undefined') return 'fr';
  return localStorage.getItem('benin_lang') || 'fr';
}

export const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'es', label: 'Español',  flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
];

export const langStore = (() => {
  let _lang = $state(getLang());
  return {
    get current() { return _lang; },
    get flag() { return LANGUAGES.find(l => l.code === _lang)?.flag ?? '🌐'; },
    set(l) {
      _lang = l;
      if (typeof localStorage !== 'undefined') localStorage.setItem('benin_lang', l);
    }
  };
})();
