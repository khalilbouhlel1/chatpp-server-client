import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { 
    expiresIn: "7d" 
  });
};

export const createResponse = (success, message, data = null) => {
  const response = {
    success,
    message
  };
  if (data) response.data = data;
  return response;
};
