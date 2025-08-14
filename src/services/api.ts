import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Book, User, Author, Category, PaginatedResponse, ApiError, BookFormData, SearchFilters, SearchResult } from '../types';

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

  // Auth methods
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: { email: string; password: string; name: string; surname: string }): Promise<{ token: string; user: User }> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // User methods
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/users/me');
    return response.data;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await this.api.put('/users/me', userData);
    return response.data;
  }

  // Book methods
  async getBooks(filters?: SearchFilters): Promise<PaginatedResponse<Book>> {
    const params = new URLSearchParams();
    
    if (filters?.query) params.append('search', filters.query);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await this.api.get(`/books/user?${params.toString()}`);
    return response.data;
  }

  async getBook(id: number): Promise<Book> {
    const response = await this.api.get(`/books/user/${id}`);
    return response.data;
  }

  async createBook(bookData: BookFormData): Promise<Book> {
    const response = await this.api.post('/books/user', bookData);
    return response.data;
  }

  async updateBook(id: number, bookData: Partial<BookFormData>): Promise<Book> {
    const response = await this.api.put(`/books/user/${id}`, bookData);
    return response.data;
  }

  async deleteBook(id: number): Promise<void> {
    await this.api.delete(`/books/user/${id}`);
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
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await this.api.get(`/books/search?${params.toString()}`);
    
    // Transform response to match SearchResult interface
    const data = response.data;
    return {
      books: data.books || [],
      total: data.pagination?.totalItems || data.total || 0,
      hasMore: data.pagination ? data.pagination.currentPage < data.pagination.totalPages : false,
      page: data.pagination?.currentPage || data.page || 1
    };
  }

  // Get book by ISBN
  async getBookByISBN(isbn: string): Promise<Book> {
    const response = await this.api.get(`/books/isbn/${isbn}`);
    return response.data;
  }

  // ISBN lookup
  async searchByIsbn(isbn: string): Promise<any> {
    const response = await this.api.get(`/books/user/search/isbn/${isbn}`);
    return response.data;
  }

  // Categories methods
  async getCategories(): Promise<Category[]> {
    const response = await this.api.get('/categories');
    return response.data;
  }

  async getCategory(id: number): Promise<Category> {
    const response = await this.api.get(`/categories/${id}`);
    return response.data;
  }

  async createCategory(categoryData: { name: string }): Promise<Category> {
    const response = await this.api.post('/categories', categoryData);
    return response.data;
  }

  // Authors methods
  async getAuthors(): Promise<Author[]> {
    const response = await this.api.get('/authors');
    return response.data;
  }

  async getAuthor(id: number): Promise<Author> {
    const response = await this.api.get(`/authors/${id}`);
    return response.data;
  }

  async createAuthor(authorData: { name: string; surname: string; nationality?: string }): Promise<Author> {
    const response = await this.api.post('/authors', authorData);
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
  getBookByISBN: apiService.getBookByISBN.bind(apiService),
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
  getAuthor: apiService.getAuthor.bind(apiService),
  createAuthor: apiService.createAuthor.bind(apiService),
};