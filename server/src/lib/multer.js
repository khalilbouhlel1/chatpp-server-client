import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  
  // Check file size before processing (in bytes)
  if (file.size > 5 * 1024 * 1024) {
    cb(new Error('File size exceeds 5MB limit'), false);
    return;
  }
  
  if (!allowed.includes(file.mimetype)) {
    cb(new Error('Invalid file type. Only JPG, PNG and WebP images are allowed'), false);
    return;
  }
  
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Only allow 1 file upload at a time
  }
});