export const validateProfileUpdate = (req, res, next) => {
  const { name, phone } = req.body;
  
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters' });
  }
  
  if (!/^\+?[\d\s-]{8,}$/.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }
  
  next();
}; 