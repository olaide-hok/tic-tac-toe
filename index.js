class TicTacToe {
  constructor() {
    // Select DOM Elements
    this.singlePlayer = document.getElementById("single-player");
    this.multiPlayer = document.getElementById("multi-player");
    this.gameMenu = document.querySelector(".wrapper");
    this.gameBoard = document.querySelector(".game_board");
    this.isGameActive = false;
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
    this.playerOScore.textContent = currentScores.cpu;
    this.tiesScore.textContent = currentScores.ties;
  }

  updateTileDisplay() {
    this.tiles.forEach((tile, index) => {
      //   tile.textContent = this.board[index] || "";
      tile.innerHTML =
        this.board[index] === "X"
          ? `
        <svg id="cross" width="64" height="64" xmlns="http://www.w3.org/2000/svg"><path d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z" fill="#31C3BD" fill-rule="evenodd"/></svg>
      `
          : this.board[index] === "Y"
            ? `
        <svg id="knot" width="64" height="64" xmlns="http://www.w3.org/2000/svg"><path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" fill="#F2B137"/></svg>
        `
            : "";
    });
  }

  makeMove(index) {
    this.board[index] = this.currentPlayer;
    this.updateTileDisplay();
  }

  handleTileClick(tile) {
    if (!this.isGameActive) return;

    const index = tile.dataset.index;

    // check if tile has been occupied.
    if (this.board[index]) return;

    this.makeMove(index);
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe();
});
