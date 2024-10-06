// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: false },
	telemetry: { enabled: false },
	router: { options: { sensitive: true } },
	vite: { build: { assetsInlineLimit: 0 } },
	postcss: { plugins: { tailwindcss: {} } },
	css: ['@/assets/css/global.css'],
	app: {
		head: { title: 'Mini Games' },
		htmlAttrs: { lang: 'en' },
		noscript: [{ children: 'Javascript is required to run this website' }],
		meta: [
			{ name: 'author', content: 'Rifat Mahmud' },
			{ name: 'creator', content: 'Rifat Mahmud' },
			{ property: 'og:type', content: 'website' }
		],
		link: [{ rel: 'icon', href: '/favicon.ico' }]
	}
})
