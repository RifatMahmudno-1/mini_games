<template>
	<main>
		<form v-if="showMenu" @submit.prevent="start">
			<div>
				<span>Dimension: </span>
				<input type="number" min="3" max="10" inputmode="numeric" v-model="dimension.y" required />
				<span> by </span>
				<input type="number" min="3" max="10" inputmode="numeric" v-model="dimension.x" required />
			</div>
			<button type="submit">Start!</button>
		</form>
		<div v-else>
			<div class="grid w-fit h-fit gap-1 justify-items-center select-none" :style="dimensionStyle">
				<slot v-for="y in board">
					<div v-for="val in y" class="w-[5rem] aspect-square flex items-center justify-center font-semibold" :style="'background:' + selectColor(val)">{{ val || '' }}</div>
				</slot>
			</div>
			<p v-if="over">Game over!</p>
		</div>
	</main>
</template>

<script setup>
	const showMenu = ref(true)
	const dimension = ref({ x: 4, y: 4 })
	const dimensionStyle = computed(() => `grid-template-rows:repeat(${dimension.value.y},1fr);grid-template-columns:repeat(${dimension.value.x},1fr)`)
	const board = ref(null)
	const over = ref(false)
	onBeforeUnmount(() => {
		if (import.meta.client) globalThis.window.removeEventListener('keyup', keyUp)
	})
	const shades_of_cyan = ['#00FFFF', '#00F5FF', '#00EBFF', '#00E1FF', '#00D7FF', '#00CDFF', '#00C3FF', '#00B9FF', '#00AFFF', '#00A5FF', '#009BFF', '#0091FF', '#0087FF', '#007DFF', '#0073FF', '#0069FF', '#005FFF', '#0055FF', '#004BFF', '#0041FF', '#0037FF', '#002DFF', '#0023FF', '#0019FF', '#000FFF', '#0005FF', '#0000FF', '#0000F5', '#0000EB', '#0000E1', '#0000D7', '#0000CD', '#0000C3', '#0000B9', '#0000AF', '#0000A5', '#00009B', '#000091', '#000087', '#00007D', '#000073', '#000069', '#00005F', '#000055', '#00004B', '#000041', '#000037', '#00002D', '#000023', '#000019', '#00000F', '#000005']

	function selectColor(val) {
		if (val === 0) return shades_of_cyan[0]
		const res = Math.floor(Math.log(val) / Math.log(2))
		return shades_of_cyan[res]
	}

	async function start() {
		showMenu.value = false

		board.value = []
		for (let i = 0; i < dimension.value.y; i++) {
			const arr = []
			for (let j = 0; j < dimension.value.x; j++) {
				arr.push(0)
			}
			board.value.push(arr)
		}

		addRandom()
		if (process.client) globalThis.window.addEventListener('keyup', keyUp)
	}

	function keyUp(e) {
		e.preventDefault()
		if (e.key === 'ArrowLeft') moveToLeft()
		if (e.key === 'ArrowUp') moveToUp()
		if (e.key === 'ArrowRight') moveToRight()
		if (e.key === 'ArrowDown') moveToDown()
	}
	function moveToUp() {
		for (let x = 0; x < dimension.value.x; x++) {
			for (let y1 = 0; y1 < dimension.value.y; y1++) {
				let val = board.value[y1][x]
				loop: for (let y = y1 + 1; y < dimension.value.y; y++) {
					if (board.value[y][x] === 0) continue loop
					if (val === 0) {
						val = board.value[y][x]
						board.value[y][x] = 0
						continue loop
					}
					if (val === board.value[y][x]) {
						val = val * 2
						board.value[y][x] = 0
					}
					break loop
				}
				board.value[y1][x] = val
			}
		}
		addRandom()
	}
	function moveToDown() {
		for (let x = 0; x < dimension.value.x; x++) {
			for (let y1 = dimension.value.y - 1; y1 >= 0; y1--) {
				let val = board.value[y1][x]
				loop: for (let y = y1 - 1; y >= 0; y--) {
					if (board.value[y][x] === 0) continue loop
					if (val === 0) {
						val = board.value[y][x]
						board.value[y][x] = 0
						continue loop
					}
					if (val === board.value[y][x]) {
						val = val * 2
						board.value[y][x] = 0
					}
					break loop
				}
				board.value[y1][x] = val
			}
		}
		addRandom()
	}
	function moveToLeft() {
		for (let y = 0; y < dimension.value.y; y++) {
			for (let x1 = 0; x1 < dimension.value.x; x1++) {
				let val = board.value[y][x1]
				loop: for (let x = x1 + 1; x < dimension.value.x; x++) {
					if (board.value[y][x] === 0) continue loop
					if (val === 0) {
						val = board.value[y][x]
						board.value[y][x] = 0
						continue loop
					}
					if (val === board.value[y][x]) {
						val = val * 2
						board.value[y][x] = 0
					}
					break loop
				}
				board.value[y][x1] = val
			}
		}
		addRandom()
	}
	function moveToRight() {
		for (let y = 0; y < dimension.value.y; y++) {
			for (let x1 = dimension.value.x - 1; x1 >= 0; x1--) {
				let val = board.value[y][x1]
				loop: for (let x = x1 - 1; x >= 0; x--) {
					if (board.value[y][x] === 0) continue loop
					if (val === 0) {
						val = board.value[y][x]
						board.value[y][x] = 0
						continue loop
					}
					if (val === board.value[y][x]) {
						val = val * 2
						board.value[y][x] = 0
					}
					break loop
				}
				board.value[y][x1] = val
			}
		}
		addRandom()
	}
	function addRandom() {
		const arr = []
		for (let y = 0; y < dimension.value.y; y++) {
			for (let x = 0; x < dimension.value.x; x++) {
				if (board.value[y][x] === 0) arr.push([y, x])
			}
		}
		const rand = arr[Math.trunc(Math.random() * arr.length)]
		if (!rand) {
			globalThis.window.removeEventListener('keyup', keyUp)
			over.value = true
		} else board.value[rand[0]][rand[1]] = 2
	}
</script>
