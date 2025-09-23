import React, { useState } from 'react';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import BubbleSortVisualizer from './sorting/BubbleSortVisualizer';
import InsertionSortVisualizer from './sorting/InsertionSortVisualizer';
import SelectionSortVisualizer from './sorting/SelectionSortVisualizer';
import MergeSortVisualizer from './sorting/MergeSortVisualizer';

const SortingVisualizers = ({ onBack }) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState(null);

  const algorithms = [
    {
      id: 'bubble',
      name: 'Bubble Sort',
      description: 'Compare adjacent elements and swap if they are in wrong order',
      complexity: 'O(n²)',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'insertion',
      name: 'Insertion Sort',
      description: 'Build sorted array one element at a time by inserting elements',
      complexity: 'O(n²)',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'selection',
      name: 'Selection Sort',
      description: 'Find minimum element and place it at the beginning',
      complexity: 'O(n²)',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'merge',
      name: 'Merge Sort',
      description: 'Divide array into halves and merge them in sorted order',
      complexity: 'O(n log n)',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  if (activeAlgorithm) {
    const renderVisualizer = () => {
      switch (activeAlgorithm) {
        case 'bubble':
          return <BubbleSortVisualizer onBack={() => setActiveAlgorithm(null)} />;
        case 'insertion':
          return <InsertionSortVisualizer onBack={() => setActiveAlgorithm(null)} />;
        case 'selection':
          return <SelectionSortVisualizer onBack={() => setActiveAlgorithm(null)} />;
        case 'merge':
          return <MergeSortVisualizer onBack={() => setActiveAlgorithm(null)} />;
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sorting Algorithm Visualizers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch sorting algorithms in action with animated step-by-step visualization
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {algorithms.map((algorithm) => (
            <div
              key={algorithm.id}
              onClick={() => setActiveAlgorithm(algorithm.id)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className={`h-24 bg-gradient-to-r ${algorithm.color} p-4 flex items-center justify-center`}>
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {algorithm.name}
                    </h3>
                    <span className="text-sm font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
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

export default SortingVisualizers;
