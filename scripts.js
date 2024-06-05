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
  namePlayer1.style.color = `${player1.color}`;
  let player2 = createPlayer("Player Two", "blue");
  namePlayer2.style.color = `${player2.color}`;
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
      namePlayer1.textContent = player1.name + ":";
      console.log(player1.name);
      }
      if (editingPlayer === "player2") {
        changePlayerName(player2, playerName.value);
        namePlayer2.textContent = player2.name + ":";
        console.log(player2.name);
        }
    }
    if (playerColor.value.trim() !== '') {
      if (editingPlayer === "player1") {
        console.log(playerColor.value);
        changePlayerColor(player1, playerColor.value);
        namePlayer1.style.color = `${player1.color}`;
        console.log(player1.color);
        }
        if (editingPlayer === "player2") {
          changePlayerColor(player2, playerColor.value);
          namePlayer2.style.color = `${player2.color}`;
          console.log(player2.color);
        }
    }
    editPlayerForm.reset();

  });
  cancelDialog.addEventListener( "click", () => {

    editPlayerDialog.close();

  });




  function createPlayer(name, color) {
    let player = {};
    player.score = 0;
    player.name = name;
    player.color = color;
    player.increaseScore = function increaseScore() {
      player.score++;
    };
    player.getScore = function getScore() {
      return player.score;
    };
    player.resetScore = function resetScore() {
      player.score = 0;
    };;
    player.setNewColor = function setNewColor(newColor) {
      player.color = newColor;
    };
    player.setNewName = function setNewName(newName) {
      player.name = newName;
    };

    return player;
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
      let winningPlayerName = winningPlayer.name ? winningPlayer.name : winningPlayer;
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
    //.textContent = `${endState} \n ${winnerName} wins!`
    //.showModal()
    //event listener on modal will call resetGame()

    console.log(winningPlayerName);
    console.log(player1.name);
    console.log(winningPlayerName === player1.name);
    switch (winningPlayerName) {
      case `${player1.name}`:
        player1.increaseScore();
        console.log(player1.getScore());
        break;
      case `${player2.name}`:
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

