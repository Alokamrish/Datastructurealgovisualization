import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, GitBranch } from 'lucide-react';

const BFSVisualizer = ({ onBack }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [currentNode, setCurrentNode] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [startNode, setStartNode] = useState(0);

  useEffect(() => {
    generateGraph();
  }, []);

  const generateGraph = () => {
    const nodeCount = 8;
    const newNodes = [];
    const newEdges = [];

    // Create nodes in a circular layout
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount;
      const x = 200 + 150 * Math.cos(angle);
      const y = 200 + 150 * Math.sin(angle);
      newNodes.push({ id: i, x, y, label: i.toString() });
    }

    // Create edges (connected graph)
    const connections = [
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7], [6, 0], [7, 1]
    ];

    connections.forEach(([from, to]) => {
      newEdges.push({ from, to });
    });

    setNodes(newNodes);
    setEdges(newEdges);
    resetVisualization();
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const bfs = async (startNodeId) => {
    const visited = new Set();
    const queue = [startNodeId];
    const path = [];

    setQueue([startNodeId]);

    while (queue.length > 0 && !isPaused) {
      const currentNodeId = queue.shift();
      setQueue([...queue]);

      if (!visited.has(currentNodeId)) {
        visited.add(currentNodeId);
        path.push(currentNodeId);
        
        setVisitedNodes(new Set(visited));
        setCurrentNode(currentNodeId);
        
        await delay(speed);

        // Add unvisited neighbors to queue
        const neighbors = edges
          .filter(edge => edge.from === currentNodeId || edge.to === currentNodeId)
          .map(edge => edge.from === currentNodeId ? edge.to : edge.from)
          .filter(neighbor => !visited.has(neighbor) && !queue.includes(neighbor));

        queue.push(...neighbors);
        setQueue([...queue]);
      }
    }

    setCurrentNode(null);
    return path;
  };

  const startVisualization = async () => {
    setIsRunning(true);
    setIsPaused(false);
    resetVisualization();
    
    try {
      await bfs(startNode);
    } catch (error) {
      console.error('Error in BFS:', error);
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
    setVisitedNodes(new Set());
    setCurrentNode(null);
    setQueue([]);
  };

  const getNodeColor = (nodeId) => {
    if (currentNode === nodeId) return '#ef4444'; // red
    if (visitedNodes.has(nodeId)) return '#10b981'; // green
    if (queue.includes(nodeId)) return '#f59e0b'; // yellow
    return '#6b7280'; // gray
  };

  const getEdgeColor = (edge) => {
    if (visitedNodes.has(edge.from) && visitedNodes.has(edge.to)) {
      return '#10b981'; // green
    }
    return '#d1d5db'; // light gray
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
            Back to Graph Algorithms
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GitBranch className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Breadth-First Search (BFS)</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore graph level by level using a queue data structure
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Node
              </label>
              <select
                value={startNode}
                onChange={(e) => setStartNode(parseInt(e.target.value))}
                disabled={isRunning}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {nodes.map(node => (
                  <option key={node.id} value={node.id}>Node {node.id}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed (ms)
              </label>
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

            <div className="flex items-end">
              <button
                onClick={startVisualization}
                disabled={isRunning && !isPaused}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Start BFS
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
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
                <span>Unvisited</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                <span>In Queue</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                <span>Visited</span>
              </div>
            </div>
          </div>

          {queue.length > 0 && (
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Queue: [{queue.join(', ')}]
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="flex justify-center">
            <svg width="400" height="400" className="border rounded-lg">
              {/* Render edges */}
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
                    stroke={getEdgeColor(edge)}
                    strokeWidth="2"
                  />
                );
              })}
              
              {/* Render nodes */}
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
      </div>
    </div>
  );
};

export default BFSVisualizer;