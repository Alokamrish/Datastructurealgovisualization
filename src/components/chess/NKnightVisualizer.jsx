import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Zap } from 'lucide-react';

const NKnightVisualizer = ({ onBack }) => {
  const [n, setN] = useState(4);
  const [speed, setSpeed] = useState(500);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [boards, setBoards] = useState([]);
  const [currentSolution, setCurrentSolution] = useState(0);
  const [totalSolutions, setTotalSolutions] = useState(0);

  const initializeBoard = (size) => {
    return Array(size).fill(null).map(() => Array(size).fill('-'));
  };

  const isValidMove = (board, row, col) => {
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (let move of knightMoves) {
      const newRow = row + move[0];
      const newCol = col + move[1];
      
      if (newRow >= 0 && newRow < n && newCol >= 0 && newCol < n) {
        if (board[newRow][newCol] === '♞') return false;
      }
    }
    return true;
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // ✅ Correct N-Knights Solver
  const solveNKnights = async () => {
    const solutions = [];
    const board = initializeBoard(n);

    const backtrack = async (row, col, placed) => {
      // base case: exactly n knights placed
      if (placed === n) {
        solutions.push(board.map(r => [...r]));
        return;
      }

      if (row >= n) return; // out of bounds

      // compute next cell
      let nextRow = row;
      let nextCol = col + 1;
      if (nextCol === n) {
        nextRow++;
        nextCol = 0;
      }

      // Option 1: place knight if valid
      if (isValidMove(board, row, col)) {
        board[row][col] = '♞';
        await backtrack(nextRow, nextCol, placed + 1);
        board[row][col] = '-';
      }

      // Option 2: skip this cell
      await backtrack(nextRow, nextCol, placed);
    };

    await backtrack(0, 0, 0);
    return solutions;
  };

  const startVisualization = async () => {
    if (n > 6) {
      alert('⚠️ Be careful: for n > 6, the number of solutions becomes very large and may freeze your browser!');
    }

    setIsRunning(true);
    setIsPaused(false);
    setBoards([]);
    setCurrentSolution(0);
    
    try {
      const solutions = await solveNKnights();
      setTotalSolutions(solutions.length);

      const boardsData = solutions.map((solution, index) => ({
        board: solution,
        id: `board-${index}`,
        isComplete: true
      }));

      setBoards(boardsData);

      for (let i = 0; i < boardsData.length; i++) {
        if (isPaused) break;
        setCurrentSolution(i);
        await delay(speed);
      }
    } catch (error) {
      console.error('Error solving N-Knights:', error);
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
            <Zap className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">N-Knights Visualizer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Place <b>exactly N knights</b> on an N×N chessboard so that no two knights attack each other
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

          {totalSolutions > 0 && (
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-gray-700">
                For a {n}×{n} board, found <span className="font-bold text-blue-600">{totalSolutions}</span> possible solutions
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Currently showing solution {currentSolution + 1} of {totalSolutions}
              </p>
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
                    boardIndex === currentSolution ? 'ring-4 ring-blue-400 scale-105' : ''
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
                          {cell === '♞' ? '♞' : ''}
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

export default NKnightVisualizer;
