// New file: server/src/config/validateEnv.js
export const validateEnv = () => {
    const required = [
      'JWT_SECRET',
      'DATABASE_URL',
      'CLOUDINARY_NAME',
      'CLOUDINARY_API_KEY',
      'CLOUDINARY_API_SECRET'
    ];
  
    for (const key of required) {
      if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }
  };