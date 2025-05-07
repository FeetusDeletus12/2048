const board = document.getElementById("game-board");
const size = 4;
let tiles = [];

function setup() {
  tiles = Array(size).fill().map(() => Array(size).fill(0));
  addRandomTile();
  addRandomTile();
  drawBoard();
}

function addRandomTile() {
  let emptyTiles = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (tiles[row][col] === 0) emptyTiles.push({ row, col });
    }
  }
  if (emptyTiles.length === 0) return;
  let { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  tiles[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function drawBoard() {
  board.innerHTML = "";
  tiles.flat().forEach(value => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = value === 0 ? "" : value;
    board.appendChild(tile);
  });
}

function slide(row) {
  row = row.filter(val => val); // remove zeros
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return row.filter(val => val).concat(Array(size - row.filter(val => val).length).fill(0));
}

function rotateClockwise(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
}

function rotateCounterClockwise(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[size - 1 - i]));
}

function move(direction) {
  let moved = false;

  if (direction === "ArrowLeft") {
    for (let i = 0; i < size; i++) {
      const newRow = slide(tiles[i]);
      if (tiles[i].toString() !== newRow.toString()) moved = true;
      tiles[i] = newRow;
    }
  } else if (direction === "ArrowRight") {
    for (let i = 0; i < size; i++) {
      const reversed = tiles[i].slice().reverse();
      const newRow = slide(reversed).reverse();
      if (tiles[i].toString() !== newRow.toString()) moved = true;
      tiles[i] = newRow;
    }
  } else if (direction === "ArrowUp") {
    tiles = rotateClockwise(tiles);
    move("ArrowLeft");
    tiles = rotateCounterClockwise(tiles);
    return;
  } else if (direction === "ArrowDown") {
    tiles = rotateClockwise(tiles);
    move("ArrowRight");
    tiles = rotateCounterClockwise(tiles);
    return;
  }

  if (moved) {
    addRandomTile();
    drawBoard();
  }
}

window.addEventListener("keydown", e => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    move(e.key);
  }
});

setup();
