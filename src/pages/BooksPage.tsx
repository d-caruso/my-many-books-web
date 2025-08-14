import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Book } from '../types';
import { BookList, BookForm, BookDetails, type BookFormData } from '../components/Book';
import { BookSearchForm } from '../components/Search';
import { useBookSearch } from '../hooks/useBookSearch';
import { bookAPI } from '../services/api';

type ViewMode = 'list' | 'grid';
type PageMode = 'list' | 'add' | 'edit' | 'details';

export const BooksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [pageMode, setPageMode] = useState<PageMode>('list');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    books,
    loading: searchLoading,
    error: searchError,
    totalCount,
    hasMore,
    searchBooks,
    loadMore,
    clearSearch
  } = useBookSearch();

  // Initialize with user's books or search params
  useEffect(() => {
    const query = searchParams.get('q');
    const categoryId = searchParams.get('categoryId');
    const sortBy = searchParams.get('sortBy');

    if (query || categoryId || sortBy) {
      const filters: any = {};
      if (categoryId) filters.categoryId = parseInt(categoryId);
      if (sortBy) filters.sortBy = sortBy;
      searchBooks(query || '', filters);
    } else {
      // Load user's books by default
      loadUserBooks();
    }
  }, [searchParams]);

  const loadUserBooks = async () => {
    try {
      const response = await bookAPI.getBooks();
      // This would need to be adapted based on your API structure
      // For now, we'll use the search with empty query to get all books
      searchBooks('', {});
    } catch (err: any) {
      console.error('Failed to load user books:', err);
      setError('Failed to load your books');
    }
  };

  const handleSearch = (query: string, filters: any) => {
    // Update URL params
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        params.set(key, value.toString());
      }
    });

    setSearchParams(params);
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setPageMode('add');
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setPageMode('edit');
  };

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setPageMode('details');
  };

  const handleDeleteBook = async (bookId: number) => {
    setLoading(true);
    setError(null);

    try {
      await bookAPI.deleteBook(bookId);
      
      // Refresh the book list
      const query = searchParams.get('q');
      const categoryId = searchParams.get('categoryId');
      const sortBy = searchParams.get('sortBy');
      
      if (query || categoryId || sortBy) {
        const filters: any = {};
        if (categoryId) filters.categoryId = parseInt(categoryId);
        if (sortBy) filters.sortBy = sortBy;
        await searchBooks(query || '', filters);
      } else {
        await loadUserBooks();
      }

      // Close details if we were viewing the deleted book
      if (selectedBook?.id === bookId) {
        setPageMode('list');
        setSelectedBook(null);
      }
    } catch (err: any) {
      console.error('Failed to delete book:', err);
      setError(err.response?.data?.message || 'Failed to delete book');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookId: number, status: Book['status']) => {
    setLoading(true);
    setError(null);

    try {
      await bookAPI.updateBook(bookId, { status });
      
      // Refresh the book list
      const query = searchParams.get('q');
      const categoryId = searchParams.get('categoryId');
      const sortBy = searchParams.get('sortBy');
      
      if (query || categoryId || sortBy) {
        const filters: any = {};
        if (categoryId) filters.categoryId = parseInt(categoryId);
        if (sortBy) filters.sortBy = sortBy;
        await searchBooks(query || '', filters);
      } else {
        await loadUserBooks();
      }

      // Update selected book if it's currently being viewed
      if (selectedBook?.id === bookId) {
        setSelectedBook(prev => prev ? { ...prev, status } : null);
      }
    } catch (err: any) {
      console.error('Failed to update book status:', err);
      setError(err.response?.data?.message || 'Failed to update book status');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData: BookFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (selectedBook) {
        await bookAPI.updateBook(selectedBook.id, formData);
      } else {
        await bookAPI.createBook(formData);
      }

      // Refresh the book list
      const query = searchParams.get('q');
      const categoryId = searchParams.get('categoryId');
      const sortBy = searchParams.get('sortBy');
      
      if (query || categoryId || sortBy) {
        const filters: any = {};
        if (categoryId) filters.categoryId = parseInt(categoryId);
        if (sortBy) filters.sortBy = sortBy;
        await searchBooks(query || '', filters);
      } else {
        await loadUserBooks();
      }

      setPageMode('list');
      setSelectedBook(null);
    } catch (err: any) {
      console.error('Failed to save book:', err);
      setError(err.response?.data?.message || 'Failed to save book');
      throw err; // Re-throw to keep form open
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setPageMode('list');
    setSelectedBook(null);
  };

  // Render different modes
  if (pageMode === 'add' || pageMode === 'edit') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookForm
          book={selectedBook}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    );
  }

  if (pageMode === 'details' && selectedBook) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookDetails
          book={selectedBook}
          onEdit={handleEditBook}
          onDelete={handleDeleteBook}
          onStatusChange={handleStatusChange}
          onClose={() => setPageMode('list')}
          loading={loading}
        />
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // List mode (default)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">My Books</h1>
          <p className="text-lg text-text-secondary">
            {totalCount > 0 ? `${totalCount} book${totalCount !== 1 ? 's' : ''} in your library` : 'Your personal book collection'}
          </p>
        </div>
        
        <button
          onClick={handleAddBook}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 sm:px-6 rounded-lg font-medium transition-colors flex items-center space-x-2 text-sm sm:text-base min-h-[44px] touch-manipulation"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="hidden xs:inline">Add Book</span>
          <span className="xs:hidden">Add</span>
        </button>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <BookSearchForm
          onSearch={handleSearch}
          loading={searchLoading}
          initialQuery={searchParams.get('q') || ''}
        />
      </div>

      {/* View controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {searchParams.get('q') && (
            <button
              onClick={() => {
                setSearchParams({});
                clearSearch();
                loadUserBooks();
              }}
              className="text-text-muted hover:text-text-secondary text-sm flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Clear search</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-text-muted hover:text-text-secondary'}`}
            title="Grid view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-text-muted hover:text-text-secondary'}`}
            title="List view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Books list */}
      <BookList
        books={books}
        loading={searchLoading}
        error={searchError || error}
        viewMode={viewMode}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
        onStatusChange={handleStatusChange}
        onBookClick={handleViewDetails}
        emptyMessage={searchParams.get('q') ? 'No books found matching your search' : 'No books in your library yet'}
      />

      {/* Load more */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={searchLoading}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-secondary-300 disabled:cursor-not-allowed transition-colors"
          >
            {searchLoading ? 'Loading...' : 'Load More Books'}
          </button>
        </div>
      )}
    </div>
  );
};