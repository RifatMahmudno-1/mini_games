<template>
	<main class="p-4">
		<div v-if="showMenu" class="grid justify-items-center">
			<div class="border-2 border-violet-500 p-4 rounded w-full min-w-[15rem] max-w-[30rem] grid gap-2">
				<div class="flex gap-2">
					<label for="dim">Select Dimension:</label>
					<select id="dim" v-model="dimension">
						<option :value="d" v-for="d in dimensions">{{ d }} by {{ d }}</option>
					</select>
				</div>
				<div class="grid grid-cols-2 gap-2">
					<button class="bg-violet-500 rounded px-2 py-0.5" @click="() => startGame(1)">Single Player</button>
					<button class="bg-violet-500 rounded px-2 py-0.5" @click="() => startGame(2)">Multi Player</button>
					<button class="bg-red-500 rounded px-2 py-0.5 col-[1/-1]" @click="() => $router.push('/')">Cancel</button>
				</div>
			</div>
		</div>
		<div v-else>
			<div class="grid justify-items-center gap-4">
				<div class="flex gap-4">
					<button class="px-2 py-0.5 bg-violet-400 rounded transition-shadow hover:shadow-md" @click="restart">Restart</button>
					<button class="px-2 py-0.5 bg-violet-400 rounded transition-shadow hover:shadow-md" @click="cancel">Cancel</button>
				</div>
				<div class="grid gap-2">
					<div>
						<p v-for="p in players">
							{{ p.name }} Score: <span class="font-semibold">{{ p.score }}</span>
						</p>
					</div>
					<div class="grid w-fit h-fit gap-1 select-none relative" :style="dimensionStyle">
						<div class="flex justify-center items-center w-[5rem] aspect-square bg-cyan-300 text-4xl rounded" v-for="(b, i) in board" @click="() => clicked(i)">{{ b }}</div>
						<div v-if="gameOver" class="absolute inset-0 bg-white bg-opacity-60 grid justify-items-center content-center">
							<p class="text-lg font-semibold">{{ winner === null ? 'Match Draw!' : players[winner].name + ' has won!' }}</p>
							<button @click="playAgain" class="bg-violet-500 rounded px-2 py-0.5 transition-shadow hover:shadow-md">Play Again</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup lang="ts">
	const dimensions = [3, 4, 5, 6]
	const dimension = ref(3)
	const dimensionStyle = computed(() => `grid-template-columns:repeat(${dimension.value},1fr);grid-template-rows:repeat(${dimension.value},1fr)`)

	const gameMode = ref(0)
	const gameOver = ref(false)
	const clickDisabled = ref(false)
	const board = ref<(null | string)[]>([])
	const winningLines = ref<number[][]>([])
	const showMenu = ref(true)
	const players = ref([
		{ name: 'Player 1', dice: '❌', score: 0 },
		{ name: 'Player 2', dice: '⭕', score: 0 }
	])
	const firstMove = ref(0)
	const chance = ref(firstMove.value)
	const winner = ref<null | number>(null)

	function isWinner(symbol: string, Board = board.value) {
		const wl = winningLines.value
		for (let i = 0; i < wl.length; i++) {
			loop: for (let j = 0; j < dimension.value; j++) {
				if (Board[wl[i][j]] !== symbol) break loop
				if (j === dimension.value - 1) return true
			}
		}
		return false
	}

	function isDraw(Board = board.value) {
		return Board.every(el => el !== null)
	}

	async function clicked(ind: number) {
		if (clickDisabled.value || board.value[ind] !== null) return
		clickDisabled.value = true
		board.value[ind] = players.value[chance.value].dice

		// render in the board
		await new Promise(r => setTimeout(r))

		if (isWinner(players.value[chance.value].dice)) {
			players.value[chance.value].score++
			winner.value = chance.value
			gameOver.value = true
			return
		} else if (isDraw()) {
			winner.value = null
			gameOver.value = true
			return
		}
		if (chance.value === 0) chance.value = 1
		else chance.value = 0
		clickDisabled.value = false

		if (gameMode.value === 1 && chance.value === 1) computerTurn()
	}

	function computerTurn() {
		clickDisabled.value = true
		// depth = Infinity means find the best move without limiting
		// if dimension is more than 3 then set depth to 4 to make it faster.
		const bestMove = findBestMove(false, dimension.value <= 3 ? Infinity : 4)
		clickDisabled.value = false
		clicked(bestMove)
	}

	function alphabeta(newBoard: (null | string)[], depth: number, isMaximizingPlayer: boolean, alpha: number, beta: number) {
		if (isWinner(players.value[1].dice, newBoard)) return 1
		if (isWinner(players.value[0].dice, newBoard)) return -1
		if (depth === 0 || isDraw(newBoard)) return 0

		if (isMaximizingPlayer) {
			let maxVal = -Infinity
			for (let i = 0; i < newBoard.length; i++) {
				if (newBoard[i] !== null) continue
				newBoard[i] = players.value[1].dice
				let val = alphabeta(newBoard, depth - 1, false, alpha, beta)
				newBoard[i] = null
				maxVal = Math.max(maxVal, val)
				alpha = Math.max(alpha, val)
				if (beta <= alpha) break
			}
			return maxVal
		} else {
			let minVal = Infinity
			for (let i = 0; i < newBoard.length; i++) {
				if (newBoard[i] !== null) continue
				newBoard[i] = players.value[0].dice
				let val = alphabeta(newBoard, depth - 1, true, alpha, beta)
				newBoard[i] = null
				minVal = Math.min(minVal, val)
				beta = Math.min(beta, val)
				if (beta <= alpha) break
			}
			return minVal
		}
	}

	function findBestMove(isMaximizingPlayer: boolean, depth: number) {
		let newBoard = [...board.value]
		let bestScore = isMaximizingPlayer ? Infinity : -Infinity
		let bestMove = -1
		let alpha = -Infinity
		let beta = Infinity

		for (let i = 0; i < newBoard.length; i++) {
			if (newBoard[i] !== null) continue
			newBoard[i] = isMaximizingPlayer ? players.value[0].dice : players.value[1].dice
			let score = alphabeta(newBoard, depth - 1, isMaximizingPlayer, alpha, beta)
			newBoard[i] = null

			if (!isMaximizingPlayer) {
				if (score > bestScore) {
					bestScore = score
					bestMove = i
				}
			} else {
				if (score < bestScore) {
					bestScore = score
					bestMove = i
				}
			}
		}

		return isMaximizingPlayer ? bestScore : bestMove
	}

	function generateWinningLines() {
		const len = dimension.value
		const arr: number[][] = [[], []]
		for (let i = 0; i < len; i++) {
			arr[0].push(len * i + i)
			arr[1].push((len - 1) * (i + 1))
			const ar1 = []
			const ar2 = []
			for (let j = 0; j < len; j++) {
				ar1.push(len * i + j)
				ar2.push(len * j + i)
			}
			arr.push(ar1, ar2)
		}
		return arr
	}

	function startGame(type: number) {
		gameMode.value = type
		gameOver.value = false
		clickDisabled.value = false
		board.value = new Array(dimension.value * dimension.value).fill(null)
		winningLines.value = generateWinningLines()
		showMenu.value = false
		players.value = [
			{ name: 'Player 1', dice: '❌', score: 0 },
			{ name: 'Player 2', dice: '⭕', score: 0 }
		]
		firstMove.value = 0
		chance.value = 0
		winner.value = null
	}

	function cancel() {
		gameMode.value = 0
		gameOver.value = false
		clickDisabled.value = false
		board.value = []
		winningLines.value = []
		showMenu.value = true
		players.value = [
			{ name: 'Player 1', dice: '❌', score: 0 },
			{ name: 'Player 2', dice: '⭕', score: 0 }
		]
		firstMove.value = 0
		chance.value = 0
		winner.value = null
	}

	function playAgain() {
		gameOver.value = false
		clickDisabled.value = false
		board.value = new Array(dimension.value * dimension.value).fill(null)
		if (winner.value !== null) firstMove.value = winner.value
		else {
			if (firstMove.value === 1) firstMove.value = 0
			else firstMove.value = 1
		}
		chance.value = firstMove.value
		winner.value = null
		// just to make it faster
		if (gameMode.value === 1 && chance.value === 1) clicked(1) // computerTurn()
	}

	function restart() {
		gameOver.value = false
		clickDisabled.value = false
		board.value = new Array(dimension.value * dimension.value).fill(null)
		players.value = [
			{ name: 'Player 1', dice: '❌', score: 0 },
			{ name: 'Player 2', dice: '⭕', score: 0 }
		]
		firstMove.value = 0
		chance.value = 0
		winner.value = null
	}

	// function minimax(newBoard: (null | string)[], depth: number, isMaximizingPlayer: boolean) {
	// 	if (isWinner(players.value[1].dice, newBoard)) return 1
	// 	if (isWinner(players.value[0].dice, newBoard)) return -1
	// 	if (depth === 0 || isDraw(newBoard)) return 0

	// 	if (isMaximizingPlayer) {
	// 		let maxVal = -Infinity
	// 		for (let i = 0; i < newBoard.length; i++) {
	// 			if (newBoard[i] !== null) continue
	// 			newBoard[i] = players.value[1].dice
	// 			let val = minimax(newBoard, depth - 1, false)
	// 			newBoard[i] = null
	// 			maxVal = Math.max(maxVal, val)
	// 		}
	// 		return maxVal
	// 	} else {
	// 		let minVal = Infinity
	// 		for (let i = 0; i < newBoard.length; i++) {
	// 			if (newBoard[i] !== null) continue
	// 			newBoard[i] = players.value[0].dice
	// 			let val = minimax(newBoard, depth - 1, true)
	// 			newBoard[i] = null
	// 			minVal = Math.min(minVal, val)
	// 		}
	// 		return minVal
	// 	}
	// }
	// function findBestMove(isMaximizingPlayer: boolean, depth: number) {
	// 	let newBoard = [...board.value]
	// 	let bestScore = isMaximizingPlayer ? Infinity : -Infinity
	// 	let bestMove = -1

	// 	for (let i = 0; i < newBoard.length; i++) {
	// 		if (newBoard[i] !== null) continue
	// 		newBoard[i] = isMaximizingPlayer ? players.value[0].dice : players.value[1].dice
	// 		let score = minimax(newBoard, depth - 1, isMaximizingPlayer)
	// 		newBoard[i] = null

	// 		if (!isMaximizingPlayer) {
	// 			if (score > bestScore) {
	// 				bestScore = score
	// 				bestMove = i
	// 			}
	// 		} else {
	// 			if (score < bestScore) {
	// 				bestScore = score
	// 				bestMove = i
	// 			}
	// 		}
	// 	}

	// 	return isMaximizingPlayer ? bestScore : bestMove
	// }
</script>
