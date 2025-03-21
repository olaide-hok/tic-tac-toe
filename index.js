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

    this.winnerLoserBanner = document.querySelector(".winner-loser_banner");
    this.restartBanner = document.querySelector(".restart_banner");
    this.resultText = document.getElementById("result-text");
    this.winnerText = document.querySelector(".winner");
    this.quitBtn = document.getElementById("quit");
    this.nextRoundBtn = document.getElementById("next-round");
    this.bgOverlay = document.getElementById("overlay");
    this.restartGameBtn = document.getElementById("restart-game");
    this.noCancelbtn = document.getElementById("no-cancel");
    this.yesRestartBtn = document.getElementById("yes-restart");

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

    this.quitBtn.addEventListener("click", () => this.handleQuit());
    this.nextRoundBtn.addEventListener("click", () => this.handleNextRound());
    this.restartGameBtn.addEventListener("click", () =>
      this.openRestartBanner(),
    );
    this.noCancelbtn.addEventListener("click", () => this.closeRestartBanner());
    this.yesRestartBtn.addEventListener("click", () => this.handleRestart());
  }

  // Helper function to toggle classes
  toggleElementVisibility(
    element,
    show,
    displayClass = "d-flex",
    hideClass = "d-none",
  ) {
    if (show) {
      element.classList.remove(hideClass);
      element.classList.add(displayClass);
    } else {
      element.classList.remove(displayClass);
      element.classList.add(hideClass);
    }
  }

  startGame(mode) {
    this.gameMode = mode;
    this.isGameActive = true;
    this.toggleElementVisibility(this.gameMenu, false);
    this.toggleElementVisibility(this.gameBoard, true);

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

    if (mode === "solo") {
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
    } else if (winner === "O") {
      if (this.gameMode === "solo") {
        this.scores.solo.cpu++;
      } else {
        this.scores.multi.playerO++;
      }
    } else if (winner === "tie") {
      this.scores[mode].ties++;
    }
    this.updateScoreDisplay(mode);
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
  }

  computerMove() {
    let bestMove = this.findBestMove();
    this.makeMove(bestMove);
    this.updateTileDisplay();

    if (this.checkWin()) {
      this.updateScore(this.currentPlayer);
      this.handleGameOver(this.currentPlayer);
      return;
    }

    if (this.checkDraw()) {
      this.handleGameOver("tie");
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

  openRestartBanner() {
    this.toggleElementVisibility(this.restartBanner, true);
    this.toggleElementVisibility(this.bgOverlay, true);
  }
  closeRestartBanner() {
    this.toggleElementVisibility(this.restartBanner, false);
    this.toggleElementVisibility(this.bgOverlay, false);
  }

  handleNextRound() {
    this.resetBoard();
    this.currentPlayerDisplay.textContent = `${this.currentPlayer} turn`;
    this.toggleElementVisibility(this.bgOverlay, false);
    this.toggleElementVisibility(this.winnerLoserBanner, false);
  }

  resetBoard() {
    this.board = Array(9).fill("");
    this.currentPlayer = "X";
    this.isGameActive = true;
    this.updateTileDisplay();
  }

  resetScore() {
    this.scores = {
      solo: { playerX: 0, cpu: 0, ties: 0 },
      multi: { playerX: 0, playerO: 0, ties: 0 },
    };
    this.updateScoreDisplay(this.gameMode);
    this.resetBoard();
  }

  handleQuit() {
    this.resetScore();
    this.gameMode = null;
    this.toggleElementVisibility(this.gameMenu, true);
    this.toggleElementVisibility(this.gameBoard, false);
    this.toggleElementVisibility(this.bgOverlay, false);
    this.toggleElementVisibility(this.winnerLoserBanner, false);
  }

  handleRestart() {
    this.handleQuit();
    this.toggleElementVisibility(this.restartBanner, false);
  }

  handleGameOver(winner) {
    this.isGameActive = false;
    this.toggleElementVisibility(this.bgOverlay, true);
    this.toggleElementVisibility(this.winnerLoserBanner, true);

    if (winner === "X" || winner === "O") {
      this.resultText.classList.remove("d-none");
      this.resultText.textContent =
        winner === "X"
          ? "You won!"
          : winner === "O"
            ? "Oh no, you lost..."
            : "";
    }

    if (winner === "tie") {
      this.resultText.classList.add("d-none");
    }

    this.winnerText.innerHTML =
      winner === "X"
        ? `
          <img src="./code/assets/icon-x.svg" alt="x icon">
          <span>Takes the round</span>
    `
        : winner === "O"
          ? `
          <img src="./code/assets/icon-o.svg" alt="o icon">
          <span>Takes the round</span>
    `
          : winner === "tie"
            ? `
                <p class="result_tie" style="margin-bottom:8px;">round tied</p>
    `
            : "";
  }

  handleTileClick(tile) {
    if (!this.isGameActive) return;

    const index = tile.dataset.index;

    // check if tile has been occupied.
    if (this.board[index]) return;

    this.makeMove(index);
    this.updateTileDisplay();

    if (this.checkWin()) {
      this.handleGameOver(this.currentPlayer);
      this.updateScore(this.currentPlayer);
      return;
    }

    if (this.checkDraw()) {
      this.handleGameOver("tie");
      this.updateScore("tie");
      return;
    }

    // switch this.currentPlayer value
    this.switchPlayer();

    // when playing with CPU or Solo mode
    if (
      this.gameMode === "solo" &&
      this.isGameActive &&
      this.currentPlayer === "O"
    ) {
      setTimeout(() => this.computerMove(), 500);
    }
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe();
});
