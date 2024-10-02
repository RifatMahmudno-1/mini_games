<template>
	<div class="grid grid-rows-[auto_1fr_auto] min-h-dvh w-full">
		<header>This is the header</header>
		<NuxtPage />
		<footer>This is the footer</footer>
	</div>
</template>

<style scoped>
	.main_app {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100dvh;
		width: 100%;
	}
</style>
