import './App.css';
import React, { useState, useEffect } from 'react'

function App() {

	let  [bombCounter, setBombCounter] = useState(0)
	const [board, setBoard] = useState(initBoard())
	const [gameOver, setGameOver] = useState(false)
 
	function initBoard() {
		let tempBoard = Array.from(Array(16), () => new Array(16))

		for(let i = 0; i < tempBoard.length; i++) {
			for(let j = 0; j < tempBoard[i].length; j++) {
				tempBoard[i][j] = {count: 0, visible: false, flagged: false, src: '0.png'}
			}
		}

		for(let i = 0; i < 10; i++) {
			let randomX = Math.floor(Math.random() * tempBoard.length)
			let randomY = Math.floor(Math.random() * tempBoard.length)
			tempBoard[randomX][randomY].count = -1
			tempBoard[randomX][randomY].src = 'bomb.png'
			bombCounter++
		}

		for(let i = 0; i < tempBoard.length; i++) {
			for(let j = 0; j < tempBoard[i].length; j++) {
				let counter = 0
				for(let xOffset = -1; xOffset <= 1; xOffset++) {
					for(let yOffset = -1; yOffset <= 1; yOffset++) {
						if(i + xOffset > -1 && i + xOffset < tempBoard.length && j  + yOffset > -1 && j + yOffset < tempBoard.length) {
							if(tempBoard[i + xOffset]?.[j + yOffset].count === -1 && tempBoard[i][j].count !== -1) {
								counter++
								tempBoard[i][j].count = counter
								tempBoard[i][j].src = counter + '.png'
							}
						}
					}
				}
				counter = 0
			}
		}
		return tempBoard
	}

	function show(rIndex, cIndex) {
		let tempBoard = [...board]
		for(let xOffset = -1; xOffset <= 1; xOffset++) {
			for(let yOffset = -1; yOffset <= 1; yOffset++) {
				if(rIndex + xOffset > -1 && rIndex + xOffset < tempBoard.length && cIndex  + yOffset > -1 && cIndex + yOffset < tempBoard.length) {
					if(tempBoard[rIndex][cIndex].count === 0 && tempBoard[rIndex][cIndex].count !== -1 && !tempBoard[rIndex + xOffset][cIndex + yOffset].visible && !tempBoard[rIndex][cIndex].flagged && !tempBoard[rIndex + xOffset][cIndex + yOffset].flagged) {
						tempBoard[rIndex + xOffset][cIndex + yOffset].visible = true
						show(rIndex + xOffset, cIndex + yOffset)
					} else {
						if(!tempBoard[rIndex][cIndex].flagged) {
							tempBoard[rIndex][cIndex].visible = true
						}
					}
				}
			}
		}
		setBoard(tempBoard)	
	}

	function flag(e, rIndex, cIndex) {
		e.preventDefault()
		let tempBoard = [...board]
		if(!tempBoard[rIndex][cIndex].visible && !tempBoard[rIndex][cIndex].flagged) {
			tempBoard[rIndex][cIndex].flagged = true
		} else if(tempBoard[rIndex][cIndex].flagged && !tempBoard[rIndex][cIndex].visible) {
			tempBoard[rIndex][cIndex].flagged = false
		}
		setBoard(tempBoard)
	}

	function checkLose(rIndex, cIndex) {
		let tempBoard = [...board]
		if(tempBoard[rIndex][cIndex].count === -1 && !tempBoard[rIndex][cIndex].flagged) {
			setGameOver(true)
			for(let i = 0; i < tempBoard.length; i++) {
				for(let j = 0; j < tempBoard[i].length; j++) {
					if(tempBoard[i][j].count === -1 && !tempBoard[i][j].visible) {
						tempBoard[i][j].src = 'shownBomb.png'
						tempBoard[i][j].visible = true
					}
					if(tempBoard[i][j].count !== -1 && tempBoard[i][j].flagged) {
						tempBoard[i][j].flagged = false
						tempBoard[i][j].visible = true
						tempBoard[i][j].src = 'wrongBomb.png'
					}
				}
			}
		}
		setBoard(tempBoard)
	}

	function checkWin() {
		let tempBoard = [...board]
		let checker = []
		let bombs = []
		for(let i = 0; i < board.length; i++) {
			for(let j = 0; j < board[i].length; j++) {
				if(board[i][j].visible) {
					checker.push(board[i][j])
				}
				if(board[i][j].count === -1) {
					bombs.push({x: i, y: j})
				}
			}
		}
		if(256 - bombs.length === checker.length) {
			for(let i = 0; i < bombs.length; i++) {
				if(!board[bombs[i].x][bombs[i].y].flagged) {
					tempBoard[bombs[i].x][bombs[i].y].flagged = true
					setBoard(tempBoard)
				}
			}
			setGameOver(true)
		}
	}

	useEffect(() => {
		checkWin()
	}, [board])

	return (
		<>
		<div className="board">
		{board.map((row, rIndex) => {
			return(row.map((cell, cIndex) => {
				return(
					<img id="cell" key={cIndex} onClick={(() => {
						if(!gameOver) {
							show(rIndex, cIndex)
							checkLose(rIndex, cIndex)
						}
					})} draggable="false" onContextMenu={(e) => {
							if(!gameOver) {
								flag(e, rIndex, cIndex)
							}
						}
					}
					src={
						cell.flagged ? require('./flag.png') : '' ||
						!cell.visible ? require('./empty.png') : '' ||
						require('./' + cell.src)
					} 
					/> 
				)
			})
			)})}
		</div>
		</>
  );
}

export default App;
