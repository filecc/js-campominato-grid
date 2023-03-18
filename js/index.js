function start(){
    document.querySelector('.start').addEventListener('click', () =>{
        let numOfSquares;
        if (document.querySelector('select').selectedIndex === 1){
         numOfSquares = 49;
        } else if (document.querySelector('select').selectedIndex === 2){
         numOfSquares = 100;
        } else {
         numOfSquares = 25;
        }
        document.querySelector('.selectOptions').classList.toggle('d-none');
        document.querySelector('.game').classList.toggle('d-none');
        itsabomb(numOfSquares);
     });
}

start();


function itsabomb(level) {
    let numOfSquares = level;
/* fixed the width of the wrapper according to the grid dimensions */
const property = document.documentElement;
let squareDimension = 25;
// check the windows width
function resizeSquare() {
  if (window.innerWidth <= 600 && numOfSquares > 25) {
    squareDimension = 40;
  } else {
    squareDimension = 50;
  }
  property.style.setProperty(
    "--wrapper-width",
    `${sqrtSquares * squareDimension}px`
  );
  property.style.setProperty("--square-width", `${squareDimension}px`);
}
window.onresize = resizeSquare;
// end of width replacemente
    let win = false;
  
  // if the grid is 10x10 limit the bomb number to 16
  const numOfBombs =
    (numOfSquares === 100 && 16) || Math.floor((numOfSquares / 100) * 20) - 1;
    const bombsToFind = document.getElementById('bombsToFind');
    bombsToFind.innerHTML = numOfBombs;
  // define a constant we'll use later
  const sqrtSquares = Math.sqrt(numOfSquares);

  

  // create the playground
  document.querySelector(".wrapper").innerHTML = "";
  for (let i = 0; i < sqrtSquares; i++) {
    for (let j = 0; j < sqrtSquares; j++) {
        // every square has a unique ID, corresponding to its position on the grid
      document
        .querySelector(".wrapper")
        .append(createChild("div", `m${i + 1}n${j + 1}`, ["square", "position-relative"], ""));
    }
  }
  // fix the outer square border radius
  document.getElementById(`m1n1`).classList.add('squareTopLeft')
  document.getElementById(`m1n${sqrtSquares}`).classList.add('squareTopRight')
  document.getElementById(`m${sqrtSquares}n${sqrtSquares}`).classList.add('squareBottomRight')
  document.getElementById(`m${sqrtSquares}n1`).classList.add('squareBottomLeft')
  /* get all the squares in the playground */
  const squares = document.querySelectorAll(".square");

  /*  create the bombs: ~20% of the total squares -1 */
  let bombs = [];
  while (bombs.length < numOfBombs) {
    const randomCol = getRandomInt(1, sqrtSquares),
    randomRow = getRandomInt(1, sqrtSquares);
    if (bombs.indexOf(`m${randomRow}n${randomCol}`) < 0) {
      bombs.push(`m${randomRow}n${randomCol}`);
    }
  }

  /*  CHECK IF WE CLICK A BOMB */
  for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", () => {
      if (bombs.indexOf(squares[i].id) >= 0) {
        /* END OF THE GAME */
        squares[i].classList.remove("marked");
        squares[i].classList.remove("safe");
        squares[i].classList.add("boom");
        squares[i].innerHTML = '💣';

      } else {
        /* YOU'RE SAFE, YOU CAN CONTINUE THE GAME */
        /* GET CLICKED SQUARE POSITION ON THE GRID */
        const clickedPosition = squares[i].id
          .replace(/[^0-9]/g, "-")
          .split("-");

        const clickedRow = parseInt(clickedPosition[1]),
          clickedCol = parseInt(clickedPosition[2]);

        /* CHECK THE NEIBOROUGH */
        /* THE GRID TO CHECK FOLLOW THIS PATTERN (example of a grid 3x3)
                    sq(mX-1, mY-1) sq(mX-1, mY) sq(mX-1, mY+1)
                    sq(mX, mY-1) *CLICKED(mXnY)* sq(mX, mY+1)
                    sq(mX+1, mY-1) sq(mX+1, mY) sq(mX+1, mY+1)
  
            */

        // create the positions array
        const squarePositionToCheck = [
          [-1, -1],
          [-1, 0],
          [-1, 1],
          [0, -1],
          [0, 1],
          [1, -1],
          [1, 0],
          [1, 1],
        ];

        function checkNearby(row, col) {
          // if some of the square is a bomb let increase this counter
          let aroundBombs = 0;
          // an array of safe spots
          let safeSpot = [];

          // check all the position from the grid
          squarePositionToCheck.forEach((position) => {
            const newRow = row + position[0];
            const newCol = col + position[1];

            // ensure that we're not out of row or col
            if (
              newRow > 0 &&
              newCol > 0 &&
              newRow <= sqrtSquares &&
              newCol <= sqrtSquares
            ) {
              if (bombs.includes(`m${newRow}n${newCol}`)) {
                aroundBombs++;
              } else {
                safeSpot.push([newRow, newCol]);
              }
            }
          });

          if (aroundBombs === 0) {
            document.getElementById(`m${row}n${col}`).classList.add("safe");
            document.getElementById(`m${row}n${col}`).classList.remove("marked");
            document.getElementById(`m${row}n${col}`).innerHTML = ' ';
            // if the square is safe check all the other positions and reveal them until they're 0 too
            safeSpot.forEach((spot) => {
              const newRow = spot[0];
              const newCol = spot[1];
              if (
                !document
                  .getElementById(`m${newRow}n${newCol}`)
                  .classList.contains("safe")
              ) {
                // keep searching...
                checkNearby(newRow, newCol);
              }
            });
          } else {
            //other wise stop the checking
            document.getElementById(`m${row}n${col}`).classList.remove("marked");
            document.getElementById(`m${row}n${col}`).classList.add("aroundNotSafe");
            document.getElementById(`m${row}n${col}`).innerHTML = aroundBombs;
          }
        }

        checkNearby(clickedRow, clickedCol);
      }
    });
  }

/* MARK THE BOMB POSITION */
  let bombsFound = [];
  for (let i = 0; i < squares.length; i++) {
   
    squares[i].addEventListener(
      "contextmenu",
      (event) => {
        event.preventDefault();
         
        if (!squares[i].innerHTML){
            squares[i].classList.add('marked');
            bombsFound.push(
              squares[i].id)
            ;
        }

            
        
        bombsToFind.innerHTML = numOfBombs - bombsFound.length;
        let discovered = 0;
        for (i = 0; i < bombs.length; i++) {
          if (bombsFound.length === bombs.length) {
            if (bombs.includes(bombsFound[i])) {
              discovered++;
            }
          }
          if (discovered === bombs.length) {
            win=true;
          }
        }
        return false;
      },
      false
    );
  }
  
  
  
}


