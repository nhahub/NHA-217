// Centralized API utility for making requests to the backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.token;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

/**
 * Make an API request with automatic token handling
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  // Add body if provided
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { success: true, data: null };
    }

    const data = await response.json();

    // Handle backend error format
    if (!response.ok) {
      const errorMessage = data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server');
    }
    throw error;
  }
};

/**
 * GET request
 */
export const get = async (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return apiRequest(url, { method: 'GET' });
};

/**
 * POST request
 */
export const post = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: data,
  });
};

/**
 * PUT request
 */
export const put = async (endpoint, data = {}) => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: data,
  });
};

/**
 * DELETE request
 */
export const del = async (endpoint) => {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
};

/**
 * Upload file request
 */
export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const token = getAuthToken();
  const formData = new FormData();
  
  formData.append('file', file);
  
  // Append additional data
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

export default {
  get,
  post,
  put,
  delete: del,
  uploadFile,
  apiRequest,
};





