function start() {
  
  document.querySelector(".start").addEventListener("click", () => {

    let numOfSquares = 25;
    const levelSelected = document.querySelector("select").selectedIndex;
    if (levelSelected === 1) {
      numOfSquares = 49;
    } else if (levelSelected === 2) {
      numOfSquares = 100;
    }
    const squareRootNum = Math.sqrt(numOfSquares);
    const property = document.documentElement;
    property.style.setProperty("--wrapper-width", `${squareRootNum * 50}px` );

    if (window.innerWidth < 600 && numOfSquares > 25) {
      property.style.setProperty("--wrapper-width",`${squareRootNum * 35}px`);
      property.style.setProperty("--square-width", `35px`);
    }
    document.querySelector(".selectOptions").classList.toggle("d-none");
    document.querySelector(".game").classList.toggle("d-none");
    itsabomb(numOfSquares, squareRootNum);
  });
}

function itsabomb(level, squaredRoot) {
  let wins = false;
  const numOfSquares = level;
   // define a constant we'll use later
  const sqrtSquares = squaredRoot;

  /* fix the width of the wrapper according to the grid dimensions */
  const property = document.documentElement;
  let squareDimension = 25;

  // check the windows width
  function resizeSquare() {
    (window.innerWidth <= 600 && numOfSquares > 25) ? squareDimension = 40 : squareDimension = 50;
    property.style.setProperty("--wrapper-width",`${sqrtSquares * squareDimension}px`);
    property.style.setProperty("--square-width", `${squareDimension}px`);
  }
  window.onresize = resizeSquare;

  // if the grid is 10x10 limit the bomb number to 16
  const numOfBombs =
    (numOfSquares === 100 && 16) || Math.floor((numOfSquares / 100) * 20) - 1;
  const bombsToFind = document.getElementById("bombsToFind");
  bombsToFind.innerHTML = numOfBombs;
 

  // create the playground
  const wrapper = document.querySelector(".wrapper");
  wrapper.innerHTML = "";
  
  for (let i = 0; i < sqrtSquares; i++) {
    for (let j = 0; j < sqrtSquares; j++) {
      // every square has a unique ID, corresponding to its position on the grid
      wrapper.append(createChild("div", `m${i + 1}n${j + 1}`, ["square"], ""));
    }
  }

  const btnContainer = document.querySelector(".btnContainer");
  const markBtn = createChild("button", "markMode", ["btn", "btn-outline-warning"], "🚩 Put a flag");
  const btnCheck = createChild("button", "checkWinner", ["btn", "btn-warning"], "Check");
  btnContainer.append(markBtn);
  btnContainer.append(btnCheck);

  // fix the outer square border radius
  document.getElementById(`m1n1`).classList.add("squareTopLeft");
  document.getElementById(`m1n${sqrtSquares}`).classList.add("squareTopRight");
  document
    .getElementById(`m${sqrtSquares}n${sqrtSquares}`)
    .classList.add("squareBottomRight");
  document
    .getElementById(`m${sqrtSquares}n1`)
    .classList.add("squareBottomLeft");

  /* get all the squares in the playground */
  const squares = document.querySelectorAll(".square");
  let bombsFound = [];

  /*  create the bombs: ~20% of the total squares -1 */
  let bombs = [];
  let markMode = false;

  while (bombs.length < numOfBombs) {
    const randomCol = getRandomInt(1, sqrtSquares),
      randomRow = getRandomInt(1, sqrtSquares);
    if (bombs.indexOf(`m${randomRow}n${randomCol}`) < 0) {
      bombs.push(`m${randomRow}n${randomCol}`);
    }
  }

  // add the possibility to add just the flag
  markBtn.addEventListener("click", () => {
    if (markMode === false) {
      markMode = true;
      toggleClasses(markBtn, ["btn-outline-warning", "btn-success"]);
      const iconCheck = createChild('i', '', ['fa-solid', 'fa-check'], '');
      markBtn.textContent = '';
      markBtn.append(iconCheck);
    } else {
      markMode = false;
      toggleClasses(markBtn, ["btn-outline-warning", "btn-success"]);
      markBtn.textContent = "🚩 Put a flag";
    }
  });

  /*  CHECK IF WE CLICK A BOMB */
  for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", function clickTheSquare() {
      // check for mobile user if we want to add a flag
      if (markMode) {
        //add the mark if the square is empty and is not already marked
        if (!squares[i].innerHTML && !squares[i].classList.contains("marked")) {
          squares[i].classList.add("marked");
          bombsFound.push(squares[i].id);
          btnCheckDisabled();
        } else {
          squares[i].classList.remove("marked");
          bombsFound.splice(bombsFound.indexOf(squares[i].id), 1);
          btnCheckDisabled();
        }
        // update the remaining bombs according to the user
        document.getElementById("bombsToFind").textContent = numOfBombs - bombsFound.length;
      } else {
        if (bombs.indexOf(squares[i].id) >= 0) {
          /* END OF THE GAME */
          squares[i].textContent = "💣";
          squares[i].className = "";
          wrapper.classList.add("position-relative");
          addClasses(squares[i], ["boom", "destroy", "explosion", "square"]);
          explosion(squares[i]);
          squares[i].innerHTML += "<br>BOOM";
          btnContainer.textContent = "";
          btnContainer.style.justifyContent = "center";
          const replay =  createChild("a", "replay", ["btn", "btn-danger"], "Replay");
          btnContainer.append(replay);
          replay.setAttribute("href", "./index.html");
          document.querySelector("#gameHeader h2").style.display = "none";
          squares[i].removeEventListener('click', clickTheSquare, false);
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
              const idPosition = document.getElementById(`m${row}n${col}`);
              idPosition.classList.add("safe");
              idPosition.classList.remove("marked");
              idPosition.textContent = " ";
              idPosition.removeEventListener('click', clickTheSquare, false);
              if (bombsFound.includes(idPosition.id)) {
                bombsFound.splice(bombsFound.indexOf(idPosition.id), 1);
              }
              document.getElementById("bombsToFind").textContent =
                numOfBombs - bombsFound.length;
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
              //otherwise stop the checking
              const checked = document.getElementById(`m${row}n${col}`);
              checked.classList.remove("marked");
              if (!checked.classList.contains('safe')){
                checked.classList.add("aroundNotSafe");
                checked.textContent = aroundBombs;
              }
              checked.removeEventListener('click', clickTheSquare);
              if (bombsFound.includes(checked.id)) {
                bombsFound.splice(bombsFound.indexOf(checked.id), 1);
              }
              document.getElementById("bombsToFind").textContent =
                numOfBombs - bombsFound.length;
            }
          }

          checkNearby(clickedRow, clickedCol);
        }
      }
    });
  }

  /* MARK THE BOMB POSITION */

  for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener("contextmenu", function handleMark(e) {
        
        e.preventDefault();
        //add the mark if the square is empty and is not already marked
        if (!squares[i].innerHTML && !squares[i].classList.contains("marked") && !squares[i].classList.contains("safe")) {
          squares[i].classList.add("marked");
          bombsFound.push(squares[i].id);
          btnCheckDisabled();
        } else {
          squares[i].classList.remove("marked");
          if (bombsFound.includes(squares[i].id)) {
            bombsFound.splice(bombsFound.indexOf(squares[i].id), 1);
          }
          btnCheckDisabled();
        }

        // update the remaining bombs according to the user
        document.getElementById("bombsToFind").innerHTML =
          numOfBombs - bombsFound.length;
        return false;
      },
      false
    );
  }

  
  btnCheck.disabled = true;
  /* update the state of the button for check if the user wins or not, after guessing at least the same amount of bombs */
  function btnCheckDisabled() {
    if (bombsFound.length >= numOfBombs) {
      btnCheck.disabled = false;
    } else {
      btnCheck.disabled = true;
    }
  }

  let checkPassed = 0;
  btnCheck.addEventListener("click", () => {
    checkPassed = 0;
    btnCheck.classList.toggle("tryAgain");
    setTimeout(checkNow, 100);

    function checkNow() {
      if (numOfBombs === bombsFound.length) {
        for (let i = 0; i < bombsFound.length; i++) {
          if (bombs.includes(bombsFound[i])) {
            checkPassed++;
          }
        }
      }
      if (checkPassed === numOfBombs) {
        btnCheck.classList.remove("tryAgain");
        celebrate();
        theyWin();
        wins = true;

        btnContainer.innerHTML = "";
        btnContainer.style.justifyContent = "center";
        btnContainer.append(
          createChild("a", "replay", ["btn", "btn-danger"], "Replay")
        );
        const replay = document.getElementById("replay");
        replay.setAttribute("href", "./index.html");
        document.querySelector("#gameHeader h2").style.display = "none";
      } else {
        btnCheck.classList.add("tryAgain");
      }
    }
  });

  function explosion(element) {
    let id = null;
    let width = 0;
    clearInterval(id);
    id = setInterval(frame, 10);
    function frame() {
      if (width == 100) {
        clearInterval(id);
      } else {
        width++;
        element.style.width = width + "%";
        element.style.height = width + "%";
      }
    }
  }

  function theyWin() {
    bombs.forEach((bomb) => {
      const toApply = document.getElementById(bomb);
      toApply.className = "";
      addClasses(toApply, ["square", "flower"]);
    });
    squares.forEach((square) => {
      if (!bombs.includes(square.id)) {
        square.className = "";
        square.textContent = "";
        addClasses(square, ["square", "safe"]);
      }
    });
  }
  console.log(bombs)
}

start();