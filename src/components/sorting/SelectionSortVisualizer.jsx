import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, BarChart3 } from 'lucide-react';

const SelectionSortVisualizer = ({ onBack }) => {
  const [array, setArray] = useState([]);
  const [arraySize, setArraySize] = useState(20);
  const [speed, setSpeed] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [minIndex, setMinIndex] = useState(null);
  const [sorted, setSorted] = useState([]);

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 300) + 10);
    setArray(newArray);
    setCurrentIndex(null);
    setMinIndex(null);
    setSorted([]);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const selectionSort = async () => {
    setIsRunning(true);
    setIsPaused(false);
    const arr = [...array];

    for (let i = 0; i < arr.length - 1 && !isPaused; i++) {
      let minIdx = i;
      setMinIndex(minIdx);

      for (let j = i + 1; j < arr.length && !isPaused; j++) {
        setCurrentIndex(j);
        await delay(speed);

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setMinIndex(minIdx);
        }
      }

      // Swap the minimum element with the first unsorted element
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        await delay(speed);
      }

      setSorted(prev => [...prev, i]);
    }

    setSorted(Array.from({ length: arr.length }, (_, i) => i));
    setCurrentIndex(null);
    setMinIndex(null);
    setIsRunning(false);
  };

  const pauseSort = () => {
    setIsPaused(!isPaused);
  };

  const resetSort = () => {
    setIsRunning(false);
    setIsPaused(false);
    generateArray();
  };

  const getBarColor = (index) => {
    if (sorted.includes(index)) return 'bg-green-500';
    if (index === minIndex) return 'bg-red-500';
    if (index === currentIndex) return 'bg-yellow-500';
    return 'bg-blue-500';
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
            Back to Sorting Algorithms
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Selection Sort Visualizer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch how Selection Sort finds the minimum element in the unsorted portion and moves it to the beginning
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Array Size
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                disabled={isRunning}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{arraySize} elements</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed (ms)
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">{speed}ms</div>
            </div>

            <div className="flex items-end">
              <button
                onClick={selectionSort}
                disabled={isRunning && !isPaused}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Sort
              </button>
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={pauseSort}
                disabled={!isRunning}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Pause className="w-4 h-4" />
              </button>
              <button
                onClick={resetSort}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span>Unsorted</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
                <span>Comparing</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span>Minimum</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Sorted</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-6xl mx-auto">
            <div className="flex items-end justify-center space-x-1 h-80" style={{ minHeight: '300px' }}>
              {array.map((value, index) => (
                <div
                  key={index}
                  className={`transition-all duration-200 ${getBarColor(index)} rounded-t`}
                  style={{
                    height: `${value}px`,
                    width: `${Math.max(800 / array.length - 2, 10)}px`,
                    maxWidth: '40px'
                  }}
                >
                  <div className="text-xs text-white text-center pt-1 font-medium">
                    {array.length <= 20 ? value : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionSortVisualizer;