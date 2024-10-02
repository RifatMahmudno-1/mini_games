const dimension = { x: 10, y: 10 }
const board = []

for (let i = 0; i < dimension.y; i++) {
	const arr = []
	for (let j = 0; j < dimension.x; j++) {
		arr.push(0)
	}
	board.push(arr)
}
addRandom()

function moveToUp() {
	for (let x = 0; x < dimension.x; x++) {
		for (let y1 = 0; y1 < dimension.y; y1++) {
			let val = board[y1][x]
			loop: for (let y = y1 + 1; y < dimension.y; y++) {
				if (board[y][x] === 0) continue loop
				if (val === 0) {
					val = board[y][x]
					board[y][x] = 0
					continue loop
				}
				if (val === board[y][x]) {
					val = val * 2
					board[y][x] = 0
				}
				break loop
			}
			board[y1][x] = val
		}
	}
}
function moveToDown() {
	for (let x = 0; x < dimension.x; x++) {
		for (let y1 = dimension.y - 1; y1 >= 0; y1--) {
			let val = board[y1][x]
			loop: for (let y = y1 - 1; y >= 0; y--) {
				if (board[y][x] === 0) continue loop
				if (val === 0) {
					val = board[y][x]
					board[y][x] = 0
					continue loop
				}
				if (val === board[y][x]) {
					val = val * 2
					board[y][x] = 0
				}
				break loop
			}
			board[y1][x] = val
		}
	}
}
function moveToLeft() {
	for (let y = 0; y < dimension.y; y++) {
		for (let x1 = 0; x1 < dimension.x; x1++) {
			let val = board[y][x1]
			loop: for (let x = x1 + 1; x < dimension.x; x++) {
				if (board[y][x] === 0) continue loop
				if (val === 0) {
					val = board[y][x]
					board[y][x] = 0
					continue loop
				}
				if (val === board[y][x]) {
					val = val * 2
					board[y][x] = 0
				}
				break loop
			}
			board[y][x1] = val
		}
	}
}
function moveToRight() {
	for (let y = 0; y < dimension.y; y++) {
		for (let x1 = dimension.x - 1; x1 >= 0; x1--) {
			let val = board[y][x1]
			loop: for (let x = x1 - 1; x >= 0; x--) {
				if (board[y][x] === 0) continue loop
				if (val === 0) {
					val = board[y][x]
					board[y][x] = 0
					continue loop
				}
				if (val === board[y][x]) {
					val = val * 2
					board[y][x] = 0
				}
				break loop
			}
			board[y][x1] = val
		}
	}
}
function addRandom() {
	const arr = []
	for (let y = 0; y < dimension.y; y++) {
		for (let x = 0; x < dimension.x; x++) {
			if (board[y][x] === 0) arr.push([y, x])
		}
	}
	const rand = arr[Math.trunc(Math.random() * arr.length)]
	if (!rand) return false
	else {
		board[rand[0]][rand[1]] = 2
		return true
	}
}
