// list a direction array for knight moves in chess
const directions = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1]
];

// a src/target bfs returning the cells traversed to get to target
function bfs(src, target) {
    // create a queue and enqueue first cell
    let q = [];
    q.push({ x: src.x, y: src.y, path: `(${src.x},${src.y}).` });

    // create a set to avoid cycles
    let visited = new Set();
    visited.add(src.x + src.y * 8);

    // loop until queue is empty
    while (q.length > 0) {
        let curr = q.shift();

        // if we have reached the target cell, return its distance
        if (curr.x === target.x && curr.y === target.y) {
            return curr.path;
        }

        // loop for all reachable states
        for (let i = 0; i < directions.length; i++) {
            let x = curr.x + directions[i][0];
            let y = curr.y + directions[i][1];

            // if reachable state is not yet visited and inside board, push that state into queue
            if (isInsideBoard(x, y) && !visited.has(x + y * 8)) {
                visited.add(x + y * 8);
                q.push({ x, y, path: curr.path + `(${x},${y}).` });
            }
        }
    }

    // return -1 if path is not possible
    return -1;
}

// check if (x, y) is valid chess board coordinates
function isInsideBoard(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}


// testing bfs
let a1 = bfs({ x: 0, y: 0 }, { x: 3, y: 3 });
console.log(a1); // (0,0)(2,1)(3,3)


// UIManager
class UIManager {
    constructor() {
        this.chessboard = document.querySelector('.chessboard');
        this.createChessBoard();
    }
    createChessBoard() {
        // Create 8 rows
        for (let i = 0; i < 8; i++) {
            const row = document.createElement('div');
            row.classList.add('row');

            // Create 8 cells in each row
            for (let j = 0; j < 8; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                // Add a unique identifier to each cell based on its row and column
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);

                // Add a click event listener to each cell
                cell.addEventListener('click', function() {
                    const row = this.getAttribute('data-row');
                    const col = this.getAttribute('data-col');
                    console.log(`Clicked cell at row ${row}, column ${col}`);
                });

                // Alternate the color of cells
                if ((i + j) % 2 === 0) {
                    cell.classList.add('white');
                } else {
                    cell.classList.add('black');
                }

                row.appendChild(cell);
            }

            this.chessboard.appendChild(row);
        }
    }
}

// Create a new instance of the UIManager class
const uiManager = new UIManager();