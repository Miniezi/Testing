const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;
const EMPTY_CELL = '';

let board = createEmptyBoard();
let currentPiece;
let currentPieceCoordinates;
let nextPiece;
let gameInterval;
let score = 0;
let level = 1;
let GAME_SPEED = 600;
let isGamePaused = false;

function createEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY_CELL));
}

// ... (continue in the next message)
function drawBoard() {
    gameBoard.innerHTML = '';
    drawGrid();
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell !== EMPTY_CELL) {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.style.top = `${rowIndex * BLOCK_SIZE}px`;
                cellDiv.style.left = `${colIndex * BLOCK_SIZE}px`;
                cellDiv.style.backgroundColor = cell;
                gameBoard.appendChild(cellDiv);
            }
        });
    });
}

function drawGrid() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell';
            cellDiv.style.top = `${row * BLOCK_SIZE}px`;
            cellDiv.style.left = `${col * BLOCK_SIZE}px`;
            cellDiv.style.border = '1px solid #555';
            gameBoard.appendChild(cellDiv);
        }
    }
}

function drawPiece() {
    if (currentPiece) {
        currentPiece.shape.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if (cell) {
                    const cellDiv = document.createElement('div');
                    cellDiv.className = 'cell active';
                    cellDiv.style.top = `${(currentPieceCoordinates.row + rowIndex) * BLOCK_SIZE}px`;
                    cellDiv.style.left = `${(currentPieceCoordinates.col + colIndex) * BLOCK_SIZE}px`;
                    cellDiv.style.backgroundColor = currentPiece.color;
                    gameBoard.appendChild(cellDiv);
                }
            });
        });
    }
}

function drawNextPiece(nextPiece) {
    nextPieceBoard.innerHTML = '';
    nextPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.style.top = `${rowIndex * BLOCK_SIZE}px`;
                cellDiv.style.left = `${colIndex * BLOCK_SIZE}px`;
                cellDiv.style.backgroundColor = nextPiece.color;
                nextPieceBoard.appendChild(cellDiv);
            }
        });
    });
}

// ... (continue in the next message)
function movePieceDown() {
    if (isGamePaused) return;
    clearBoard();
    currentPieceCoordinates.row += 1;
    if (isCollision(currentPiece, currentPieceCoordinates)) {
        currentPieceCoordinates.row -= 1;
        mergePiece();
        removeFullRows();
        currentPiece = nextPiece;
        currentPieceCoordinates = { row: 0, col: Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2) };
        nextPiece = generateRandomPiece();
        increaseSpeed();
    }
    drawBoard();
    drawPiece();
}

function movePieceLeft() {
    if (isGamePaused) return;
    clearBoard();
    currentPieceCoordinates.col -= 1;
    if (isCollision(currentPiece, currentPieceCoordinates)) {
        currentPieceCoordinates.col += 1;
    }
    drawBoard();
    drawPiece();
}

function movePieceRight() {
    if (isGamePaused) return;
    clearBoard();
    currentPieceCoordinates.col += 1;
    if (isCollision(currentPiece, currentPieceCoordinates)) {
        currentPieceCoordinates.col -= 1;
    }
    drawBoard();
    drawPiece();
}

function rotatePiece() {
    if (isGamePaused) return;
    clearBoard();
    const rotatedPiece = rotateMatrix(currentPiece.shape);
    if (!isCollision({ shape: rotatedPiece, color: currentPiece.color }, currentPieceCoordinates)) {
        currentPiece.shape = rotatedPiece;
    }
    drawBoard();
    drawPiece();
}

function rotateMatrix(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) => row.map((val, j) => matrix[N - j][i]));
    return result;
}

function clearBoard() {
    const activeCells = document.querySelectorAll('.active');
    activeCells.forEach(cell => cell.remove());
}

function isCollision(piece, coordinates) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (
                piece.shape[row][col] &&
                (coordinates.row + row >= ROWS ||
                    coordinates.col + col < 0 ||
                    coordinates.col + col >= COLS ||
                    board[coordinates.row + row][coordinates.col + col] !== EMPTY_CELL)
            ) {
                return true;
            }
        }
    }
    return false;
}

