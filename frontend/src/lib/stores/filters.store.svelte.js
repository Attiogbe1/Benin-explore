// Store filtres recherche — Svelte 5 runes

export const filtersStore = (() => {
  let search = $state('');
  let categorie = $state('');
  let region = $state('');
  let gratuit = $state(false);
  let sort = $state('popularite');

  return {
    get search() { return search; },
    get categorie() { return categorie; },
    get region() { return region; },
    get gratuit() { return gratuit; },
    get sort() { return sort; },

    get params() {
      const p = {};
      if (search) p.search = search;
      if (categorie) p.categorie = categorie;
      if (region) p.region = region;
      if (gratuit) p.gratuit = 'true';
      if (sort !== 'popularite') p.sort = sort;
      return p;
    },

    setSearch(v) { search = v; },
    setCategorie(v) { categorie = v; },
    setRegion(v) { region = v; },
    setGratuit(v) { gratuit = v; },
    setSort(v) { sort = v; },

    reset() {
      search = ''; categorie = ''; region = '';
      gratuit = false; sort = 'popularite';
    }
  };
})();
