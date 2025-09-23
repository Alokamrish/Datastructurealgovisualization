import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Crown } from 'lucide-react';

const NQueenVisualizer = ({ onBack }) => {
  const [n, setN] = useState(4);
  const [speed, setSpeed] = useState(500);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [boards, setBoards] = useState([]);
  const [currentSolution, setCurrentSolution] = useState(0);
  const [totalSolutions, setTotalSolutions] = useState(0);

  const solutions = [0, 1, 0, 0, 2, 10, 4, 40, 92];

  const initializeBoard = (size) => {
    return Array(size).fill(null).map(() => Array(size).fill('-'));
  };

  const isValidMove = (board, row, col) => {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === '♕') return false;
    }

    // Check upper left diagonal
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === '♕') return false;
    }

    // Check upper right diagonal
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === '♕') return false;
    }

    return true;
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const solveNQueens = async () => {
    const solutions = [];
    const board = initializeBoard(n);

    const backtrack = async (row) => {
      if (row === n) {
        solutions.push(board.map(r => [...r]));
        return;
      }

      for (let col = 0; col < n; col++) {
        if (isValidMove(board, row, col)) {
          board[row][col] = '♕';
          await backtrack(row + 1);
          board[row][col] = '-';
        }
      }
    };

    await backtrack(0);
    return solutions;
  };

  const startVisualization = async () => {
    if (n > 8) {
      alert('Please enter a number less than or equal to 8');
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    setBoards([]);
    setCurrentSolution(0);
    
    try {
      const solutions = await solveNQueens();
      setTotalSolutions(solutions.length);

      const boardsData = solutions.map((solution, index) => ({
        board: solution,
        id: `board-${index}`,
        isComplete: true
      }));

      setBoards(boardsData);

      // Animate through solutions
      for (let i = 0; i < boardsData.length && !isPaused; i++) {
        setCurrentSolution(i);
        await delay(speed);
      }
    } catch (error) {
      console.error('Error solving N-Queens:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const pauseVisualization = () => {
    setIsPaused(!isPaused);
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setBoards([]);
    setCurrentSolution(0);
    setTotalSolutions(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Chess Visualizers
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">N-Queens Visualizer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Place N queens on an N×N chessboard so that no two queens attack each other
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Board Size (N)
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={n}
                onChange={(e) => setN(Math.max(1, Math.min(8, parseInt(e.target.value) || 1)))}
                disabled={isRunning}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed (ms)
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{speed}ms</div>
            </div>

            <div className="flex items-end">
              <button
                onClick={startVisualization}
                disabled={isRunning && !isPaused}
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </button>
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={pauseVisualization}
                disabled={!isRunning}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Pause className="w-4 h-4 mr-1" />
                Pause
              </button>
              <button
                onClick={resetVisualization}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>
          </div>

          {n > 0 && n <= 8 && (
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-gray-700">
                For a {n}×{n} board, there are <span className="font-bold text-purple-600">{solutions[n]}</span> possible solutions
              </p>
              {totalSolutions > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Currently showing solution {currentSolution + 1} of {totalSolutions}
                </p>
              )}
            </div>
          )}
        </div>

        {boards.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boards.slice(0, Math.min(8, boards.length)).map((boardData, boardIndex) => (
                <div
                  key={boardData.id}
                  className={`bg-white rounded-xl shadow-lg p-4 transition-all duration-300 ${
                    boardIndex === currentSolution ? 'ring-4 ring-purple-400 scale-105' : ''
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                    Solution {boardIndex + 1}
                  </h3>
                  <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
                    {boardData.board.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`
                            aspect-square flex items-center justify-center text-xl font-bold text-black rounded
                            ${(rowIndex + colIndex) % 2 === 0 ? 'bg-yellow-200' : 'bg-orange-300'}
                          `}
                        >
                          {cell === '♕' ? '♕' : ''}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
            {boards.length > 8 && (
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Showing first 8 solutions. Total solutions: {boards.length}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NQueenVisualizer;