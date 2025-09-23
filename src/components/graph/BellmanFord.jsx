import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, GitBranch } from 'lucide-react';

const BellmanFordVisualizer = ({ onBack }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [distances, setDistances] = useState([]);
  const [currentEdgeIndex, setCurrentEdgeIndex] = useState(0);
  const [iteration, setIteration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [sourceNode, setSourceNode] = useState(0);

  useEffect(() => {
    generateGraph();
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && !isPaused) {
      timer = setTimeout(step, speed);
    }
    return () => clearTimeout(timer);
  }, [isRunning, isPaused, currentEdgeIndex, iteration]);

  const generateGraph = () => {
    const nodeCount = 5;
    const newNodes = [];
    const newEdges = [
      { from: 0, to: 1, weight: 6 },
      { from: 0, to: 3, weight: 7 },
      { from: 1, to: 2, weight: 5 },
      { from: 1, to: 3, weight: 8 },
      { from: 1, to: 4, weight: -4 },
      { from: 2, to: 1, weight: -2 },
      { from: 3, to: 2, weight: -3 },
      { from: 3, to: 4, weight: 9 },
      { from: 4, to: 0, weight: 2 },
      { from: 4, to: 2, weight: 7 },
    ];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount;
      const x = 200 + 150 * Math.cos(angle);
      const y = 200 + 150 * Math.sin(angle);
      newNodes.push({ id: i, x, y, label: i.toString() });
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setDistances(new Array(nodeCount).fill(Infinity));
    resetVisualization();
  };

  const step = () => {
    const n = nodes.length;
    if (iteration >= n - 1) {
      setIsRunning(false);
      return;
    }

    const edge = edges[currentEdgeIndex];
    const newDistances = [...distances];

    if (newDistances[edge.from] + edge.weight < newDistances[edge.to]) {
      newDistances[edge.to] = newDistances[edge.from] + edge.weight;
    }
    setDistances(newDistances);

    if (currentEdgeIndex + 1 < edges.length) {
      setCurrentEdgeIndex(currentEdgeIndex + 1);
    } else {
      setCurrentEdgeIndex(0);
      setIteration(iteration + 1);
    }
  };

  const startVisualization = () => {
    const n = nodes.length;
    const newDistances = new Array(n).fill(Infinity);
    newDistances[sourceNode] = 0; // start node
    setDistances(newDistances);
    setIsRunning(true);
    setIsPaused(false);
    setIteration(0);
    setCurrentEdgeIndex(0);
  };

  const pauseVisualization = () => {
    setIsPaused(!isPaused);
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIteration(0);
    setCurrentEdgeIndex(0);
    const n = nodes.length;
    const newDistances = new Array(n).fill(Infinity);
    newDistances[sourceNode] = 0;
    setDistances(newDistances);
  };

  const getNodeColor = (nodeId) => {
    if (nodeId === sourceNode) return '#3b82f6'; // source node
    return '#6b7280';
  };

  const getEdgeColor = (edge, index) => {
    if (index === currentEdgeIndex && isRunning) return '#ef4444'; // currently relaxing
    return '#d1d5db';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GitBranch className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Bellman-Ford Algorithm</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compute shortest paths from a single source to all nodes, handling negative weights
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            {/* Select Start Node */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Node</label>
              <select
                value={sourceNode}
                onChange={(e) => setSourceNode(parseInt(e.target.value))}
                disabled={isRunning}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    Node {node.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={startVisualization}
                disabled={isRunning && !isPaused}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4 mr-2" /> Start
              </button>
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={pauseVisualization}
                disabled={!isRunning}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Pause className="w-4 h-4" />
              </button>
              <button
                onClick={resetVisualization}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Speed (ms)</label>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{speed}ms</div>
            </div>
          </div>

          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              Iteration: {iteration + 1}/{nodes.length - 1}, Current Edge: {currentEdgeIndex + 1}/{edges.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <svg width="400" height="400" className="border rounded-lg">
              {edges.map((edge, idx) => {
                const fromNode = nodes.find((n) => n.id === edge.from);
                const toNode = nodes.find((n) => n.id === edge.to);
                return (
                  <line
                    key={idx}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={getEdgeColor(edge, idx)}
                    strokeWidth="2"
                  />
                );
              })}

              {nodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill={getNodeColor(node.id)}
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dy="0.35em"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 overflow-x-auto">
          <table className="border-collapse border border-gray-400 w-full text-center">
            <thead>
              <tr>
                <th className="border p-2">Node</th>
                {nodes.map((node) => (
                  <th key={node.id} className="border p-2">{node.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Distance</td>
                {distances.map((val, i) => (
                  <td key={i} className="border p-2">{val === Infinity ? '∞' : val}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BellmanFordVisualizer;
