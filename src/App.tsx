import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navigation';
import { InstallPrompt, UpdatePrompt, OfflineIndicator } from './components/PWA';
import { AuthPage } from './pages/AuthPage';
import { BooksPage } from './pages/BooksPage';
import { BookSearchPage } from './components/Search/BookSearchPage';
import { ScannerModal } from './components/Scanner';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <OfflineIndicator />
            <UpdatePrompt />
            
            <Routes>
              {/* Public route */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                      <Routes>
                        <Route path="/" element={<BooksPage />} />
                        <Route path="/search" element={<BookSearchPage />} />
                        <Route path="/scanner" element={<ScannerModal isOpen={true} onClose={() => window.history.back()} onScanSuccess={() => {}} onScanError={() => {}} />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                  </ProtectedRoute>
                }
              />
            </Routes>
            
            <InstallPrompt />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;