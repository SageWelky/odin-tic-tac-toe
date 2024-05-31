let gameEnvironment = (function() {

  let gameBoard = (function() {
    let boardState = [["c","c","c"],
                      ["c","c","c"],
                      ["c","c","c"]];

    function resetBoard() {
      boardState = [["c","c","c"],
                    ["c","c","c"],
                    ["c","c","c"]];
      player1.resetScore();
      player2.resetScore();
    }
    function getBoardState() {
      return boardState;
    }
    function setBoardState(columnIndex, rowIndex, value){
      boardState[columnIndex][rowIndex] = value;
    }
    return {resetBoard, getBoardState, setBoardState};
  })();

  let gameDisplayContainer = document.querySelector("#game-display-container");

  gameDisplayContainer.addEventListener( "click", (event) => {
    console.log(event.target.textContent);
    if ( event.target.className === "move-space" && event.target.textContent === '\u00A0') {
      playRound(event);
    }
  });

  let player1 = createPlayer("Player One", "red");
  let player2 = createPlayer("Player Two", "blue");
  let turn = 1;
  console.log(turn);
  let gameEndedState = false;


  function createPlayer(inputName, inputColor) {
    let score = 0;
    let name = inputName;
    let color = inputColor;

    function increaseScore() {
      score++;
    };
    function getScore() {
      return score;
    };
    function resetScore() {
      score = 0;
    };
    function setNewColor(newColor) {
      color = newColor;
    };
    function setNewName(newName) {
      name = newName;
    };

    return {name, color, increaseScore, getScore, resetScore, setNewColor, setNewName};
  }


  function changePlayerName(playerToChange, playerToChangeNewName) {
    playerToChange.setNewName(playerToChangeNewName);
  }
  function changePlayerColor(playerToChange, playerToChangeNewColor) {
    playerToChange.setNewName(playerToChangeNewColor);
  }
  function playRound(event) {

    let moveValue = ( turn % 2 === 0 ) ? "O" : "X";
    let moveSpace = event.target;
    let gameState;
    let winningPlayer = "Nobody";


    gameBoard.setBoardState(moveSpace.id.charAt(0), moveSpace.id.charAt(moveSpace.id.length-1), moveValue);

    if (turn === 9) {
      gameState = "Tie!";
      gameEndedState = true;
    } else {
      let board = gameBoard.getBoardState();
      if (
           (board[0][0] === board[0][1] && board[0][0] === board[0][2] && board[0][0] !== "c")
        || (board[1][0] === board[1][1] && board[1][0] === board[1][2] && board[1][0] !== "c")
        || (board[2][0] === board[2][1] && board[2][0] === board[2][2] && board[2][0] !== "c")
        || (board[0][0] === board[1][0] && board[0][0] === board[2][0] && board[0][0] !== "c")
        || (board[0][1] === board[1][1] && board[0][1] === board[2][1] && board[0][1] !== "c")
        || (board[0][2] === board[1][2] && board[0][2] === board[2][2] && board[0][2] !== "c")
        || (board[0][0] === board[1][1] && board[0][0] === board[2][2] && board[0][0] !== "c")
        || (board[2][0] === board[1][1] && board[2][0] === board[0][2] && board[2][0] !== "c")
      ) {
        gameState = "Game Over!";
        winningPlayer = moveValue === "X" ? player1 : player2;
        gameEndedState = true;
      }
    }
    turn++
    renderGame(moveValue, gameState, winningPlayer, moveSpace);
    console.log(turn);
  }

  function renderGame(moveValue, gameState, winningPlayer, moveSpace) {
    moveSpace.textContent = moveValue;

    if ( gameEndedState ) {
      let winningPlayerName = winningPlayer.name ? winningPlayer.name : winningPlayer;
      setTimeout(() => {resolveGame(gameState, winningPlayerName)}, 100);
    }
  }

  function resolveGame(endState, winningPlayerName) {
    //.textContent = `${endState} \n ${winnerName} wins!`
    //.showModal()
    //event listener on modal will call resetGame()
    alert(`${endState} \n ${winningPlayerName} wins!`);
    switch (winningPlayerName) {
      case `${player1.name}`:
        player1.increaseScore();
        break;
      case `${player2.name}`:
        player2.increaseScore();
        break;
      default:
        break;
    }
    resetGame();
  }
  function resetGame() {
    gameBoard.resetBoard();
    gameEndedState = false;
    let displayBoard = document.querySelectorAll(".move-space");
    displayBoard.forEach ((display) => {display.textContent = '\u00A0'}, displayBoard)
    turn = 1;
  }


  return {player1, player2, gameBoard, changePlayerName, changePlayerColor, resetGame};

})();

