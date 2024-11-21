const cells = document.querySelectorAll(".cell");
const statusDiv = document.getElementById("status");
const resetButton = document.getElementById("reset");
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game-container");
const vsFriendButton = document.getElementById("vsFriend");
const vsComputerButton = document.getElementById("vsComputer");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let vsComputer = false; 

// Winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Show menu
function showMenu() {
    menu.style.display = "block";
    gameContainer.style.display = "none";
}

// Start Game
function startGame(isVsComputer) {
    vsComputer = isVsComputer;
    menu.style.display = "none";
    gameContainer.style.display = "block";
    resetGame();
}

// Handle cell click
function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute("data-index");

    if (board[index] !== "" || !gameActive) return;

    makeMove(index, currentPlayer);

    if (checkWin(currentPlayer)) {
        statusDiv.textContent = `${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        statusDiv.textContent = "It's a tie!";
        gameActive = false;
        return;
    }

    if (vsComputer && currentPlayer === "X") {
        currentPlayer = "O";
        setTimeout(computerMove, 500); // Хід комп'ютера
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusDiv.textContent = `${currentPlayer}'s turn!`;
    }
}

// Move of Computer
function computerMove() {
    const bestMove = minimax(board, "O").index;
    makeMove(bestMove, "O");

    if (checkWin("O")) {
        statusDiv.textContent = "Computer wins!";
        gameActive = false;
        return;
    }

    if (board.every(cell => cell !== "")) {
        statusDiv.textContent = "It's a tie!";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
    statusDiv.textContent = "Your turn!";
}

// Make a move
function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
    cells[index].classList.add("taken");
}

// Перевірка на перемогу
function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

// Algorithm Minimax
function minimax(newBoard, player) {
    const availableCells = newBoard
        .map((value, index) => (value === "" ? index : null))
        .filter(index => index !== null);

    if (checkWin("X")) return { score: -10 };
    if (checkWin("O")) return { score: 10 };
    if (availableCells.length === 0) return { score: 0 };

    const moves = [];

    for (const index of availableCells) {
        const move = {};
        move.index = index;
        newBoard[index] = player;

        if (player === "O") {
            move.score = minimax(newBoard, "X").score;
        } else {
            move.score = minimax(newBoard, "O").score;
        }

        newBoard[index] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (const move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (const move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

// Restart game
function resetGame() {
    currentPlayer = "X";
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    statusDiv.textContent = "Your turn!";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("taken");
    });
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);
vsFriendButton.addEventListener("click", () => startGame(false));
vsComputerButton.addEventListener("click", () => startGame(true));

showMenu();