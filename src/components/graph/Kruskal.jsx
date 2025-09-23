import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, GitBranch } from 'lucide-react';

const KruskalVisualizer = ({ onBack }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mstEdges, setMstEdges] = useState([]);
  const [currentEdgeIndex, setCurrentEdgeIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    generateGraph();
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && !isPaused) {
      timer = setTimeout(step, speed);
    }
    return () => clearTimeout(timer);
  }, [isRunning, isPaused, currentEdgeIndex]);

  const generateGraph = () => {
    const nodeCount = 6;
    const newNodes = [];
    const newEdges = [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 4 },
      { from: 1, to: 2, weight: 2 },
      { from: 1, to: 0, weight: 4 },
      { from: 2, to: 3, weight: 3 },
      { from: 2, to: 5, weight: 2 },
      { from: 2, to: 4, weight: 4 },
      { from: 3, to: 2, weight: 3 },
      { from: 4, to: 2, weight: 4 },
      { from: 4, to: 5, weight: 3 },
      { from: 5, to: 2, weight: 2 },
      { from: 5, to: 4, weight: 3 },
    ];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount;
      const x = 200 + 150 * Math.cos(angle);
      const y = 200 + 150 * Math.sin(angle);
      newNodes.push({ id: i, x, y, label: i.toString() });
    }

    setNodes(newNodes);
    setEdges(newEdges.sort((a, b) => a.weight - b.weight)); // sort edges by weight
    setMstEdges([]);
    setCurrentEdgeIndex(0);
  };

  const findParent = (parent, i) => {
    if (parent[i] === i) return i;
    parent[i] = findParent(parent, parent[i]);
    return parent[i];
  };

  const union = (parent, rank, x, y) => {
    const xRoot = findParent(parent, x);
    const yRoot = findParent(parent, y);
    if (rank[xRoot] < rank[yRoot]) {
      parent[xRoot] = yRoot;
    } else if (rank[xRoot] > rank[yRoot]) {
      parent[yRoot] = xRoot;
    } else {
      parent[yRoot] = xRoot;
      rank[xRoot]++;
    }
  };

  const step = () => {
    if (currentEdgeIndex >= edges.length) {
      setIsRunning(false);
      return;
    }

    const edge = edges[currentEdgeIndex];
    const parent = [];
    const rank = [];
    for (let i = 0; i < nodes.length; i++) {
      parent[i] = i;
      rank[i] = 0;
    }

    // Rebuild MST edges up to current step
    mstEdges.forEach(e => union(parent, rank, e.from, e.to));

    const x = findParent(parent, edge.from);
    const y = findParent(parent, edge.to);

    if (x !== y) {
      setMstEdges([...mstEdges, edge]);
    }

    setCurrentEdgeIndex(currentEdgeIndex + 1);
  };

  const startVisualization = () => {
    setMstEdges([]);
    setCurrentEdgeIndex(0);
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseVisualization = () => {
    setIsPaused(!isPaused);
  };

  const resetVisualization = () => {
    setMstEdges([]);
    setCurrentEdgeIndex(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  const getEdgeColor = (edge, index) => {
    if (mstEdges.includes(edge)) return '#10b981'; // green for MST
    if (index === currentEdgeIndex) return '#ef4444'; // red for current
    return '#d1d5db'; // gray
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
            <h1 className="text-4xl font-bold text-gray-900">Kruskal's MST</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Minimum Spanning Tree using Kruskal's Algorithm
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 mb-6">
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
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <svg width="400" height="400" className="border rounded-lg">
            {edges.map((edge, index) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              return (
                <line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={getEdgeColor(edge, index)}
                  strokeWidth="3"
                />
              );
            })}

            {nodes.map(node => (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r="20" fill="#6b7280" stroke="#374151" strokeWidth="2" />
                <text x={node.x} y={node.y} textAnchor="middle" dy="0.35em" fill="white" fontSize="14" fontWeight="bold">
                  {node.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            MST Edges: {mstEdges.map(e => `(${e.from}-${e.to}, w=${e.weight})`).join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KruskalVisualizer;
