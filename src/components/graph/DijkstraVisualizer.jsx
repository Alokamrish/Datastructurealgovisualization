import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, GitBranch } from 'lucide-react';

const DijkstraVisualizer = ({ onBack }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [distances, setDistances] = useState({});
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [currentNode, setCurrentNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [startNode, setStartNode] = useState(0);

  useEffect(() => {
    generateGraph();
  }, []);

  const generateGraph = () => {
    const nodeCount = 6;
    const newNodes = [];
    const newEdges = [];

    // Create nodes in a circular layout
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount;
      const x = 200 + 120 * Math.cos(angle);
      const y = 200 + 120 * Math.sin(angle);
      newNodes.push({ id: i, x, y, label: i.toString() });
    }

    // Create weighted edges
    const connections = [
      [0, 1, 4], [0, 2, 2], [1, 2, 1], [1, 3, 5], 
      [2, 3, 8], [2, 4, 10], [3, 4, 2], [3, 5, 6], [4, 5, 3]
    ];

    connections.forEach(([from, to, weight]) => {
      newEdges.push({ from, to, weight });
    });

    setNodes(newNodes);
    setEdges(newEdges);
    resetVisualization();
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const dijkstra = async (startNodeId) => {
    const dist = {};
    const visited = new Set();
    const previous = {};

    // Initialize distances
    nodes.forEach(node => {
      dist[node.id] = node.id === startNodeId ? 0 : Infinity;
    });

    setDistances({ ...dist });

    while (visited.size < nodes.length && !isPaused) {
      // Find unvisited node with minimum distance
      let minNode = null;
      let minDistance = Infinity;

      for (let nodeId of Object.keys(dist)) {
        const id = parseInt(nodeId);
        if (!visited.has(id) && dist[id] < minDistance) {
          minDistance = dist[id];
          minNode = id;
        }
      }

      if (minNode === null) break;

      visited.add(minNode);
      setVisitedNodes(new Set(visited));
      setCurrentNode(minNode);

      await delay(speed);

      // Update distances to neighbors
      const neighbors = edges.filter(edge => 
        edge.from === minNode || edge.to === minNode
      );

      for (let edge of neighbors) {
        const neighbor = edge.from === minNode ? edge.to : edge.from;
        
        if (!visited.has(neighbor)) {
          const newDistance = dist[minNode] + edge.weight;
          
          if (newDistance < dist[neighbor]) {
            dist[neighbor] = newDistance;
            previous[neighbor] = minNode;
            setDistances({ ...dist });
            await delay(speed / 2);
          }
        }
      }
    }

    setCurrentNode(null);
  };

  const startVisualization = async () => {
    setIsRunning(true);
    setIsPaused(false);
    resetVisualization();
    
    try {
      await dijkstra(startNode);
    } catch (error) {
      console.error('Error in Dijkstra:', error);
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
    setDistances({});
  };

  const getNodeColor = (nodeId) => {
    if (currentNode === nodeId) return '#ef4444'; // red
    if (visitedNodes.has(nodeId)) return '#10b981'; // green
    if (nodeId === startNode) return '#3b82f6'; // blue
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
            <GitBranch className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Dijkstra's Algorithm</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find shortest path from source to all vertices in a weighted graph
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <span>Start</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
                <span>Unvisited</span>
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
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Graph Visualization</h3>
            <div className="flex justify-center">
              <svg width="400" height="400" className="border rounded-lg">
                {/* Render edges */}
                {edges.map((edge, index) => {
                  const fromNode = nodes.find(n => n.id === edge.from);
                  const toNode = nodes.find(n => n.id === edge.to);
                  const midX = (fromNode.x + toNode.x) / 2;
                  const midY = (fromNode.y + toNode.y) / 2;
                  
                  return (
                    <g key={index}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={getEdgeColor(edge)}
                        strokeWidth="2"
                      />
                      <circle
                        cx={midX}
                        cy={midY}
                        r="12"
                        fill="white"
                        stroke="#374151"
                        strokeWidth="1"
                      />
                      <text
                        x={midX}
                        y={midY}
                        textAnchor="middle"
                        dy="0.35em"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}
                
                {/* Render nodes */}
                {nodes.map(node => (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="25"
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

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Shortest Distances</h3>
            <div className="space-y-3">
              {nodes.map(node => (
                <div key={node.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Node {node.id}:</span>
                  <span className={`font-bold ${
                    distances[node.id] === Infinity ? 'text-gray-400' : 'text-purple-600'
                  }`}>
                    {distances[node.id] === Infinity ? '∞' : distances[node.id] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DijkstraVisualizer;