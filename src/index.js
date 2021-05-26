import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Just renders a single square on the board. Clicking the square will mark it with an 'X' or 'O' depending on whose turn it is
function Square(props) {
  return (
    <button className="square" onClick={props.handleClick}>
      {props.value}
    </button>
  );
}

// The Board displays all 9 of the squares and bubbles click events up to the parent Game component.
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        handleClick={() => this.props.markSquare(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="status">{this.props.status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  state = {
    // Each object in the history array is a list of player 'moves' (i.e. squares). The game starts with just 9 empty squares (move 0)
    // Each time a user clicks a square, a new array of squares is added to the history. Instead of having all null squares, the new array
    // will have a value ('O' or 'X') at the square[index'] the user clicks. As the game progresses, the history array might look like this:
    // 0 => [null, null, null, null, null, null, null, null, null]    // Move/State 0
    // 1 => [null, X, null, null, null, null, null, null, null]       // Move 1. The user marked an X in one of the squares
    // 2 => [null, X, null, O, null, null, null, null, null]          // Move 2. The user marked an O in one of the squares
    history: [{
      squares: [null, null, null, null, null, null, null, null, null]
    }],
    moveNumber: 0,
    xIsNext: true, // The first move will be an 'X',
  };

  markSquare = (i) => {
    // const history = this.state.history;
    // Now that the user can click a button to go back in time to any state, instead of using the full history,
    // we erase any history beyond the selected step so the user can't go back to the future.
    const history = this.state.history.slice(0, this.state.moveNumber + 1);
    const current = history[history.length - 1];
    // For this new 'move', start with a copy of the current state (i.e. squares array)
    const squares = current.squares.slice();

    // If there's already a value in the square, don't allow players to override the moves of other players.
    // Also don't allow squares to be marked if there's already a winner.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Add the value to the square clicked by the user
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    // Add the new 'move' (which is just an array of squares) to the history
    this.setState({
      // Concat adds the squares array (which is an array with one object) to the end of the history array
      history: history.concat([
        {
          squares: squares
        }
      ]),
      // moveNumber: this.state.moveNumber + 1, // Goto the next move
      // The user can go back in time, so instead of incrementing the number, we'll always set the step to the last step.
      // Otherwise, the user could continue making moves forever.
      moveNumber: history.length,
      // Switch to the next player's turn
      xIsNext: !this.state.xIsNext
    })
  };

  // Sets the 'current' step (i.e. moveNumber) to the historical move selected by the user, which will be accessed at history[moveIndex]
  jumpToStep(moveIndex) {
    this.setState({
      moveNumber: moveIndex,
      xIsNext: (moveIndex % 2) === 0, // Since the move could be for any player, we just check if the move (i.e. index) is even or odd.
    })
  }

  render() {
    let status; // This is initialized immediately below so there' no need to initialize it
    const history = this.state.history; // A history of all board states (i.e. the values in all squares)
    //const current = history[history.length - 1]; // Render most recent state

    // Instead of rending the most recent state, render the the user's selected (historical) move instead. This is basically the most
    // important line in the app. It sets the current 'move' to use the historical 'move', which is just an array of squares at hitory[moveNumber]
    const current = history[this.state.moveNumber];

    let winner = calculateWinner(current.squares); // Check for a winner
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // Map the value of each move in the history array (i.e. an array of squares) to a JSX button element, so they can be rendered inside the <ol> below.
    // The 'move' param is the current squares object in the history array.
    const historicalMoves = history.map((move, index) => {
      const instructionText = index ? `Goto move #: ${index}` : `Goto game start`;
      return (
        // CAUTION: It's normally not safe to use the index as a key, but React says it's okay because we aren't
        // going to re-order/remove/insert these buttons dynamically.
        <li key={index}>
          <button onClick={() => this.jumpToStep(index)}>{instructionText}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} status={status} markSquare={(i) => this.markSquare(i)}/>
        </div>
        <div className="game-info">
          <ol>
            {historicalMoves}
          </ol>
        </div>
      </div>
    );
  }
}

// Given an array of 9 squares, this function checks for a winner and returns 'X', 'O', or null as appropriate.
function calculateWinner(squares) {
  // All possible Winning conditions for either the X player or O player
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // For each possible winning condition...
  for (let i = 0; i < lines.length; i++) {
    // Check one winning condition
    const [a, b, c] = lines[i];
    // Check the values of each square at the 'winning' array index combination. If the values in each square
    // match each other (i.e. all 'X' or all 'O'), then return the winner (e.g. 'X', 'O')
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  // If no winner was found, just return null;
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

