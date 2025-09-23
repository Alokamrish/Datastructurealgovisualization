import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, GitBranch } from 'lucide-react';

const FloydVisualizer = ({ onBack }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [distances, setDistances] = useState([]);
  const [kIndex, setKIndex] = useState(0);
  const [iIndex, setIIndex] = useState(0);
  const [jIndex, setJIndex] = useState(0);
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
  }, [isRunning, isPaused, iIndex, jIndex, kIndex]);

  const generateGraph = () => {
    const nodeCount = 5; // 5 nodes
    const newNodes = [];
    const newEdges = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount;
      const x = 200 + 150 * Math.cos(angle);
      const y = 200 + 150 * Math.sin(angle);
      newNodes.push({ id: i, x, y, label: i.toString() });
    }

    const connectionWeights = [
      [0, 3, Infinity, 7, Infinity],
      [8, 0, 2, Infinity, Infinity],
      [5, Infinity, 0, 1, Infinity],
      [2, Infinity, Infinity, 0, 3],
      [Infinity, Infinity, Infinity, Infinity, 0],
    ];

    for (let from = 0; from < nodeCount; from++) {
      for (let to = 0; to < nodeCount; to++) {
        if (from !== to && connectionWeights[from][to] !== Infinity) {
          newEdges.push({ from, to, weight: connectionWeights[from][to] });
        }
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setDistances(connectionWeights.map(row => [...row]));
    resetVisualization();
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const step = async () => {
    const n = nodes.length;
    if (kIndex >= n) {
      setIsRunning(false);
      return;
    }

    let newDistances = distances.map(row => [...row]);
    if (iIndex < n && jIndex < n) {
      newDistances[iIndex][jIndex] = Math.min(
        newDistances[iIndex][jIndex],
        newDistances[iIndex][kIndex] + newDistances[kIndex][jIndex]
      );
      setDistances(newDistances);

      if (jIndex + 1 < n) {
        setJIndex(jIndex + 1);
      } else {
        setJIndex(0);
        if (iIndex + 1 < n) {
          setIIndex(iIndex + 1);
        } else {
          setIIndex(0);
          setKIndex(kIndex + 1);
        }
      }
    }
  };

  const startVisualization = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseVisualization = () => {
    setIsPaused(!isPaused);
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setKIndex(0);
    setIIndex(0);
    setJIndex(0);
  };

  const getNodeColor = (nodeId) => {
    if (nodeId === iIndex || nodeId === jIndex || nodeId === kIndex) return '#ef4444';
    return '#6b7280';
  };

  const getEdgeColor = (edge) => {
    const fromDist = distances[edge.from][edge.to];
    if (fromDist < Infinity) return '#10b981';
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
            <h1 className="text-4xl font-bold text-gray-900">Floyd-Warshall Algorithm</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find shortest paths between all pairs of nodes using dynamic programming
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

          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              k = {kIndex}, i = {iIndex}, j = {jIndex}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <svg width="400" height="400" className="border rounded-lg">
              {edges.map((edge, idx) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                return (
                  <line
                    key={idx}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={getEdgeColor(edge)}
                    strokeWidth="2"
                  />
                );
              })}

              {nodes.map(node => (
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
                <th className="border p-2">From\To</th>
                {nodes.map(node => (
                  <th key={node.id} className="border p-2">{node.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {distances.map((row, i) => (
                <tr key={i}>
                  <td className="border p-2">{i}</td>
                  {row.map((val, j) => (
                    <td key={j} className="border p-2">
                      {val === Infinity ? '∞' : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FloydVisualizer;
