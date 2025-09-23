import React, { useState } from 'react';
import { ArrowLeft, GitBranch } from 'lucide-react';
import DFSVisualizer from './graph/DFSVisualizer';
import BFSVisualizer from './graph/BFSVisualizer';
import DijkstraVisualizer from './graph/DijkstraVisualizer';
import FloydVisualizer from './graph/FloydVisualizer';
import BellmanFord from './graph/BellmanFord';
import Toposort from './graph/Toposort';
import Kruskal from './graph/Kruskal';


const GraphVisualizers = ({ onBack }) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState(null);

  const algorithms = [
    {
      id: 'dfs',
      name: 'Depth-First Search',
      description: 'Explore graph by going as deep as possible before backtracking',
      complexity: 'O(V + E)',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'bfs',
      name: 'Breadth-First Search',
      description: 'Explore graph level by level using a queue',
      complexity: 'O(V + E)',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      description: 'Find shortest path from source to all vertices',
      complexity: 'O(V²)',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'floyd',
      name: 'Floyd-Warshall',
      description: 'Find shortest paths between all pairs of vertices',
      complexity: 'O(V³)',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'bellman',
      name: 'Bellman-Ford',
      description: 'Find shortest paths and detect negative cycles',
      complexity: 'O(VE)',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'kruskal',
      name: "Kruskal's MST",
      description: 'Find minimum spanning tree using union-find',
      complexity: 'O(E log E)',
      color: 'from-indigo-500 to-indigo-600'
    },
    
    {
      id: 'topological',
      name: 'Topological Sort',
      description: 'Linear ordering of vertices in directed acyclic graph',
      complexity: 'O(V + E)',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  if (activeAlgorithm) {
    const renderVisualizer = () => {
      switch (activeAlgorithm) {
        case 'dfs':
          return <DFSVisualizer onBack={() => setActiveAlgorithm(null)} />;
        case 'bfs':
          return <BFSVisualizer onBack={() => setActiveAlgorithm(null)} />;
        case 'dijkstra':
          return <DijkstraVisualizer onBack={() => setActiveAlgorithm(null)} />;
        case 'floyd':
          return <FloydVisualizer onBack={() => setActiveAlgorithm(null)} />;
        case 'bellman':
          return <BellmanFord onBack={() => setActiveAlgorithm(null)} />;
           case 'topological':
          return <Toposort onBack={() => setActiveAlgorithm(null)} />;
            case 'kruskal':
          return <Kruskal onBack={() => setActiveAlgorithm(null)} />;
           
        default:
          return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
              <div className="text-center">
                <button
                  onClick={() => setActiveAlgorithm(null)}
                  className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-8 mx-auto"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Graph Algorithms
                </button>
                <div className="bg-white rounded-2xl shadow-lg p-12">
                  <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
                  <p className="text-gray-600">This visualizer is under development.</p>
                </div>
              </div>
            </div>
          );
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Graph Algorithm Visualizers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore graph traversal, shortest path, and minimum spanning tree algorithms
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {algorithms.map((algorithm) => (
            <div
              key={algorithm.id}
              onClick={() => setActiveAlgorithm(algorithm.id)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className={`h-20 bg-gradient-to-r ${algorithm.color} p-4 flex items-center justify-center`}>
                  <GitBranch className="w-6 h-6 text-white" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {algorithm.name}
                    </h3>
                    <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {algorithm.complexity}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {algorithm.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizers;
