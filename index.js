class TicTacToe {
  constructor() {
    // Select DOM Elements
    this.singlePlayer = document.getElementById("single-player");
    this.multiPlayer = document.getElementById("multi-player");
    this.currentPlayerDisplay = document.querySelector(".current_player");
    this.gameMenu = document.querySelector(".wrapper");
    this.gameBoard = document.querySelector(".game_board");
    this.isGameActive = false;
    this.gameMode = null;
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.tiles = document.querySelectorAll(".tile");
    // Initialize scores with default values
    this.scores = {
      solo: { playerX: 0, cpu: 0, ties: 0 },
      multi: { playerX: 0, playerO: 0, ties: 0 },
    };
    this.playerXScore = document.getElementById("x-score");
    this.playerOScore = document.getElementById("cpu-scores");
    this.tiesScore = document.getElementById("ties");
    this.winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    this.setupEventListners();
  }
  setupEventListners() {
    this.singlePlayer.addEventListener("click", () => {
      this.startGame("solo");
    });

    this.multiPlayer.addEventListener("click", () => {
      this.startGame("multi");
    });

    this.tiles.forEach((tile, index) => {
      tile.addEventListener("click", () => {
        this.handleTileClick(tile);
      });
    });
  }

  startGame(mode) {
    this.gameMode = mode;
    this.isGameActive = true;
    this.gameMenu.classList.remove("d-flex");
    this.gameMenu.classList.add("d-none");
    this.gameBoard.classList.remove("d-none");
    this.gameBoard.classList.add("d-flex");

    // Update player turn display
    this.currentPlayerDisplay.textContent = `${this.currentPlayer} turn`;

    this.updateScoreDisplay(mode);
  }

  updateScoreDisplay(mode) {
    // Ensure scores object exists before accessing properties
    const currentScores = this.scores[mode] || {
      playerX: 0,
      cpu: 0,
      playerO: 0,
      ties: 0,
    };

    this.playerXScore.textContent = currentScores.playerX;
    this.tiesScore.textContent = currentScores.ties;

    if (this.gameMode === "solo") {
      this.playerOScore.textContent = currentScores.cpu;
    }
  }

  updateTileDisplay() {
    this.tiles.forEach((tile, index) => {
      //   tile.textContent = this.board[index] || "";
      tile.innerHTML =
        this.board[index] === "X"
          ? `
        <svg id="cross" width="64" height="64" xmlns="http://www.w3.org/2000/svg"><path d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z" fill="#31C3BD" fill-rule="evenodd"/></svg>
      `
          : this.board[index] === "O"
            ? `
        <svg id="knot" width="64" height="64" xmlns="http://www.w3.org/2000/svg"><path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" fill="#F2B137"/></svg>
        `
            : "";
    });
  }

  // how to determine a win
  checkWin() {
    return this.winningCombinations.some((combination) => {
      const [a, b, c] = combination;
      return (
        this.board[a] !== "" &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      );
    });
  }

  checkDraw() {
    return this.board.every((cell) => cell !== "");
  }

  updateScore(winner) {
    const mode = this.gameMode === "solo" ? "solo" : "multi";
    if (winner === "X") {
      this.scores[mode].playerX++;
    } else if (winner === "0") {
      if (this.gameMode === "solo") {
        this.scores.solo.cpu++;
      } else {
        this.scores.multi.playerO++;
      }
    } else if (winner === "tie") {
      this.scores[mode].ties++;
    }
    this.updateScoreDisplay();
  }

  // check winner
  checkWinner() {
    const winner = this.checkWin(this.currentPlayer);
    if (winner) {
      this.isGameActive = false;
      this.updateScore(this.currentPlayer);
    } else if (!this.board.includes(null)) {
      this.isGameActive = false;
      this.updateScore("tie");
    }
  }

  switchPlayer() {
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    this.currentPlayerDisplay.textContent = `${this.currentPlayer} turn`;
  }

  makeMove(index) {
    this.board[index] = this.currentPlayer;
    console.log("board", this.board);
  }

  computerMove() {
    let bestMove = this.findBestMove();
    this.makeMove(bestMove);
    this.updateTileDisplay();

    if (this.checkWin()) {
      this.updateScore(this.currentPlayer);
      return;
    }

    if (this.checkDraw()) {
      this.updateScore("ties");
      return;
    }

    this.switchPlayer();
  }

  findBestMove() {
    // Check for winning move
    const winningMove = this.findWinningMove("O");
    if (winningMove !== -1) return winningMove;

    // Block opponent's winning move
    const blockingMove = this.findWinningMove("X");
    if (blockingMove !== -1) return blockingMove;

    // Take center if available
    if (this.board[4] === "") return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(
      (index) => this.board[index] === "",
    );
    if (availableCorners.length > 0) {
      return availableCorners[
        Math.floor(Math.random() * availableCorners.length)
      ];
    }

    // Take any available space
    const availableSpaces = this.board
      .map((cell, index) => (cell === "" ? index : -1))
      .filter((index) => index !== -1);
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  }

  findWinningMove(player) {
    for (let i = 0; i < this.winningCombinations.length; i++) {
      const [a, b, c] = this.winningCombinations[i];
      const tiles = [this.board[a], this.board[b], this.board[c]];

      // Count player's marks in this combination
      const playerCount = tiles.filter((tile) => tile === player).length;
      const emptyCount = tiles.filter((tile) => tile === "").length;

      // If we have 2 player marks and 1 empty space, this is a winning move
      if (playerCount === 2 && emptyCount === 1) {
        const emptyIndex = tiles.findIndex((tile) => tile === "");
        return this.winningCombinations[i][emptyIndex];
      }
    }
    return -1;
  }

  handleTileClick(tile) {
    if (!this.isGameActive) return;

    const index = tile.dataset.index;

    // check if tile has been occupied.
    if (this.board[index]) return;

    this.makeMove(index);
    this.updateTileDisplay();

    if (this.checkWin()) {
      console.log("win has haopeed");

      this.updateScore(this.currentPlayer);
      return;
    }

    if (this.checkDraw()) {
      console.log("draw");

      this.updateScore("tie");
      return;
    }
    this.switchPlayer();
    console.log("after swithc");
    // when playing with CPU or Solo mode
    if (
      this.gameMode === "solo" &&
      this.isGameActive &&
      this.currentPlayer === "O"
    ) {
      console.log("computer move");
      setTimeout(() => this.computerMove(), 500);
    }
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe();
});
