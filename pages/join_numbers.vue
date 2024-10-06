<template>
	<main class="p-4">
		<div v-if="showMenu" class="grid justify-items-center">
			<form @submit.prevent="start" class="border-2 border-violet-500 p-4 rounded w-full min-w-[15rem] max-w-[30rem] grid gap-2">
				<p>Select Dimension:</p>
				<div class="flex gap-2 justify-center flex-wrap">
					<input type="number" min="2" max="5" inputmode="numeric" v-model="dimension.y" required class="bg-gray-300 rounded w-16 text-center" />
					<span>by</span>
					<input type="number" min="2" max="5" inputmode="numeric" v-model="dimension.x" required class="bg-gray-300 rounded w-16 text-center" />
					<p class="w-full text-center text-xs text-gray-600">Minimum:2, Maximum:5</p>
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
					<button class="px-2 py-0.5 bg-violet-400 rounded transition-shadow hover:shadow-md" @click="start">Restart</button>
					<button class="px-2 py-0.5 bg-violet-400 rounded transition-shadow hover:shadow-md" @click="cancel">Cancel</button>
				</div>
				<div class="grid w-fit h-fit gap-1 justify-items-center select-none relative" :style="dimensionStyle">
					<slot v-for="y in board">
						<div v-for="val in y" class="w-[5rem] aspect-square flex items-center justify-center font-semibold rounded" :style="`background:${selectColor(val)}`">{{ val || '' }}</div>
					</slot>
					<div class="absolute inset-0 bg-white bg-opacity-60 grid justify-items-center items-center" v-if="gameOver">
						<p class="text-xl font-bold">Game over!</p>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
	const showMenu = ref(true)
	const dimension = ref({ x: 4, y: 4 })
	const dimensionStyle = computed(() => `grid-template-rows:repeat(${dimension.value.y},1fr);grid-template-columns:repeat(${dimension.value.x},1fr)`)
	const gameOver = ref(false)
	const board = ref<number[][]>([])

	function start() {
		showMenu.value = false
		gameOver.value = false

		board.value = []
		for (let i = 0; i < dimension.value.y; i++) {
			const arr = []
			for (let j = 0; j < dimension.value.x; j++) {
				arr.push(0)
			}
			board.value.push(arr)
		}

		addRandom()
		globalThis.window.addEventListener('keyup', keyUp)
	}
	function cancel() {
		showMenu.value = true
		board.value = []
		globalThis.window.removeEventListener('keyup', keyUp)
	}
	function selectColor(val: number) {
		const shades_of_cyan = ['#00FFFF', '#00F5FF', '#00EBFF', '#00E1FF', '#00D7FF', '#00CDFF', '#00C3FF', '#00B9FF', '#00AFFF', '#00A5FF', '#009BFF', '#0091FF', '#0087FF', '#007DFF', '#0073FF', '#0069FF', '#005FFF', '#0055FF', '#004BFF', '#0041FF', '#0037FF', '#002DFF', '#0023FF', '#0019FF', '#000FFF', '#0005FF', '#0000FF', '#0000F5', '#0000EB', '#0000E1', '#0000D7', '#0000CD', '#0000C3', '#0000B9', '#0000AF', '#0000A5', '#00009B', '#000091', '#000087', '#00007D']
		if (val === 0) return shades_of_cyan[0]
		const res = Math.floor(Math.log(val) / Math.log(2))
		if (res >= shades_of_cyan.length) return shades_of_cyan[shades_of_cyan.length - 1]
		return shades_of_cyan[res]
	}
	function keyUp(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			moveToLeft()
			e.preventDefault()
		} else if (e.key === 'ArrowUp') {
			moveToUp()
			e.preventDefault()
		} else if (e.key === 'ArrowRight') {
			moveToRight()
			e.preventDefault()
		} else if (e.key === 'ArrowDown') {
			moveToDown()
			e.preventDefault()
		}
	}
	function addRandom() {
		const arr = []
		for (let y = 0; y < dimension.value.y; y++) {
			for (let x = 0; x < dimension.value.x; x++) {
				if (board.value[y][x] === 0) arr.push([y, x])
			}
		}
		const rand = arr[Math.trunc(Math.random() * arr.length)]
		if (rand) board.value[rand[0]][rand[1]] = 2
		else {
			globalThis.window.removeEventListener('keyup', keyUp)
			gameOver.value = true
		}
	}
	onBeforeUnmount(() => globalThis.window.removeEventListener('keyup', keyUp))

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
</script>
