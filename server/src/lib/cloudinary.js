import cloudinary from 'cloudinary';

export const uploadToCloudinary = async (file) => {
  try {
    let imageToUpload;
    
    console.log('Cloudinary upload input:', {
      type: typeof file,
      isBuffer: Buffer.isBuffer(file?.buffer),
      hasBuffer: !!file?.buffer,
      hasMimetype: !!file?.mimetype
    });
    
    // Handle buffer from multer
    if (file.buffer && file.mimetype) {
      imageToUpload = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      console.log('Created base64 from buffer');
    } 
    // Handle base64 string
    else if (typeof file === 'string' && file.startsWith('data:image')) {
      imageToUpload = file;
      console.log('Using provided base64 string');
    } 
    else {
      throw new Error('Invalid file format');
    }

    console.log('Attempting Cloudinary upload...');
    const result = await cloudinary.v2.uploader.upload(imageToUpload, {
      folder: 'user_profiles',
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [
        { width: 500, height: 500, crop: 'limit' },
        { quality: 'auto' }
      ]
    });
    console.log('Cloudinary upload result:', {
      url: result.secure_url,
      format: result.format,
      size: result.bytes
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Error uploading file to Cloudinary');
  }
}; 