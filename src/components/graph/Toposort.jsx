import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, GitBranch } from 'lucide-react';

const TopologicalSortVisualizer = ({ onBack }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState(new Set());
  const [stack, setStack] = useState([]);
  const [currentNode, setCurrentNode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    generateGraph();
  }, []);

  const generateGraph = () => {
    const nodeCount = 6;
    const newNodes = [];
    const newEdges = [
      { from: 5, to: 2 },
      { from: 5, to: 0 },
      { from: 4, to: 0 },
      { from: 4, to: 1 },
      { from: 2, to: 3 },
      { from: 3, to: 1 },
    ];

    // Create nodes in circular layout
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i * 2 * Math.PI) / nodeCount;
      const x = 200 + 150 * Math.cos(angle);
      const y = 200 + 150 * Math.sin(angle);
      newNodes.push({ id: i, x, y, label: i.toString() });
    }

    setNodes(newNodes);
    setEdges(newEdges);
    resetVisualization();
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const dfsTopo = async (nodeId, visited, tempStack, adjList) => {
    visited.add(nodeId);
    setVisitedNodes(new Set(visited));
    setCurrentNode(nodeId);
    await delay(speed);

    for (let neighbor of adjList[nodeId] || []) {
      if (!visited.has(neighbor)) {
        await dfsTopo(neighbor, visited, tempStack, adjList);
      }
    }

    tempStack.push(nodeId);
    setStack([...tempStack]);
    setCurrentNode(null);
    await delay(speed);
  };

  const startVisualization = async () => {
    setIsRunning(true);
    setIsPaused(false);
    resetVisualization();

    const adjList = {};
    edges.forEach(edge => {
      if (!adjList[edge.from]) adjList[edge.from] = [];
      adjList[edge.from].push(edge.to);
    });

    const visited = new Set();
    const tempStack = [];
    for (let node of nodes) {
      if (!visited.has(node.id)) {
        await dfsTopo(node.id, visited, tempStack, adjList);
      }
    }

    setOrder(tempStack.reverse());
    setIsRunning(false);
  };

  const pauseVisualization = () => {
    setIsPaused(!isPaused);
  };

  const resetVisualization = () => {
    setIsRunning(false);
    setIsPaused(false);
    setVisitedNodes(new Set());
    setStack([]);
    setCurrentNode(null);
    setOrder([]);
  };

  const getNodeColor = (nodeId) => {
    if (currentNode === nodeId) return '#ef4444'; // red
    if (visitedNodes.has(nodeId)) return '#10b981'; // green
    return '#6b7280'; // gray
  };

  const getEdgeColor = (edge) => {
    if (visitedNodes.has(edge.from) && visitedNodes.has(edge.to)) return '#10b981';
    return '#d1d5db';
  };

  // Arrowhead marker for directed edges
  const renderArrow = (fromNode, toNode, key) => {
    const dx = toNode.x - fromNode.x;
    const dy = toNode.y - fromNode.y;
    const angle = Math.atan2(dy, dx);
    const offset = 20; // radius of circle
    const x1 = fromNode.x + offset * Math.cos(angle);
    const y1 = fromNode.y + offset * Math.sin(angle);
    const x2 = toNode.x - offset * Math.cos(angle);
    const y2 = toNode.y - offset * Math.sin(angle);

    return (
      <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} stroke={getEdgeColor({from: fromNode.id, to: toNode.id})} strokeWidth="2" markerEnd="url(#arrow)" />
    );
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
            <h1 className="text-4xl font-bold text-gray-900">Topological Sort</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Topological ordering of a Directed Acyclic Graph (DAG)
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

          {stack.length > 0 && (
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">Current Stack: [{stack.join(', ')}]</p>
            </div>
          )}

          {order.length > 0 && (
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">Topological Order: [{order.join(', ')}]</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
          <svg width="400" height="400" className="border rounded-lg">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <polygon points="0 0, 10 5, 0 10" fill="#374151" />
              </marker>
            </defs>

            {edges.map((edge, idx) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              return renderArrow(fromNode, toNode, idx);
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
    </div>
  );
};

export default TopologicalSortVisualizer;
