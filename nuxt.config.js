// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: false },

	router: { options: { sensitive: true } },
	vite: { build: { assetsInlineLimit: 0 } },

	css: ['@/assets/css/global.css'],
	postcss: { plugins: { tailwindcss: {} } },

	ssr: false
})
