import React from 'react';
import { Book } from '../../types';
import { BookCard } from './BookCard';

interface BookListProps {
  books: Book[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onEdit?: (book: Book) => void;
  onDelete?: (bookId: number) => void;
  onStatusChange?: (bookId: number, status: Book['status']) => void;
  onBookClick?: (book: Book) => void;
  viewMode?: 'grid' | 'list';
  showActions?: boolean;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  loading = false,
  error = null,
  emptyMessage = 'No books found',
  onEdit,
  onDelete,
  onStatusChange,
  onBookClick,
  viewMode = 'grid',
  showActions = true
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-1">Error Loading Books</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-text-muted mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">{emptyMessage}</h3>
        <p className="text-text-secondary">Start building your library by adding your first book</p>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onClick={onBookClick}
            showActions={showActions}
            compact={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-4 sm:gap-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onClick={onBookClick}
          showActions={showActions}
          compact={false}
        />
      ))}
    </div>
  );
};