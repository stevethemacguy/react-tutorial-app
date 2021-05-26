import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.handleClick}>
      {props.value}
    </button>
  );
}

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
    history: [{
      squares: [null, null, null, null, null, null, null, null, null]
    }],
    moveNumber: 0,
    xIsNext: true // The first move will be X
  };

  markSquare = (i) => {
    // const history = this.state.history;
    // Now that the user can click a button to go back in time to any state, instead of using the full history,
    // we erase any history beyond the selected step so the user can't go back to the future.
    const history = this.state.history.slice(0, this.state.moveNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();  // Start with a copy of the current state (i.e. squares array)

    // If there's already a value in the square, don't allow players to override the moves of other players.
    // Also don't allow squares to be marked if there's already a winner.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'; // Update the value
    // Replace/update the state with the new state
    this.setState({
      // Concat adds the squares array (which is an array with one object) to the end of the history array
      history: history.concat([
        {
          squares: squares
        }
      ]),
      //moveNumber: this.state.moveNumber + 1,
      // Now that the user can go back in time, instead of just incrementing the number, we'll always set the step to the last step
      moveNumber: history.length,
      xIsNext: !this.state.xIsNext // Switch to the next player's turn
    })
  };

  jumpToStep(moveIndex) {
    this.setState({
      //history: step
      moveNumber: moveIndex,
      xIsNext: (moveIndex % 2) === 0,
    })
  }

  render() {
    let status; // This is initialized immediately below so there' no need to initialize it
    const history = this.state.history; // A history of all board states (i.e. the values in all squares)
    //const current = history[history.length - 1]; // The most recent state
    // Instead of using the most recent state, set the state to the the user's selected state instead
    const current = history[this.state.moveNumber];

    let winner = calculateWinner(current?.squares); // check for a winner
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // Map the value of each squares state in the history array to a JSX button element, so they can be rendered inside the <ol> below.
    // The 'move' param is the current squares object in the history array
    const historicalMoves = history.map((move, index) => {
      const instructionText = index ? `Goto move #: ${index}` : `Goto game start`;
      return (
        // Caution: It's normally un-safe to use the index as a key, but React says it's okay because we aren't
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
          <div>{/* status */}</div>
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

