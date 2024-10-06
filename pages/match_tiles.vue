<template>
	<main class="p-4">
		<div v-if="showMenu" class="grid justify-items-center">
			<form @submit.prevent="start" class="border-2 border-violet-500 p-4 rounded w-full min-w-[15rem] max-w-[30rem] grid gap-2">
				<div class="flex gap-2">
					<label for="dim">Select Dimension:</label>
					<select id="dim" v-model="dimension">
						<option :value="d" v-for="d in dimensions">{{ d }} by {{ d }}</option>
					</select>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<button type="submit" class="bg-violet-500 rounded px-2 py-0.5">Start!</button>
					<button type="button" class="bg-red-500 rounded px-2 py-0.5" @click="() => $router.push('/')">Cancel</button>
				</div>
			</form>
		</div>
		<div v-else>
			<div class="grid justify-items-center gap-4">
				<div class="flex gap-4">
					<button class="px-2 py-0.5 bg-violet-400 rounded transition-shadow hover:shadow-md" @click="restart">Restart</button>
					<button class="px-2 py-0.5 bg-violet-400 rounded transition-shadow hover:shadow-md" @click="cancel">Cancel</button>
				</div>
				<div class="grid w-fit h-fit gap-1 select-none relative" :style="dimensionStyle">
					<div v-for="(el, ind) in board" class="w-[5rem] aspect-square text-4xl bg-cyan-300 flex justify-center items-center rounded cursor-pointer" @click="() => showTile(ind)">
						{{ solvedTiles.includes(ind) || showingTiles.includes(ind) ? el : null }}
					</div>
					<div class="absolute inset-0 bg-white bg-opacity-60 grid justify-items-center content-center" v-if="gameOver">
						<p class="text-xl font-bold">Game over!</p>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
	const dimensions = [2, 4, 6]
	const gameOver = ref(false)
	const showMenu = ref(true)
	const dimension = ref(4)
	const dimensionStyle = computed(() => `grid-template-columns:repeat(${dimension.value},1fr);grid-template-rows:repeat(${dimension.value},1fr)`)
	const board = ref<string[]>([])
	const showingTiles = ref<number[]>([])
	const solvedTiles = ref<number[]>([])

	function start() {
		showMenu.value = false
		gameOver.value = false

		const emojis = ['😀', '😊', '😎', '😍', '🤩', '🙃', '🤯', '😡', '🤡', '😈', '👺', '🤖', '🦁', '🦝', '🐯', '🐺', '🐻', '🐭', '🦊', '🐸', '🦓', '🦄', '🐔', '🐲', '🐩', '🐕‍🦺', '🦧', '🐬', '🐳', '🐠', '🪸', '🐓', '🦅', '🦚', '🦉', '🦋', '🐥', '🐧', '🪰', '🪲', '🐜', '🧟‍♀️', '🫀', '🫁', '🦷', '🧞‍♂️', '🐣', '🦀', '🐚', '🦌']

		const slots = []
		for (let i = 0; i < dimension.value * dimension.value; i++) {
			slots.push(i)
		}

		for (let i = 0; i < (dimension.value * dimension.value) / 2; i++) {
			let el = emojis.splice(Math.trunc(Math.random() * emojis.length), 1)[0]
			let ind1 = slots.splice(Math.trunc(Math.random() * slots.length), 1)[0]
			let ind2 = slots.splice(Math.trunc(Math.random() * slots.length), 1)[0]
			board.value[ind1] = el
			board.value[ind2] = el
		}
	}
	function cancel() {
		board.value = []
		showingTiles.value = []
		solvedTiles.value = []
		showMenu.value = true
	}
	function restart() {
		board.value = []
		showingTiles.value = []
		solvedTiles.value = []
		start()
	}
	function showTile(ind: number) {
		if (gameOver.value) return

		if (showingTiles.value.length === 0) {
			showingTiles.value.push(ind)
			return
		}
		if (showingTiles.value.includes(ind)) {
			showingTiles.value = showingTiles.value.filter(el => el !== ind)
			return
		}
		if (showingTiles.value.length === 2) {
			showingTiles.value = [ind]
			return
		}
		if (board.value[showingTiles.value[0]] === board.value[ind]) {
			solvedTiles.value.push(showingTiles.value[0], ind)
			showingTiles.value = []
			if (solvedTiles.value.length === board.value.length) gameOver.value = true
			return
		}
		showingTiles.value.push(ind)
	}
</script>
