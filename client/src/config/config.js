export const API_URL = process.env.NODE_ENV === 'production'
  ? '/api'  // This will be relative to the same domain in production
  : 'http://localhost:3000/api'; // Your local backend URL 