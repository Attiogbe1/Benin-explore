const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg","manifest.json"]),
	mimeTypes: {".svg":"image/svg+xml",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.Dcqi66Rh.js",app:"_app/immutable/entry/app.mBo1Ku6l.js",imports:["_app/immutable/entry/start.Dcqi66Rh.js","_app/immutable/chunks/C1vmUVJj.js","_app/immutable/chunks/NDJsz6B2.js","_app/immutable/chunks/BoKDS8Wr.js","_app/immutable/entry/app.mBo1Ku6l.js","_app/immutable/chunks/Dp1pzeXC.js","_app/immutable/chunks/NDJsz6B2.js","_app/immutable/chunks/Bzak7iHL.js","_app/immutable/chunks/I96Wivfg.js","_app/immutable/chunks/CL8YWMYT.js","_app/immutable/chunks/BtgWzsQW.js","_app/immutable/chunks/DBktxMzw.js","_app/immutable/chunks/CrnGL6qM.js","_app/immutable/chunks/BoKDS8Wr.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-DNIuCXW_.js')),
			__memo(() => import('./chunks/1-CnHEud5c.js')),
			__memo(() => import('./chunks/2-CkcuEK9W.js')),
			__memo(() => import('./chunks/3-Bw83rMwR.js')),
			__memo(() => import('./chunks/4-BPUbXg8i.js')),
			__memo(() => import('./chunks/5-qw_lE4Dp.js')),
			__memo(() => import('./chunks/6-DvBHqKUf.js')),
			__memo(() => import('./chunks/7-80bdSARk.js')),
			__memo(() => import('./chunks/8-D8m_mnbX.js')),
			__memo(() => import('./chunks/9-C1U_X1Qr.js')),
			__memo(() => import('./chunks/10-DO3y9gjU.js')),
			__memo(() => import('./chunks/11-B8C_Faq5.js')),
			__memo(() => import('./chunks/12-gbfvCkHw.js')),
			__memo(() => import('./chunks/13-Ds5aTlN7.js')),
			__memo(() => import('./chunks/14-Ce5E8z2y.js')),
			__memo(() => import('./chunks/15-DRH2J1oP.js')),
			__memo(() => import('./chunks/16-CFTvCOX0.js')),
			__memo(() => import('./chunks/17-D2Dnpx2u.js')),
			__memo(() => import('./chunks/18-B3Vbhz0I.js')),
			__memo(() => import('./chunks/19-QQp0YbwQ.js')),
			__memo(() => import('./chunks/20-j146Jvza.js')),
			__memo(() => import('./chunks/21-i4hNnztC.js')),
			__memo(() => import('./chunks/22-CuHBkku6.js')),
			__memo(() => import('./chunks/23-9Oqgc_1D.js')),
			__memo(() => import('./chunks/24-DW7-RNa5.js')),
			__memo(() => import('./chunks/25-DxAZ-R7R.js')),
			__memo(() => import('./chunks/26-BIcEpW6c.js')),
			__memo(() => import('./chunks/27-pm615y51.js')),
			__memo(() => import('./chunks/28-CNS2CZAI.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/admin",
				pattern: /^\/admin\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/admin/avis",
				pattern: /^\/admin\/avis\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/admin/blog",
				pattern: /^\/admin\/blog\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/admin/prestataires",
				pattern: /^\/admin\/prestataires\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/admin/reservations",
				pattern: /^\/admin\/reservations\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/admin/services",
				pattern: /^\/admin\/services\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/admin/sites",
				pattern: /^\/admin\/sites\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/admin/utilisateurs",
				pattern: /^\/admin\/utilisateurs\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/auth/register",
				pattern: /^\/auth\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/blog",
				pattern: /^\/blog\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/blog/[slug]",
				pattern: /^\/blog\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 15 },
				endpoint: null
			},
			{
				id: "/devenir-prestataire",
				pattern: /^\/devenir-prestataire\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 16 },
				endpoint: null
			},
			{
				id: "/map",
				pattern: /^\/map\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 17 },
				endpoint: null
			},
			{
				id: "/prestataires",
				pattern: /^\/prestataires\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 18 },
				endpoint: null
			},
			{
				id: "/prestataires/[id]",
				pattern: /^\/prestataires\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 19 },
				endpoint: null
			},
			{
				id: "/profil",
				pattern: /^\/profil\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 20 },
				endpoint: null
			},
			{
				id: "/profil/favoris",
				pattern: /^\/profil\/favoris\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 21 },
				endpoint: null
			},
			{
				id: "/profil/prestataire",
				pattern: /^\/profil\/prestataire\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 22 },
				endpoint: null
			},
			{
				id: "/profil/reservations",
				pattern: /^\/profil\/reservations\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 23 },
				endpoint: null
			},
			{
				id: "/reservations",
				pattern: /^\/reservations\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 24 },
				endpoint: null
			},
			{
				id: "/reservations/[id]",
				pattern: /^\/reservations\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 25 },
				endpoint: null
			},
			{
				id: "/sites",
				pattern: /^\/sites\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 26 },
				endpoint: null
			},
			{
				id: "/sites/[slug]",
				pattern: /^\/sites\/([^/]+?)\/?$/,
				params: [{"name":"slug","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 27 },
				endpoint: null
			},
			{
				id: "/urgence",
				pattern: /^\/urgence\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 28 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
