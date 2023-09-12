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
        this.pressedCoords = [];
    }
    createChessBoard() {
        let self = this;
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
                    self.pressedCoords.push([Number(row), Number(col)]);
                    cell.classList.toggle('highlight')

                    if (self.pressedCoords.length === 2) {
                        let a1 = bfs({ x: self.pressedCoords[0][0], y: self.pressedCoords[0][1] }, { x: self.pressedCoords[1][0], y: self.pressedCoords[1][1] });
                        console.log(a1);
                        self.pressedCoords = [];

                        self.play(a1);

                        // remove highlight
                        let highlighted = document.querySelectorAll('.highlight');
                        highlighted.forEach((cell) => {
                            cell.classList.remove('highlight');
                        });
                    }
                    // console.log(`Clicked cell at row ${row}, column ${col}`);
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

    // animate the path
    play(path) {
        // remove the last dot from the path
        path = path.substring(0, path.length - 1);
        // Split the path string into an array of coordinates
        const coordinates = path.split('.').map(coord => {
            const [x, y] = coord.substring(1, coord.length - 1).split(',').map(Number);
            return { x, y };
        });

        // Function to move the knight to the next position with animation
        const moveKnight = (index) => {
            if (index >= coordinates.length) {
                // Animation complete
                return;
            }

            const { x, y } = coordinates[index];
            const cell = document.querySelector(`.cell[data-row="${x}"][data-col="${y}"]`);

            // Add a class for styling to indicate the knight's position
            cell.classList.add('knight');

            // Delay the next move for 500 milliseconds (adjust as needed)
            setTimeout(() => {
                // Remove the knight class from the previous cell
                if (index > 0) {
                    const prevCoordinate = coordinates[index - 1];
                    const prevCell = document.querySelector(`.cell[data-row="${prevCoordinate.x}"][data-col="${prevCoordinate.y}"]`);
                    prevCell.classList.remove('knight');
                }

                // Move to the next position
                moveKnight(index + 1);
            }, 700); // Adjust the delay time as needed
        };

        // Start the animation by moving to the first position
        moveKnight(0);
    }

}

// Create a new instance of the UIManager class
const uiManager = new UIManager();