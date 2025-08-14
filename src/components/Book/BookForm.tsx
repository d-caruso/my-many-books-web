import React, { useState, useEffect } from 'react';
import { Book, Author, Category } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { AuthorAutocomplete } from '../Search/AuthorAutocomplete';

interface BookFormProps {
  book?: Book | null;
  onSubmit: (bookData: BookFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  title?: string;
}

export interface BookFormData {
  title: string;
  isbnCode: string;
  editionNumber?: number;
  editionDate?: string;
  status?: Book['status'];
  notes?: string;
  selectedAuthors: Author[];
  selectedCategories: number[];
}

export const BookForm: React.FC<BookFormProps> = ({
  book,
  onSubmit,
  onCancel,
  loading = false,
  title = book ? 'Edit Book' : 'Add New Book'
}) => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    isbnCode: '',
    editionNumber: undefined,
    editionDate: '',
    status: undefined,
    notes: '',
    selectedAuthors: [],
    selectedCategories: []
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BookFormData, string>>>({});

  // Initialize form with book data
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        isbnCode: book.isbnCode,
        editionNumber: book.editionNumber,
        editionDate: book.editionDate ? book.editionDate.split('T')[0] : '',
        status: book.status,
        notes: book.notes || '',
        selectedAuthors: book.authors || [],
        selectedCategories: book.categories?.map(cat => cat.id) || []
      });
    }
  }, [book]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.isbnCode.trim()) {
      newErrors.isbnCode = 'ISBN is required';
    } else if (!/^[\d\-X]{10,17}$/.test(formData.isbnCode.replace(/\s/g, ''))) {
      newErrors.isbnCode = 'Invalid ISBN format';
    }

    if (formData.editionNumber !== undefined && formData.editionNumber < 1) {
      newErrors.editionNumber = 'Edition number must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: keyof BookFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAuthorAdd = (author: Author | null) => {
    if (author && !formData.selectedAuthors.find(a => a.id === author.id)) {
      handleInputChange('selectedAuthors', [...formData.selectedAuthors, author]);
    }
  };

  const handleAuthorRemove = (authorId: number) => {
    handleInputChange('selectedAuthors', 
      formData.selectedAuthors.filter(a => a.id !== authorId)
    );
  };

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      handleInputChange('selectedCategories', [...formData.selectedCategories, categoryId]);
    } else {
      handleInputChange('selectedCategories', 
        formData.selectedCategories.filter(id => id !== categoryId)
      );
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-lg border border-secondary-200 overflow-hidden">
      <div className="px-6 py-4 bg-primary-50 border-b border-secondary-200">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">
            Title <span className="text-semantic-error">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.title
                ? 'border-semantic-error bg-red-50'
                : 'border-secondary-300 bg-background'
            } text-text-primary`}
            placeholder="Enter book title"
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-semantic-error">{errors.title}</p>
          )}
        </div>

        {/* ISBN */}
        <div>
          <label htmlFor="isbnCode" className="block text-sm font-medium text-text-secondary mb-1">
            ISBN <span className="text-semantic-error">*</span>
          </label>
          <input
            type="text"
            id="isbnCode"
            value={formData.isbnCode}
            onChange={(e) => handleInputChange('isbnCode', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono ${
              errors.isbnCode
                ? 'border-semantic-error bg-red-50'
                : 'border-secondary-300 bg-background'
            } text-text-primary`}
            placeholder="e.g., 978-0-123-45678-9"
            disabled={loading}
          />
          {errors.isbnCode && (
            <p className="mt-1 text-sm text-semantic-error">{errors.isbnCode}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Edition Number */}
          <div>
            <label htmlFor="editionNumber" className="block text-sm font-medium text-text-secondary mb-1">
              Edition Number
            </label>
            <input
              type="number"
              id="editionNumber"
              value={formData.editionNumber || ''}
              onChange={(e) => handleInputChange('editionNumber', 
                e.target.value ? parseInt(e.target.value) : undefined
              )}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.editionNumber
                  ? 'border-semantic-error bg-red-50'
                  : 'border-secondary-300 bg-background'
              } text-text-primary`}
              placeholder="e.g., 1"
              min="1"
              disabled={loading}
            />
            {errors.editionNumber && (
              <p className="mt-1 text-sm text-semantic-error">{errors.editionNumber}</p>
            )}
          </div>

          {/* Edition Date */}
          <div>
            <label htmlFor="editionDate" className="block text-sm font-medium text-text-secondary mb-1">
              Edition Date
            </label>
            <input
              type="date"
              id="editionDate"
              value={formData.editionDate}
              onChange={(e) => handleInputChange('editionDate', e.target.value)}
              className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-text-primary"
              disabled={loading}
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1">
            Reading Status
          </label>
          <select
            id="status"
            value={formData.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value as Book['status'] || undefined)}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-text-primary"
            disabled={loading}
          >
            <option value="">No Status</option>
            <option value="in progress">In Progress</option>
            <option value="paused">Paused</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        {/* Authors */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Authors
          </label>
          
          <div className="mb-3">
            <AuthorAutocomplete
              value={null}
              onChange={handleAuthorAdd}
              placeholder="Search and add authors..."
              disabled={loading}
            />
          </div>

          {formData.selectedAuthors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.selectedAuthors.map((author) => (
                <span
                  key={author.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
                >
                  {author.name} {author.surname}
                  <button
                    type="button"
                    onClick={() => handleAuthorRemove(author.id)}
                    className="ml-2 text-primary-500 hover:text-primary-700"
                    disabled={loading}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Categories
          </label>
          
          {categoriesLoading ? (
            <div className="text-text-muted">Loading categories...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-secondary-200 rounded-lg p-3">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.selectedCategories.includes(category.id)}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                    className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    disabled={loading}
                  />
                  <span className="text-text-primary">{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-text-secondary mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-text-primary resize-vertical"
            placeholder="Add any notes about this book..."
            disabled={loading}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-secondary-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-secondary-300 text-text-secondary rounded-lg hover:bg-secondary-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-secondary-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{book ? 'Update Book' : 'Add Book'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};