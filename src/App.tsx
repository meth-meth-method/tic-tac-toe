import { useCallback, useMemo, useState } from 'react'
import './App.css'

const PLAYERS = [1, 2] as const

type Player = (typeof PLAYERS)[number] | 0

const INITIAL_BOARD: Player[] = [0, 0, 0, 0, 0, 0, 0, 0, 0]

const PlayerAvatars: Record<Player, string | null> = {
  0: null,
  1: 'X',
  2: 'O'
}

// 0,1,2
// 3,4,5
// 6,7,8

const PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [2, 4, 6],
  [0, 4, 8]
]

function App() {
  const [round, setRound] = useState(0)
  const [board, setBoard] = useState(INITIAL_BOARD)

  const setCell = useCallback((index: number, value: Player) => {
    setBoard((board) => {
      const next = [...board]
      next[index] = value
      return next
    })

    setRound((round) => round + 1)
  }, [])

  const reset = useCallback(() => {
    setBoard(INITIAL_BOARD)
    setRound(0)
  }, [])

  const currentPlayer = PLAYERS[round % PLAYERS.length]

  const winningPlayer = useMemo(() => {
    for (const pattern of PATTERNS) {
      for (const player of PLAYERS) {
        if (pattern.every((index) => board[index] === player)) {
          return player
        }
      }
    }

    return undefined
  }, [board])

  const hasWinner = !!winningPlayer

  return (
    <>
      <div className="tic-tac-toe">
        <div>Round: {round}</div>

        {hasWinner && <div>Winner: {PlayerAvatars[winningPlayer]}</div>}

        {!hasWinner && board.every((p) => p > 0) && <div>It's a draw!</div>}

        <div className="board">
          {board.map((value, index) => {
            const canPlace = value === 0
            return (
              <button className="cell" key={index} disabled={!canPlace} onClick={() => setCell(index, currentPlayer)}>
                {PlayerAvatars[value]}
              </button>
            )
          })}
        </div>

        <div>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    </>
  )
}

export default App
