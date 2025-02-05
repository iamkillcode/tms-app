import express from 'express';
import authMiddleware from '../middleware/auth';
import path from 'path';
const router = express.Router();

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

// Get profile
router.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('name email phone department additionalFields avatarUrl');
      
    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      department: user.department,
      additionalFields: user.additionalFields,
      avatarUrl: user.avatarUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update profile
router.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, department, additionalFields } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name,
          phone,
          department,
          additionalFields: additionalFields.filter(f => f.label && f.value)
        }
      },
      { new: true }
    );
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Profile update failed' });
  }
});

// Upload avatar
router.post('/api/avatar', authMiddleware, (req, res, next) => {
  const avatar = req.files?.avatar;
  const extension = path.extname(avatar.name).toLowerCase();
  
  if (!allowedExtensions.includes(extension)) {
    return res.status(400).json({ message: 'Invalid file type' });
  }
  
  next();
}, async (req, res) => {
  try {
    if (!req.files?.avatar) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const avatar = req.files.avatar;
    const fileName = `avatars/${req.user.id}-${Date.now()}${path.extname(avatar.name)}`;
    
    // Upload to cloud storage or save to filesystem
    await avatar.mv(`./uploads/${fileName}`);
    
    await User.findByIdAndUpdate(req.user.id, {
      $set: { avatarUrl: `/uploads/${fileName}` }
    });
    
    res.json({ avatarUrl: `/uploads/${fileName}` });
  } catch (error) {
    res.status(500).json({ message: 'Avatar upload failed' });
  }
});

export default router; 