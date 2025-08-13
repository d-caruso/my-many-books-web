import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Layout/Header';
import { InstallPrompt, UpdatePrompt, OfflineIndicator } from './components/PWA';
import { ScannerModal } from './components/Scanner';
import { ScanResult } from './types';

function App() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ScanResult | null>(null);

  const handleScanSuccess = (result: ScanResult) => {
    setLastScanResult(result);
    console.log('Scanned ISBN:', result.isbn);
    // TODO: Integrate with book search/add functionality
  };

  const handleScanError = (error: string) => {
    console.error('Scan error:', error);
    // TODO: Show error notification
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <OfflineIndicator />
        <UpdatePrompt />
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Welcome to My Many Books
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Your personal book library management system
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-surface p-6 rounded-lg shadow-sm border border-secondary-200">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Book Management
                </h3>
                <p className="text-text-secondary">
                  Add, edit, and organize your personal book collection
                </p>
              </div>
              
              <div 
                className="bg-surface p-6 rounded-lg shadow-sm border border-secondary-200 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setIsScannerOpen(true)}
              >
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  ISBN Scanner
                </h3>
                <p className="text-text-secondary">
                  Quickly add books by scanning their ISBN barcode
                </p>
                <div className="mt-4 text-primary-500 text-sm font-medium">
                  Click to scan →
                </div>
              </div>
              
              <div className="bg-surface p-6 rounded-lg shadow-sm border border-secondary-200">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Search & Filter
                </h3>
                <p className="text-text-secondary">
                  Find books quickly with powerful search and filtering
                </p>
              </div>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => setIsScannerOpen(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Scan Your First Book
              </button>
            </div>

            {/* Show last scan result */}
            {lastScanResult && (
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
                <h4 className="font-medium text-green-800 mb-2">Last Scanned ISBN:</h4>
                <p className="text-green-700 font-mono">{lastScanResult.isbn}</p>
                <p className="text-sm text-green-600 mt-1">
                  Ready to add to your library!
                </p>
              </div>
            )}
          </div>
        </main>
        
        <InstallPrompt />
        
        {/* Scanner Modal */}
        <ScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
