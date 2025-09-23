import React, { useState } from 'react';
import { ChevronRight, PlayCircle, Brain, BarChart3, GitBranch } from 'lucide-react';
import ChessVisualizers from './components/ChessVisualizers';
import SortingVisualizers from './components/SortingVisualizers';
import GraphVisualizers from './components/GraphVisualizers';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const sections = [
    {
      id: 'chess',
      title: 'Chess Visualizers',
      description:
        'Solve N-Queen, N-Knight, N-Rook, and N-Bishop puzzles with step-by-step visualization',
      icon: Brain,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'sorting',
      title: 'Sorting Algorithms',
      description:
        'Visualize Bubble Sort, Insertion Sort, Selection Sort, and Merge Sort algorithms',
      icon: BarChart3,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'graph',
      title: 'Graph Algorithms',
      description:
        'Explore DFS, BFS, Dijkstra, Floyd-Warshall, MST algorithms, and more',
      icon: GitBranch,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Algorithm Visualizer</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Interactive visualizations for chess puzzles, sorting algorithms, and graph
            algorithms. Learn and explore computational thinking through beautiful animations.
          </p>
        </div>

        {/* Sections */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div
                    className={`h-32 bg-gradient-to-r ${section.color} p-6 flex items-center justify-center`}
                  >
                    <IconComponent className="w-12 h-12 text-white" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{section.description}</p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Explore
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Interactive Visualizations</h3>
                <p className="text-gray-600 text-sm">
                  Step-by-step animations with speed controls
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Multiple Algorithms</h3>
                <p className="text-gray-600 text-sm">
                  Chess puzzles, sorting, and graph algorithms
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GitBranch className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Educational</h3>
                <p className="text-gray-600 text-sm">
                  Learn algorithmic thinking through visualization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render selected section or home
  const renderContent = () => {
    switch (activeSection) {
      case 'chess':
        return <ChessVisualizers onBack={() => setActiveSection('home')} />;
      case 'sorting':
        return <SortingVisualizers onBack={() => setActiveSection('home')} />;
      case 'graph':
        return <GraphVisualizers onBack={() => setActiveSection('home')} />;
      default:
        return renderHome();
    }
  };

  return renderContent();
}

export default App;
