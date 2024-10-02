<template>
	<main>
		<div v-if="showMenu">
			<button @click="startGame(1)">Single Player</button>
			<br />
			<button @click="startGame(2)">Multi Player</button>
		</div>
		<div v-else>
			<slot>
				<p v-for="p in players">{{ p.name }} Score: {{ p.score }}</p>
			</slot>
			<div class="grid w-fit h-fit gap-2" :style="dimensionStyle">
				<div class="flex justify-center items-center w-[5rem] aspect-square bg-cyan-300 text-5xl" v-for="(b, i) in board" @click="() => clicked(i)">{{ b }}</div>
			</div>
			<slot v-if="gameOver">
				<p>{{ winner === null ? 'Match Draw!' : players[winner].name + ' has won!' }}</p>
				<button @click="playAgain">Play Again</button>
			</slot>
		</div>
	</main>
</template>

<script setup>
	const dimension = ref(3)
	const dimensionStyle = computed(() => `grid-template-columns:repeat(${dimension.value},1fr);grid-template-rows:repeat(${dimension.value},1fr)`)

	const gameMode = ref(0)
	const gameOver = ref(false)
	const clickDisabled = ref(false)
	const board = ref([])
	const winningLines = ref([])
	const showMenu = ref(true)
	const players = ref([
		{ name: 'Player 1', dice: '❌', score: 0 },
		{ name: 'Player 2', dice: '⭕', score: 0 }
	])
	const firstMove = ref(0)
	const chance = ref(firstMove.value)
	const winner = ref(null)

	function isWinner(symbol, Board = board.value) {
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

	function startGame(type) {
		gameMode.value = type
		showMenu.value = false
		board.value = new Array(dimension.value * dimension.value).fill(null)
		winningLines.value = generateWinningLines()
	}

	async function clicked(ind) {
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
		// depth = false means find the best move without limiting
		const bestMove = findBestMove(false, dimension.value === 3 ? false : dimension.value)
		clickDisabled.value = false
		clicked(bestMove)
	}

	function minimax(newBoard, depth, isMaximizingPlayer) {
		if (isWinner(players.value[1].dice, newBoard)) return 1
		if (isWinner(players.value[0].dice, newBoard)) return -1
		if (depth === 0 || isDraw(newBoard)) return 0

		if (isMaximizingPlayer) {
			let maxVal = -Infinity
			for (let i = 0; i < newBoard.length; i++) {
				if (newBoard[i] !== null) continue
				newBoard[i] = players.value[1].dice
				let val = minimax(newBoard, depth - 1, false)
				newBoard[i] = null
				maxVal = Math.max(maxVal, val)
			}
			return maxVal
		} else {
			let minVal = Infinity
			for (let i = 0; i < newBoard.length; i++) {
				if (newBoard[i] !== null) continue
				newBoard[i] = players.value[0].dice
				let val = minimax(newBoard, depth - 1, true)
				newBoard[i] = null
				minVal = Math.min(minVal, val)
			}
			return minVal
		}
	}

	function findBestMove(isMaximizingPlayer, depth) {
		let newBoard = [...board.value]
		let bestScore = isMaximizingPlayer ? Infinity : -Infinity
		let bestMove = -1

		for (let i = 0; i < newBoard.length; i++) {
			if (newBoard[i] !== null) continue
			newBoard[i] = isMaximizingPlayer ? players.value[0].dice : players.value[1].dice
			let score = minimax(newBoard, depth - 1, isMaximizingPlayer)
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

	function playAgain() {
		gameOver.value = false
		clickDisabled.value = false
		board.value = new Array(dimension.value * dimension.value).fill(null)
		winningLines.value = generateWinningLines()
		if (winner.value !== null) firstMove.value = winner.value
		else {
			if (firstMove.value === 1) firstMove.value = 0
			else firstMove.value = 1
		}
		chance.value = firstMove.value
		winner.value = null
		if (gameMode.value === 1 && chance.value === 1) clicked(0)
	}

	function generateWinningLines() {
		const len = dimension.value
		const arr = [[], []]
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
</script>
