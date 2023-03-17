function itsabomb() {
    const numOfSquares = 25;
    const numOfBombs = Math.round((numOfSquares / 100) * 20) - 1;
  
    /* fixed the width of the wrapper */
    document.documentElement.style.setProperty(
      '--wrapper-width',
      `${Math.sqrt(numOfSquares) * 50}px`
    );
  
    document.querySelector('.wrapper').innerHTML = '';
    // create the playground
    for (let i = 0; i < Math.sqrt(numOfSquares); i++) {
      for (let j = 0; j < Math.sqrt(numOfSquares); j++) {
        document
          .querySelector('.wrapper')
          .append(createChild('div', `m${i + 1}n${j + 1}`, ['square'], ''));
      }
    }
    /* get all the squares in the playground */
    const squares = document.querySelectorAll('.square');
  
    /*  create the bombs: ~20% of the total squares */
    let bombs = [];
    let counter = 0;
    while (counter < numOfBombs) {
      const randomCol = getRandomInt(1, Math.sqrt(numOfSquares));
      const randomRow = getRandomInt(1, Math.sqrt(numOfSquares));
      if (bombs.indexOf(`m${randomRow}n${randomCol}`) < 0) {
        bombs.push(`m${randomRow}n${randomCol}`);
        counter++;
      }
    }
    console.log(bombs);
  
    function checkSquare() {
      /*  CHECK IF WE CLICK A BOMB */
      for (let i = 0; i < squares.length; i++) {
        squares[i].addEventListener('click', () => {
          if (bombs.indexOf(squares[i].id) >= 0) {
            /* END OF THE GAME */
            squares[i].classList.add('boom');
          } else {
            /* YOU'RE SAFE, CONTINUE */
            squares[i].classList.add('safe');
            /* GET CLICKED SQUARE POSITION ON THE GRID */
            const clickedPosition = squares[i].id
              .replace(/[^0-9]/g, '-')
              .split('-');
            console.log(clickedPosition);
            const clickedRow = parseInt(clickedPosition[1]),
              clickedCol = parseInt(clickedPosition[2]);
            console.log(clickedRow, clickedCol);
  
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
            // if some of the square is a bomb let increase the counter
            let aroundBombs = 0;
            let safeSpots = [];
  
            squarePositionToCheck.forEach((position) => {
              const row = clickedRow + position[0];
              const col = clickedCol + position[1];
  
              if (bombs.includes(`m${row}n${col}`)) {
                aroundBombs++;
              } else {
                safeSpots.push(`m${row}n${col}`);
              }
            });
  
            if (aroundBombs === 0) {
              console.log(safeSpots);
              for (let i = 0; i < safeSpots.length; i++) {
                const square = document.getElementById(safeSpots[i]);
                if (square && square.innerHTML === '') {
                  square.classList.add('safe');
                }
              }
            } else {
              squares[i].innerHTML = aroundBombs;
            }
          }
        });
      }
    }
  
    checkSquare();
  
  
  }
  
  itsabomb();