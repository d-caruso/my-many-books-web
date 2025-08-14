import React, { useState, useEffect } from 'react';
import { SearchFilters } from '../../types';
import { useCategories } from '../../hooks/useCategories';

interface BookSearchFormProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  loading?: boolean;
  initialQuery?: string;
}

export const BookSearchForm: React.FC<BookSearchFormProps> = ({
  onSearch,
  loading = false,
  initialQuery = ''
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, filters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
  };

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-secondary-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main search input */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search books
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, ISBN..."
                className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background text-text-primary"
                disabled={loading}
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-secondary-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Advanced filters toggle */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center space-x-1"
          >
            <span>Advanced Filters</span>
            <svg 
              className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {(Object.keys(filters).length > 0 || query) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-text-muted hover:text-text-secondary text-sm"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-secondary-200">
            {/* Category filter */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-text-secondary mb-1">
                Category
              </label>
              <select
                id="categoryId"
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value ? parseInt(e.target.value) : undefined)}
                disabled={categoriesLoading}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {categoriesLoading ? 'Loading categories...' : 'All Categories'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoriesError && (
                <p className="mt-1 text-sm text-semantic-error">{categoriesError}</p>
              )}
            </div>

            {/* Book status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-text-secondary mb-1">
                Reading Status
              </label>
              <select
                id="status"
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-text-primary"
              >
                <option value="">Any Status</option>
                <option value="in progress">In Progress</option>
                <option value="paused">Paused</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            {/* Sort by */}
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-text-secondary mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                value={filters.sortBy || 'relevance'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-background text-text-primary"
              >
                <option value="relevance">Relevance</option>
                <option value="title">Title (A-Z)</option>
                <option value="author">Author (A-Z)</option>
                <option value="date-added">Recently Added</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};