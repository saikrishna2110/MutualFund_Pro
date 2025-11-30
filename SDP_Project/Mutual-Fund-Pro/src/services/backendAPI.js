// Backend API Service for Mutual Fund Pro
// Connects to the backend running at http://localhost:5000/api

const API_BASE_URL = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

// Generic API call function using fetch
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);

    // Handle auth errors
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login
      // window.location.href = '/login';
    }

    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Authentication endpoints
export const authAPI = {
  login: async (credentials) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return response.json();
  },
  register: async (userData) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  getProfile: async () => {
    const response = await apiCall('/auth/profile');
    return response.json();
  },
};

// Mutual Fund endpoints
export const mutualFundAPI = {
  // Get all mutual funds with pagination
  getAllFunds: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/mutual-funds?${queryString}` : '/mutual-funds';
    const response = await apiCall(url);
    return response.json();
  },

  // Search mutual funds
  searchFunds: async (query, limit = 10) => {
    const response = await apiCall(`/mutual-funds/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.json();
  },

  // Get specific fund by scheme code
  getFundByCode: async (schemeCode) => {
    const response = await apiCall(`/mutual-funds/${schemeCode}`);
    return response.json();
  },

  // Get top performing funds
  getTopPerformingFunds: async (limit = 10, period = '30day') => {
    const response = await apiCall(`/mutual-funds/top-performing?limit=${limit}&period=${period}`);
    return response.json();
  },

  // Sync data from MFAPI.in (admin only)
  syncFundData: async () => {
    const response = await apiCall('/mutual-funds/sync', {
      method: 'POST'
    });
    return response.json();
  },
};

// Recommendation endpoints
export const recommendationAPI = {
  // Get recommendations for advisor
  getAdvisorRecommendations: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/recommendations/advisor?${queryString}` : '/recommendations/advisor';
    const response = await apiCall(url);
    return response.json();
  },

  // Get recommendations for investor
  getInvestorRecommendations: async () => {
    const response = await apiCall('/recommendations/investor');
    return response.json();
  },

  // Create new recommendation
  createRecommendation: async (data) => {
    const response = await apiCall('/recommendations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Update recommendation status
  updateRecommendationStatus: async (id, data) => {
    const response = await apiCall(`/recommendations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  },

  // Delete recommendation
  deleteRecommendation: async (id) => {
    const response = await apiCall(`/recommendations/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },
};

// User management endpoints
export const userAPI = {
  getProfile: async () => {
    const response = await apiCall('/users/profile');
    return response.json();
  },
  updateProfile: async (data) => {
    const response = await apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  },
  changePassword: async (data) => {
    const response = await apiCall('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  },
};

// Health check
export const healthAPI = {
  checkHealth: async () => {
    const response = await apiCall('/../health');
    return response.json();
  },
};

// Export for custom requests (compatibility)
export default {
  get: (url) => apiCall(url).then(res => res.json()),
  post: (url, data) => apiCall(url, { method: 'POST', body: JSON.stringify(data) }).then(res => res.json()),
  put: (url, data) => apiCall(url, { method: 'PUT', body: JSON.stringify(data) }).then(res => res.json()),
  delete: (url) => apiCall(url, { method: 'DELETE' }).then(res => res.json()),
};

// Helper function to handle API responses
export const handleApiResponse = (promise) => {
  return promise
    .then(response => ({
      success: true,
      data: response.data,
      status: response.status
    }))
    .catch(error => ({
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status || 500
    }));
};
