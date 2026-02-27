import React, { useMemo, useState } from "react";
import "./App.css";

/**
 * All winning line combinations for a 3x3 Tic Tac Toe board.
 * Indices correspond to board positions:
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

function getGameStatus({ winner, isDraw, nextPlayer }) {
  if (winner) return `Winner: ${winner}`;
  if (isDraw) return "Draw game";
  return `Next player: ${nextPlayer}`;
}

function indexToRowCol(index) {
  return { row: Math.floor(index / 3) + 1, col: (index % 3) + 1 };
}

// PUBLIC_INTERFACE
function App() {
  /** Board state: 9 cells with values null | "X" | "O". */
  const [squares, setSquares] = useState(() => Array(9).fill(null));
  /** X always starts in classic Tic Tac Toe. */
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line: winLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const isDraw = useMemo(() => {
    return !winner && squares.every((v) => v !== null);
  }, [winner, squares]);

  const nextPlayer = xIsNext ? "X" : "O";
  const statusText = getGameStatus({ winner, isDraw, nextPlayer });

  const handleSquareClick = (index) => {
    // Ignore clicks once the game is over or if the square is already filled.
    if (winner || isDraw || squares[index] !== null) return;

    setSquares((prev) => {
      const next = prev.slice();
      next[index] = nextPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App">
      <main className="appShell">
        <header className="header">
          <div>
            <h1 className="title">Tic Tac Toe</h1>
            <p className="subtitle">
              Classic 3×3. Take turns placing <strong>X</strong> and{" "}
              <strong>O</strong>.
            </p>
          </div>

          <div className="statusWrap" aria-live="polite">
            <span
              className={[
                "statusPill",
                winner ? "statusPill--success" : "",
                isDraw ? "statusPill--neutral" : "",
              ].join(" ")}
              data-testid="game-status"
            >
              {statusText}
            </span>
          </div>
        </header>

        <section className="boardSection" aria-label="Game board">
          <div className="board" role="grid" aria-label="Tic Tac Toe board">
            {squares.map((value, idx) => {
              const isWinningSquare = winLine.includes(idx);
              const { row, col } = indexToRowCol(idx);

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "square",
                    value === "X" ? "square--x" : "",
                    value === "O" ? "square--o" : "",
                    isWinningSquare ? "square--win" : "",
                  ].join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  aria-label={`Row ${row}, Column ${col}${
                    value ? `, ${value}` : ""
                  }`}
                  aria-disabled={winner || isDraw ? "true" : "false"}
                >
                  {value}
                </button>
              );
            })}
          </div>

          <div className="controls">
            <button type="button" className="btn" onClick={resetGame}>
              Reset
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
