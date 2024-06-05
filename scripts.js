let gameEnvironment = (function() {

  let gameBoard = (function() {

    let boardState = [["c","c","c"],
                      ["c","c","c"],
                      ["c","c","c"]];

    function resetBoard() {
      boardState = [["c","c","c"],
                    ["c","c","c"],
                    ["c","c","c"]];
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
  let controlButtons = document.querySelectorAll(".control-button");
  let editPlayerDialog = document.getElementById("edit-player-dialog");
  let editPlayerForm = document.getElementById("edit-player-form");
  let cancelDialog = document.getElementById("cancel-dialog");
  let scorePlayer1 = document.getElementById("score-player1");
  let namePlayer1 = document.getElementById("name-player1");
  let scorePlayer2 = document.getElementById("score-player2");
  let namePlayer2 = document.getElementById("name-player2");
  let player1 = createPlayer("Player One", "red");
  namePlayer1.style.color = `${player1.getColor()}`;
  let player2 = createPlayer("Player Two", "blue");
  namePlayer2.style.color = `${player2.getColor()}`;
  let turn = 1;
  let gameEndedState = false;
  let editingPlayer;

  gameDisplayContainer.addEventListener( "click", (event) => {

    if ( event.target.className === "move-space" && event.target.textContent === '\u00A0') {
      playRound(event);
    }

  });
  controlButtons.forEach( (controlButton) => {

    if (controlButton.id === "reset-button") {
      controlButton.addEventListener( "click", (event) => {
        resetGame(true);
      })
    } else {
      controlButton.addEventListener( "click", (event) => {
        editingPlayer = event.target.id.slice(-1) === "1" ? "player1" : "player2";
        editPlayerDialog.showModal();
      })
    }

  })
  editPlayerDialog.addEventListener( "submit", () => {

    let playerName = document.querySelector("#player-name");
    let playerColor = document.querySelector("#player-color");

    if (playerName.value.trim() !== '') {
      if (editingPlayer === "player1") {
      changePlayerName(player1, playerName.value);
      namePlayer1.textContent = player1.getName() + ":";
      }
      if (editingPlayer === "player2") {
        changePlayerName(player2, playerName.value);
        namePlayer2.textContent = player2.getName() + ":";
        }
    }
    if (playerColor.value.trim() !== '') {
      if (editingPlayer === "player1") {
        changePlayerColor(player1, playerColor.value);
        namePlayer1.style.color = `${player1.getColor()}`;
        }
        if (editingPlayer === "player2") {
          changePlayerColor(player2, playerColor.value);
          namePlayer2.style.color = `${player2.getColor()}`;
        }
    }
    editPlayerForm.reset();

  });
  cancelDialog.addEventListener( "click", () => {

    editPlayerDialog.close();

  });




  function createPlayer(name, color) {
    let score = 0;

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
    function getColor(newColor) {
      return color;
    };
    function getName(newName) {
      return name;
    };

    return {increaseScore, getScore, resetScore, setNewColor, setNewName, getName, getColor};
  }


  function changePlayerName(playerToChange, playerToChangeNewName) {
    playerToChange.setNewName(playerToChangeNewName);
  }
  function changePlayerColor(playerToChange, playerToChangeNewColor) {
    playerToChange.setNewColor(playerToChangeNewColor);
  }
  function playRound(event) {

    let moveValue = ( turn % 2 === 0 ) ? "O" : "X";
    let moveSpace = event.target;
    let gameState;
    let winningPlayer = "Nobody";


    gameBoard.setBoardState(moveSpace.id.charAt(0), moveSpace.id.charAt(moveSpace.id.length-1), moveValue);

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
    } else if (turn === 9) {
      gameState = "Tie!";
      gameEndedState = true;
    }
    turn++
    renderGame(moveValue, gameState, winningPlayer, moveSpace);
  }

  function renderGame(moveValue, gameState, winningPlayer, moveSpace) {
    if (moveSpace) {
      moveSpace.textContent = moveValue;
    }

    if ( gameEndedState ) {
      let winningPlayerName = winningPlayer === "Nobody" ? winningPlayer : winningPlayer.getName();
      setTimeout(() => {
        resolveGame(gameState, winningPlayerName);
        scorePlayer1.textContent = player1.getScore();
        scorePlayer2.textContent = player2.getScore();
      }, 300);
    } else {
      scorePlayer1.textContent = player1.getScore();
      scorePlayer2.textContent = player2.getScore();
    }
  }

  function resolveGame(endState, winningPlayerName) {
    switch (winningPlayerName) {
      case `${player1.getName()}`:
        player1.increaseScore();
        break;
      case `${player2.getName()}`:
        player2.increaseScore();
        break;
      default:
        break;
    }
    alert(`${endState} \n ${winningPlayerName} wins!`);
    resetGame(false);
  }

  function resetGame(fullResetBool) {
    gameBoard.resetBoard();
    gameEndedState = false;
    let displayBoard = document.querySelectorAll(".move-space");
    displayBoard.forEach ((display) => {display.textContent = '\u00A0'}, displayBoard)
    turn = 1;

    if(fullResetBool) {
      player1.resetScore();
      player2.resetScore();
      renderGame();
    }
  }


  return {player1, player2, gameBoard, changePlayerName, changePlayerColor, resetGame};

})();

