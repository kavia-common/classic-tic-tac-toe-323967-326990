import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

function clickSquareByIndex(index) {
  // App uses aria-label "Row {r}, Column {c}" (optionally includes ", X|O")
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const btn = screen.getByRole("button", { name: new RegExp(`Row ${row}, Column ${col}`, "i") });
  fireEvent.click(btn);
  return btn;
}

test("renders a 3x3 Tic Tac Toe board and initial status", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /tic tac toe/i })
  ).toBeInTheDocument();
  expect(screen.getByTestId("game-status")).toHaveTextContent(
    /next player:\s*x/i
  );

  // Assert all 9 squares exist by role+label (without clicking/mutating state).
  for (let i = 0; i < 9; i += 1) {
    const row = Math.floor(i / 3) + 1;
    const col = (i % 3) + 1;
    expect(
      screen.getByRole("button", {
        name: new RegExp(`Row ${row}, Column ${col}`, "i"),
      })
    ).toBeInTheDocument();
  }
});

test("allows players to alternate X and O and prevents overwriting a square", () => {
  render(<App />);

  const s0 = clickSquareByIndex(0);
  expect(s0).toHaveTextContent("X");
  expect(screen.getByTestId("game-status")).toHaveTextContent(/next player:\s*o/i);

  // Clicking the same square again should not change it to O
  fireEvent.click(s0);
  expect(s0).toHaveTextContent("X");

  const s1 = clickSquareByIndex(1);
  expect(s1).toHaveTextContent("O");
  expect(screen.getByTestId("game-status")).toHaveTextContent(/next player:\s*x/i);
});

test("detects a winner and shows winner status", () => {
  render(<App />);

  // X wins top row: X at 0,1,2 with O at 3,4 in between
  clickSquareByIndex(0); // X
  clickSquareByIndex(3); // O
  clickSquareByIndex(1); // X
  clickSquareByIndex(4); // O
  clickSquareByIndex(2); // X wins

  expect(screen.getByTestId("game-status")).toHaveTextContent(/winner:\s*x/i);

  // After win, further clicks should not change board
  const before = screen.getByRole("button", { name: /row 2, column 3/i });
  expect(before).toHaveTextContent("");
  fireEvent.click(before);
  expect(before).toHaveTextContent("");
});

test("reset clears the board and restores X as next player", () => {
  render(<App />);

  const s0 = clickSquareByIndex(0);
  expect(s0).toHaveTextContent("X");
  expect(screen.getByTestId("game-status")).toHaveTextContent(/next player:\s*o/i);

  fireEvent.click(screen.getByRole("button", { name: /reset/i }));

  const s0After = screen.getByRole("button", { name: /row 1, column 1/i });
  expect(s0After).toHaveTextContent("");
  expect(screen.getByTestId("game-status")).toHaveTextContent(/next player:\s*x/i);
});