// ... (continue in the next message)
function mergePiece() {
    currentPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell) {
                board[currentPieceCoordinates.row + rowIndex][currentPieceCoordinates.col + colIndex] = currentPiece.color;
            }
        });
    });
}

function removeFullRows() {
    const fullRows = board.reduce((acc, row, rowIndex) => {
        if (row.every((cell) => cell !== EMPTY_CELL)) {
            acc.push(rowIndex);
        }
        return acc;
    }, []);

    for (let rowIndex of fullRows) {
        board.splice(rowIndex, 1);
        board.unshift(Array(COLS).fill(EMPTY_CELL));
    }

    score += fullRows.length * 10;
    drawScore();
    increaseLevel();
}

function generateRandomPiece() {
    const pieces = [
        { shape: [[1, 1, 1, 1]], color: 'cyan' },
        { shape: [[1, 1, 1], [0, 1, 0]], color: 'blue' },
        { shape: [[1, 1, 1], [1, 0, 0]], color: 'orange' },
        { shape: [[1, 1, 1], [0, 0, 1]], color: 'yellow' },
        { shape: [[1, 1], [1, 1]], color: 'green' },
        { shape: [[1, 1, 0], [0, 1, 1]], color: 'purple' },
        { shape: [[0, 1, 1], [1, 1, 0]], color: 'red' },
    ];

    const randomIndex = Math.floor(Math.random() * pieces.length);
    return pieces[randomIndex];
}

function startGame() {
    board = createEmptyBoard();
    score = 0;
    level = 1;
    drawBoard();
    currentPiece = generateRandomPiece();
    currentPieceCoordinates = { row: 0, col: Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2) };
    nextPiece = generateRandomPiece();
    drawNextPiece(nextPiece);
    drawScore();
    drawLevel();
    gameInterval = setInterval(() => {
        movePieceDown();
        drawNextPiece(nextPiece);

        if (isCollision(currentPiece, currentPieceCoordinates)) {
            clearInterval(gameInterval);
            drawGameOver();
            const restartButton = document.createElement('button');
            restartButton.id = 'restart-button';
            restartButton.textContent = 'Перезапустить';
            restartButton.addEventListener('click', restartGame);
            gameBoard.appendChild(restartButton);
            return;
        }
    }, GAME_SPEED);
}

function restartGame() {
    const gameOverMessage = document.querySelector('.game-over');
    if (gameOverMessage) {
        gameOverMessage.remove();
    }
    isGamePaused = false;
    startButton.click();
}

// ... (continue in the next message)
function drawGameOver() {
    const gameOverMessage = document.createElement('div');
    gameOverMessage.textContent = 'Игра окончена';
    gameOverMessage.className = 'game-over';
    gameBoard.appendChild(gameOverMessage);
}

function drawScore() {
    const scoreDisplay = document.querySelector('.score');
    scoreDisplay.textContent = `Очки: ${score}`;
}

function drawLevel() {
    const levelDisplay = document.querySelector('.level');
    levelDisplay.textContent = `Уровень: ${level}`;
}

function increaseLevel() {
    if (score >= level * 10) {
        level += 1;
        drawLevel();
        increaseSpeed();
    }
}

function increaseSpeed() {
    GAME_SPEED = Math.max(100, 600 - (level - 1) * 50);
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        movePieceDown();
        drawNextPiece(nextPiece);

        if (isCollision(currentPiece, currentPieceCoordinates)) {
            clearInterval(gameInterval);
            drawGameOver();
            const restartButton = document.createElement('button');
            restartButton.id = 'restart-button';
            restartButton.textContent = 'Перезапустить';
            restartButton.addEventListener('click', restartGame);
            gameBoard.appendChild(restartButton);
            return;
        }
    }, GAME_SPEED);
}

document.getElementById('startButton').addEventListener('click', startGame);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            movePieceLeft();
            break;
        case 'ArrowRight':
            movePieceRight();
            break;
        case 'ArrowDown':
            movePieceDown();
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case 'p':
        case 'P':
            isGamePaused = !isGamePaused;
            break;
        default:
            break;
    }
});
