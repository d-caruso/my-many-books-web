import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Book, User, Author, Category, PaginatedResponse, ApiError, SearchFilters, SearchResult } from '../types';
import { BookFormData } from '../components/Book/BookForm';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000',
      timeout: 10000,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          localStorage.removeItem('authToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // User methods  
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/api/users');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.api.put('/api/users', userData);
    return response.data;
  }

  // Book methods
  async getBooks(filters?: SearchFilters): Promise<PaginatedResponse<Book>> {
    const params = new URLSearchParams();
    
    if (filters?.query) params.append('search', filters.query);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await this.api.get(`/api/books?${params.toString()}`);
    return response.data;
  }

  async getBook(id: number): Promise<Book> {
    const response = await this.api.get(`/api/books/${id}`);
    return response.data;
  }

  async createBook(bookData: BookFormData): Promise<Book> {
    // Transform frontend format to backend format
    const backendData = {
      title: bookData.title,
      isbnCode: bookData.isbnCode,
      editionNumber: bookData.editionNumber,
      editionDate: bookData.editionDate,
      status: bookData.status,
      notes: bookData.notes,
      authorIds: bookData.selectedAuthors?.map(author => author.id) || [],
      categoryIds: bookData.selectedCategories || []
    };
    const response = await this.api.post('/api/books', backendData);
    return response.data;
  }

  async updateBook(id: number, bookData: Partial<BookFormData>): Promise<Book> {
    // Transform frontend format to backend format if it includes form data
    const backendData = bookData.selectedAuthors || bookData.selectedCategories ? {
      title: bookData.title,
      isbnCode: bookData.isbnCode,
      editionNumber: bookData.editionNumber,
      editionDate: bookData.editionDate,
      status: bookData.status,
      notes: bookData.notes,
      ...(bookData.selectedAuthors && { authorIds: bookData.selectedAuthors.map(author => author.id) }),
      ...(bookData.selectedCategories && { categoryIds: bookData.selectedCategories })
    } : bookData;
    
    const response = await this.api.put(`/api/books/${id}`, backendData);
    return response.data;
  }

  async deleteBook(id: number): Promise<void> {
    await this.api.delete(`/api/books/${id}`);
  }

  // Search books with enhanced filters
  async searchBooks(searchParams: {
    q?: string;
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    authorId?: number;
    categoryId?: number;
  }): Promise<SearchResult> {
    const params = new URLSearchParams();
    
    // Use search query for title search
    if (searchParams.q) params.append('search', searchParams.q);
    if (searchParams.status) params.append('status', searchParams.status);
    if (searchParams.page) params.append('page', searchParams.page.toString());
    if (searchParams.limit) params.append('limit', searchParams.limit.toString());
    
    // For author/category filtering, we'll need to implement this on the backend
    // For now, use general search
    const response = await this.api.get(`/api/books?${params.toString()}`);
    
    // Transform response to match SearchResult interface
    const data = response.data;
    return {
      books: data.books || [],
      total: data.pagination?.totalItems || data.total || 0,
      hasMore: data.pagination ? data.pagination.currentPage < data.pagination.totalPages : false,
      page: data.pagination?.currentPage || data.page || 1
    };
  }

  // ISBN lookup
  async searchByIsbn(isbn: string): Promise<any> {
    const response = await this.api.get(`/api/books/search/isbn/${isbn}`);
    return response.data;
  }

  // Categories methods
  async getCategories(): Promise<Category[]> {
    const response = await this.api.get('/api/categories');
    return response.data.categories || response.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.api.get(`/api/categories/${id}`);
    return response.data;
  }

  async createCategory(categoryData: { name: string }): Promise<Category> {
    const response = await this.api.post('/api/categories', categoryData);
    return response.data;
  }

  // Authors methods
  async getAuthors(): Promise<Author[]> {
    const response = await this.api.get('/api/authors');
    return response.data.authors || response.data;
  }

  async searchAuthors(searchTerm: string): Promise<Author[]> {
    if (!searchTerm.trim()) {
      return [];
    }
    const response = await this.api.get(`/api/authors?search=${encodeURIComponent(searchTerm.trim())}`);
    return response.data.authors || response.data;
  }

  async getAuthor(id: number): Promise<Author> {
    const response = await this.api.get(`/api/authors/${id}`);
    return response.data;
  }

  async createAuthor(authorData: { name: string; surname: string; nationality?: string }): Promise<Author> {
    const response = await this.api.post('/api/authors', authorData);
    return response.data;
  }

  // Error handler
  handleApiError(error: any): ApiError {
    if (error.response?.data) {
      return error.response.data as ApiError;
    }
    return {
      error: 'Network error',
      details: error.message || 'Unknown error occurred'
    };
  }
}

export const apiService = new ApiService();

// Legacy export for compatibility
export const bookAPI = {
  searchBooks: apiService.searchBooks.bind(apiService),
  searchByIsbn: apiService.searchByIsbn.bind(apiService),
  getBooks: apiService.getBooks.bind(apiService),
  getBook: apiService.getBook.bind(apiService),
  createBook: apiService.createBook.bind(apiService),
  updateBook: apiService.updateBook.bind(apiService),
  deleteBook: apiService.deleteBook.bind(apiService),
};

export const categoryAPI = {
  getCategories: apiService.getCategories.bind(apiService),
  getCategory: apiService.getCategory.bind(apiService),
  createCategory: apiService.createCategory.bind(apiService),
};

export const authorAPI = {
  getAuthors: apiService.getAuthors.bind(apiService),
  searchAuthors: apiService.searchAuthors.bind(apiService),
  getAuthor: apiService.getAuthor.bind(apiService),
  createAuthor: apiService.createAuthor.bind(apiService),
};