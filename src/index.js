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
    xIsNext: true // The first move will be X
  };

  markSquare = (i) => {
    const history = this.state.history;
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
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext // Switch to the next player's turn
    })
  };

  render() {
    let status; // This is initialized immediately below so there' no need to initialize it
    const history = this.state.history; // A history of all board states (i.e. the values in all squares)
    const current = history[history.length - 1]; // The most recent state

    let winner = calculateWinner(current?.squares); // check for a winner
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // Map the value of each squares state in the history array to a JSX button element, so they can be rendered inside the <ol> below
    const historicalMoves = history.map((step, move) => {
      const instructionText = move ? `Goto move #: ${move}` : `Goto game start`;
      return (
        <li>
          <button onClick={()=> {
            this.setState({
              history: step
            })
          }}>{instructionText}</button>
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

