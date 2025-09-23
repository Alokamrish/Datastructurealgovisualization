import React, { useState } from 'react';
import { ArrowLeft, Crown, Zap, Castle, Triangle } from 'lucide-react';
import NQueenVisualizer from './chess/NQueenVisualizer';
import NKnightVisualizer from './chess/NKnightVisualizer';
import NRookVisualizer from './chess/NRookVisualizer';

const ChessVisualizers = ({ onBack }) => {
  const [activePiece, setActivePiece] = useState(null);

  const pieces = [
    {
      id: 'queen',
      name: 'N-Queens',
      description: 'Place N queens on an N×N chessboard so no two queens attack each other',
      icon: Crown,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'knight',
      name: 'N-Knights',
      description: 'Place N knights on an N×N chessboard so no two knights attack each other',
      icon: Zap,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'rook',
      name: 'N-Rooks',
      description: 'Place N rooks on an N×N chessboard so no two rooks attack each other',
      icon: Castle,
      color: 'from-emerald-500 to-emerald-600'
    },
   
  ];

  if (activePiece) {
    const renderVisualizer = () => {
      switch (activePiece) {
        case 'queen':
          return <NQueenVisualizer onBack={() => setActivePiece(null)} />;
        case 'knight':
          return <NKnightVisualizer onBack={() => setActivePiece(null)} />;
        case 'rook':
          return <NRookVisualizer onBack={() => setActivePiece(null)} />;
       
        default:
          return null;
      }
    };

    return renderVisualizer();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Chess Piece Visualizers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solve classic chess puzzles and watch algorithms find all possible arrangements
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {pieces.map((piece) => {
            const IconComponent = piece.icon;
            return (
              <div
                key={piece.id}
                onClick={() => setActivePiece(piece.id)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className={`h-24 bg-gradient-to-r ${piece.color} p-4 flex items-center justify-center`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {piece.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {piece.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChessVisualizers;