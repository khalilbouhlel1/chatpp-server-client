import { body, validationResult } from "express-validator";

const HandleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array(),
      message: 'Validation failed'
    });
  }
  next();
};

export const validateProfile = [
  body("fullname")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Full name must be between 2 and 50 characters"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage("Password must be at least 6 characters and contain both letters and numbers"),
  body("profilepic")
    .optional()
    .custom((value, { req }) => {
      if (req.file) {
        if (req.file.size > 5 * 1024 * 1024) {
          throw new Error('File size exceeds 5MB limit');
        }
        return true;
      }
      if (value && !value.match(/^data:image\/(jpeg|png|jpg);base64,/)) {
        throw new Error('Invalid image format');
      }
      return true;
    }),
  HandleValidationErrors,
];
