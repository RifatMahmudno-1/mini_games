<template>
	<main>
		<form v-if="showMenu" @submit.prevent="start">
			<label>
				<span>Select:</span>
				<select v-model="dimension">
					<option :value="d" v-for="d in dimensions">{{ d }}</option>
				</select>
			</label>
			<button type="submit">Start!</button>
		</form>
		<div v-else>
			<div :style="dimensionStyle" class="grid w-fit h-fit gap-1 justify-items-center select-none">
				<div v-for="(el, ind) in board" class="w-[5rem] aspect-square text-4xl bg-cyan-300 flex justify-center items-center" @click="() => showTile(ind)">
					{{ solved.includes(ind) || showingTile.includes(ind) ? el : null }}
				</div>
			</div>
			<p v-if="over">Game over!!</p>
		</div>
	</main>
</template>

<script setup>
	const emojis = ['😀', '😊', '😎', '😍', '🤩', '🙃', '🤯', '😡', '🤡', '😈', '👺', '🤖', '🦁', '🦝', '🐯', '🐺', '🐻', '🐭', '🦊', '🐸', '🦓', '🦄', '🐔', '🐲', '🐩', '🐕‍🦺', '🦧', '🐬', '🐳', '🐠', '🪸', '🐓', '🦅', '🦚', '🦉', '🦋', '🐥', '🐧', '🪰', '🪲', '🐜', '🧟‍♀️', '🫀', '🫁', '🦷', '🧞‍♂️', '🐣', '🦀', '🐚', '🦌']
	const dimensions = [2, 4, 6, 8, 10]
	const over = ref(false)

	const showMenu = ref(true)
	const dimension = ref(4)
	const dimensionStyle = computed(() => `grid-template-columns:repeat(${dimension.value},1fr);grid-template-rows:repeat(${dimension.value},1fr)`)
	const board = ref([])

	function start() {
		showMenu.value = false
		const em = [...emojis]
		const slots = []
		for (let i = 0; i < dimension.value * dimension.value; i++) {
			slots.push(i)
		}
		for (let i = 0; i < (dimension.value * dimension.value) / 2; i++) {
			let el = em.splice(Math.trunc(Math.random() * em.length), 1)[0]
			let ind1 = slots.splice(Math.trunc(Math.random() * slots.length), 1)[0]
			let ind2 = slots.splice(Math.trunc(Math.random() * slots.length), 1)[0]
			board.value[ind1] = el
			board.value[ind2] = el
		}
	}
	const showingTile = ref([])
	const solved = ref([])
	function showTile(ind) {
		if (showingTile.value.length === 2) showingTile.value = [ind]
		else showingTile.value.push(ind)

		if (showingTile.value.length === 2) {
			if (board.value[showingTile.value[0]] === board.value[showingTile.value[1]]) {
				solved.value.push(...showingTile.value)
				showingTile.value = []
			}
		}

		if (solved.value.length === board.value.length) over.value = true
	}
</script>
