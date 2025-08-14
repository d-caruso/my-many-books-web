import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { SearchFilters, Author } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { AuthorAutocomplete } from './AuthorAutocomplete';

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
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
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

  const handleAuthorChange = (author: Author | null) => {
    setSelectedAuthor(author);
    handleFilterChange('authorId', author?.id);
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
    setSelectedAuthor(null);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        {/* Main search input */}
        <Box display="flex" gap={2} mb={2}>
          <TextField
            fullWidth
            id="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, ISBN..."
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </Box>

        {/* Advanced filters toggle */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            color="primary"
            size="small"
            endIcon={
              <ExpandMoreIcon
                sx={{
                  transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            }
          >
            Advanced Filters
          </Button>

          {(Object.keys(filters).length > 0 || query || selectedAuthor) && (
            <Button
              type="button"
              onClick={clearFilters}
              size="small"
              color="inherit"
              startIcon={<ClearIcon />}
            >
              Clear all
            </Button>
          )}
        </Box>

        {/* Advanced filters */}
        <Collapse in={showAdvanced}>
          <Box sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box 
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(4, 1fr)'
                },
                gap: 2
              }}
            >
              {/* Author search */}
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Author
                </Typography>
                <AuthorAutocomplete
                  value={selectedAuthor}
                  onChange={handleAuthorChange}
                  placeholder="Search by author name..."
                  disabled={loading}
                />
              </Box>

              {/* Category filter */}
              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    id="categoryId"
                    value={filters.categoryId || ''}
                    onChange={(e) => handleFilterChange('categoryId', e.target.value ? parseInt(e.target.value as unknown as string) : undefined)}
                    disabled={categoriesLoading}
                    label="Category"
                  >
                    <MenuItem value="">
                      {categoriesLoading ? 'Loading categories...' : 'All Categories'}
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Book status */}
              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-label">Reading Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    value={filters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    label="Reading Status"
                  >
                    <MenuItem value="">Any Status</MenuItem>
                    <MenuItem value="in progress">In Progress</MenuItem>
                    <MenuItem value="paused">Paused</MenuItem>
                    <MenuItem value="finished">Finished</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* Sort by */}
              <Box>
                <FormControl fullWidth size="small">
                  <InputLabel id="sortBy-label">Sort By</InputLabel>
                  <Select
                    labelId="sortBy-label"
                    id="sortBy"
                    value={filters.sortBy || 'relevance'}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="relevance">Relevance</MenuItem>
                    <MenuItem value="title">Title (A-Z)</MenuItem>
                    <MenuItem value="author">Author (A-Z)</MenuItem>
                    <MenuItem value="date-added">Recently Added</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};