// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: false },
	telemetry: { enabled: false },
	router: { options: { sensitive: true } },
	vite: { build: { assetsInlineLimit: 0 } },
	postcss: { plugins: { tailwindcss: {} } },
	css: ['@/assets/css/global.css'],
	ssr: false
})
