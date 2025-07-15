// src/services/api.js
export const apiFetch = async (url, options = {}, credentials = null) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // Add Basic Auth header if credentials are provided
  if (
    credentials?.username &&
    credentials?.password &&
    typeof credentials.username === 'string' &&
    typeof credentials.password === 'string'
  ) {
    headers['Authorization'] = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
  }

  const config = {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  };

  try {
    const response = await fetch(url, config);
    return response;
  } catch (error) {
    console.error('apiFetch error:', error);
    throw error;
  }
};
