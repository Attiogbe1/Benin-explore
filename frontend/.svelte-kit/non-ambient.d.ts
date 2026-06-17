
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/admin/avis" | "/admin/blog" | "/admin/prestataires" | "/admin/reservations" | "/admin/services" | "/admin/sites" | "/admin/utilisateurs" | "/auth" | "/auth/login" | "/auth/register" | "/blog" | "/blog/[slug]" | "/devenir-prestataire" | "/map" | "/prestataires" | "/prestataires/[id]" | "/profil" | "/profil/favoris" | "/profil/prestataire" | "/profil/reservations" | "/reservations" | "/reservations/[id]" | "/sites" | "/sites/[slug]" | "/urgence";
		RouteParams(): {
			"/blog/[slug]": { slug: string };
			"/prestataires/[id]": { id: string };
			"/reservations/[id]": { id: string };
			"/sites/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { slug?: string | undefined; id?: string | undefined };
			"/admin": Record<string, never>;
			"/admin/avis": Record<string, never>;
			"/admin/blog": Record<string, never>;
			"/admin/prestataires": Record<string, never>;
			"/admin/reservations": Record<string, never>;
			"/admin/services": Record<string, never>;
			"/admin/sites": Record<string, never>;
			"/admin/utilisateurs": Record<string, never>;
			"/auth": Record<string, never>;
			"/auth/login": Record<string, never>;
			"/auth/register": Record<string, never>;
			"/blog": { slug?: string | undefined };
			"/blog/[slug]": { slug: string };
			"/devenir-prestataire": Record<string, never>;
			"/map": Record<string, never>;
			"/prestataires": { id?: string | undefined };
			"/prestataires/[id]": { id: string };
			"/profil": Record<string, never>;
			"/profil/favoris": Record<string, never>;
			"/profil/prestataire": Record<string, never>;
			"/profil/reservations": Record<string, never>;
			"/reservations": { id?: string | undefined };
			"/reservations/[id]": { id: string };
			"/sites": { slug?: string | undefined };
			"/sites/[slug]": { slug: string };
			"/urgence": Record<string, never>
		};
		Pathname(): "/" | "/admin" | "/admin/avis" | "/admin/blog" | "/admin/prestataires" | "/admin/reservations" | "/admin/services" | "/admin/sites" | "/admin/utilisateurs" | "/auth/login" | "/auth/register" | "/blog" | `/blog/${string}` & {} | "/devenir-prestataire" | "/map" | "/prestataires" | `/prestataires/${string}` & {} | "/profil" | "/profil/favoris" | "/profil/prestataire" | "/profil/reservations" | "/reservations" | `/reservations/${string}` & {} | "/sites" | `/sites/${string}` & {} | "/urgence";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | "/manifest.json" | string & {};
	}
}