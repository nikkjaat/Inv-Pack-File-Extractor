import React from 'react';
import { Header } from './components/Header';
import { Instructions } from './components/Instructions';
import { ModeSelector } from './components/ModeSelector';
import { DataAnalyzer } from './components/DataAnalyzer';
import { DescriptionOnlyAnalyzer } from './components/DescriptionOnlyAnalyzer';

function App() {
  const [selectedMode, setSelectedMode] = React.useState<'full' | 'description'>('full');

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ModeSelector 
            selectedMode={selectedMode} 
            onModeChange={setSelectedMode} 
          />
          <Instructions />
          {selectedMode === 'full' ? (
            <DataAnalyzer />
          ) : (
            <DescriptionOnlyAnalyzer />
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            Excel Data Analyzer - Professional data processing for import/export operations
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;