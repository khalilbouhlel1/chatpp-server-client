// New file: server/src/middleware/errorHandler.js
import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File is too large. Maximum size allowed is 5MB',
          error: 'FILE_TOO_LARGE'
        });
      }
      return res.status(400).json({
        success: false,
        message: 'File upload error',
        error: err.message
      });
    }
    
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  };