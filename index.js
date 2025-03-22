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

    this.winnerIndexes = null;

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

    // Load saved game state
    this.loadGameState();

    // Call this method once during initialization
    this.initializeTileMap();
  }

  // Initialize the tile map
  initializeTileMap() {
    this.tileMap = new Map();
    this.tiles.forEach((tile) => {
      this.tileMap.set(Number(tile.dataset.index), tile);
    });
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
      // Add mouseenter event listener
      tile.addEventListener("mouseenter", () =>
        this.handleMouseEnter(tile, index),
      );

      // Add mouseleave event listener
      tile.addEventListener("mouseleave", () =>
        this.handleMouseLeave(tile, index),
      );
    });

    this.quitBtn.addEventListener("click", () => this.handleQuit());
    this.nextRoundBtn.addEventListener("click", () => this.handleNextRound());
    this.restartGameBtn.addEventListener("click", () =>
      this.openRestartBanner(),
    );
    this.noCancelbtn.addEventListener("click", () => this.closeRestartBanner());
    this.yesRestartBtn.addEventListener("click", () => this.handleRestart());
  }

  // Handle mouseenter event
  handleMouseEnter(tile, index) {
    // Check if the tile is already occupied
    if (this.board[index]) return;

    // Set the tile content based on the current player
    tile.innerHTML =
      this.currentPlayer === "X"
        ? this.getXOutlineIcon()
        : this.getOOutlineIcon();
  }

  // Handle mouseleave event
  handleMouseLeave(tile, index) {
    // Clear the tile content if it's not occupied
    if (!this.board[index]) {
      tile.innerHTML = "";
    }
  }

  // Get the X icon SVG
  getXOutlineIcon() {
    return `
   <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg"><path d="M51.12 1.269c.511 0 1.023.195 1.414.586l9.611 9.611c.391.391.586.903.586 1.415s-.195 1.023-.586 1.414L44.441 32l17.704 17.705c.391.39.586.902.586 1.414 0 .512-.195 1.024-.586 1.415l-9.611 9.611c-.391.391-.903.586-1.415.586a1.994 1.994 0 0 1-1.414-.586L32 44.441 14.295 62.145c-.39.391-.902.586-1.414.586a1.994 1.994 0 0 1-1.415-.586l-9.611-9.611a1.994 1.994 0 0 1-.586-1.415c0-.512.195-1.023.586-1.414L19.559 32 1.855 14.295a1.994 1.994 0 0 1-.586-1.414c0-.512.195-1.024.586-1.415l9.611-9.611c.391-.391.903-.586 1.415-.586s1.023.195 1.414.586L32 19.559 49.705 1.855c.39-.391.902-.586 1.414-.586Z" stroke="#31C3BD" stroke-width="2" fill="none"/></svg>
`;
  }

  getOOutlineIcon() {
    return `
      <svg width="66" height="66" xmlns="http://www.w3.org/2000/svg"><path d="M33 1c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C15.327 65 1 50.673 1 33 1 15.327 15.327 1 33 1Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" stroke="#F2B137" stroke-width="2" fill="none"/></svg>
    `;
  }

  getXWinIcon() {
    return `
   <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_i_0_460)">
<rect width="96" height="96" rx="10" fill="#31C3BD"/>
</g>
<path fill-rule="evenodd" clip-rule="evenodd" d="M62.0709 25.5126C60.8993 24.3411 58.9998 24.3411 57.8283 25.5126L48 35.3409L38.1717 25.5126C37.0002 24.3411 35.1007 24.3411 33.9291 25.5126L29.5126 29.9291C28.3411 31.1007 28.3411 33.0002 29.5126 34.1717L39.3409 44L29.5126 53.8283C28.3411 54.9998 28.3411 56.8993 29.5126 58.0709L33.9291 62.4874C35.1007 63.6589 37.0002 63.6589 38.1717 62.4874L48 52.6591L57.8283 62.4874C58.9998 63.6589 60.8993 63.6589 62.0709 62.4874L66.4874 58.0709C67.6589 56.8993 67.6589 54.9998 66.4874 53.8283L56.6591 44L66.4874 34.1717C67.6589 33.0002 67.6589 31.1007 66.4874 29.9291L62.0709 25.5126Z" fill="#1F3641"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M67.4462 30.6122L61.3878 24.5538C60.6494 23.8154 59.4522 23.8154 58.7137 24.5538L48 35.2676L37.2863 24.5538C36.5478 23.8154 35.3506 23.8154 34.6122 24.5538L28.5538 30.6122C27.8154 31.3506 27.8154 32.5478 28.5538 33.2863L39.2676 44L28.5538 54.7137C27.8154 55.4522 27.8154 56.6494 28.5538 57.3878L34.6122 63.4462C35.3506 64.1846 36.5478 64.1846 37.2863 63.4462L48 52.7324L58.7137 63.4462C59.4522 64.1846 60.6494 64.1846 61.3878 63.4462L67.4462 57.3878C68.1846 56.6494 68.1846 55.4522 67.4462 54.7137L56.7324 44L67.4462 33.2863C68.1846 32.5478 68.1846 31.3506 67.4462 30.6122Z" fill="#1F3641"/>
<defs>
<filter id="filter0_i_0_460" x="0" y="0" width="96" height="96" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="-8"/>
<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.0666667 0 0 0 0 0.54902 0 0 0 0 0.529412 0 0 0 1 0"/>
<feBlend mode="normal" in2="shape" result="effect1_innerShadow_0_460"/>
</filter>
</defs>
</svg>

    `;
  }

  getOWinIcon() {
    return `    
     <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
  <g filter="url(#filter0_i_0_569)">
    <rect width="96" height="96" rx="10" fill="#F2B137"/>
  </g>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M68 44C68 32.9543 59.0457 24 48 24C36.9543 24 28 32.9543 28 44C28 55.0457 36.9543 64 48 64C59.0457 64 68 55.0457 68 44ZM39.8519 44C39.8519 39.4999 43.4999 35.8519 48 35.8519C52.5001 35.8519 56.1481 39.4999 56.1481 44C56.1481 48.5001 52.5001 52.1481 48 52.1481C43.4999 52.1481 39.8519 48.5001 39.8519 44Z" fill="#1F3641"/>
  <defs>
    <filter id="filter0_i_0_569" x="0" y="0" width="96" height="96" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dy="-8"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.8 0 0 0 0 0.545098 0 0 0 0 0.0745098 0 0 0 1 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_0_569"/>
    </filter>
  </defs>
</svg>

    `;
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

    this.updateTileDisplay();
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
    } else {
      this.playerOScore.textContent = currentScores.playerO;
    }
  }

  updateTileDisplay() {
    this.tiles.forEach((tile, index) => {
      //   tile.textContent = this.board[index] || "";
      tile.innerHTML =
        this.board[index] === "X"
          ? `
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg"><path d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z" fill="#31C3BD" fill-rule="evenodd"/></svg>
      `
          : this.board[index] === "O"
            ? `
        <svg width="64" height="64" xmlns="http://www.w3.org/2000/svg"><path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" fill="#F2B137"/></svg>
        `
            : "";
    });
  }

  // how to determine a win
  checkWin() {
    return this.winningCombinations.some((combination) => {
      this.winnerIndexes = combination;
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
    this.saveGameState();
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
    this.saveGameState();

    if (this.checkWin()) {
      this.updateScore(this.currentPlayer);
      this.handleGameOver(this.currentPlayer);
      // Update winning tiles with the correct icon
      this.updateWinningTiles(this.currentPlayer);
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
    this.saveGameState();
  }

  resetScore() {
    this.scores = {
      solo: { playerX: 0, cpu: 0, ties: 0 },
      multi: { playerX: 0, playerO: 0, ties: 0 },
    };
    this.updateScoreDisplay(this.gameMode);
    this.saveGameState();
    this.resetBoard();
  }

  handleQuit() {
    this.resetScore();
    this.gameMode = null;
    this.toggleElementVisibility(this.gameMenu, true);
    this.toggleElementVisibility(this.gameBoard, false);
    this.toggleElementVisibility(this.bgOverlay, false);
    this.toggleElementVisibility(this.winnerLoserBanner, false);
    this.saveGameState();
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
          <span class="cross">Takes the round</span>
    `
        : winner === "O"
          ? `
          <img src="./code/assets/icon-o.svg" alt="o icon">
          <span class="knot">Takes the round</span>
    `
          : winner === "tie"
            ? `
                <p class="result_tie" style="margin-bottom:8px;">round tied</p>
    `
            : "";
  }

  // Helper method to update winning tiles
  updateWinningTiles(currentPlayer) {
    const winIcon =
      currentPlayer === "X" ? this.getXWinIcon() : this.getOWinIcon();

    // Use a map for faster lookups
    this.winnerIndexes.forEach((index) => {
      const tile = this.tileMap.get(index);
      if (tile) {
        tile.innerHTML = winIcon;
      }
    });
  }

  handleTileClick(tile) {
    if (!this.isGameActive) return;

    const index = tile.dataset.index;

    // check if tile has been occupied.
    if (this.board[index]) return;

    this.makeMove(index);
    this.updateTileDisplay();
    this.saveGameState();

    if (this.checkWin()) {
      this.handleGameOver(this.currentPlayer);
      // Update winning tiles with the correct icon
      this.updateWinningTiles(this.currentPlayer);
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

  saveGameState() {
    const gameState = {
      board: this.board,
      currentPlayer: this.currentPlayer,
      gameMode: this.gameMode,
      isGameActive: this.isGameActive,
      scores: this.scores,
    };
    localStorage.setItem("ticTacToeGame", JSON.stringify(gameState));
  }

  loadGameState() {
    const savedGame = localStorage.getItem("ticTacToeGame");
    if (savedGame) {
      const gameState = JSON.parse(savedGame);
      this.board = gameState.board;
      this.currentPlayer = gameState.currentPlayer;
      this.isGameActive = gameState.isGameActive;
      this.gameMode = gameState.gameMode;
      this.scores = {
        solo: {
          playerX: gameState.scores?.solo?.playerX || 0,
          cpu: gameState.scores?.solo?.cpu || 0,
          ties: gameState.scores?.solo?.ties || 0,
        },
        multi: {
          playerX: gameState.scores?.multi?.playerX || 0,
          playerO: gameState.scores?.multi?.playerO || 0,
          ties: gameState.scores?.multi?.ties || 0,
        },
      };

      if (this.isGameActive) {
        this.startGame(this.gameMode);
      }
      this.updateScoreDisplay(this.gameMode);
    }
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe();
});
