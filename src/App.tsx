import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Layout/Header';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
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
              
              <div className="bg-surface p-6 rounded-lg shadow-sm border border-secondary-200">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  ISBN Scanner
                </h3>
                <p className="text-text-secondary">
                  Quickly add books by scanning their ISBN barcode
                </p>
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
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
