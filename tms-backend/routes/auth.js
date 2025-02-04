const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Enhanced signup with validation
router.post('/signup', async (req, res) => {
  try {
    // Convert inputs to lowercase before checking
    const email = req.body.email.toLowerCase().trim();
    const username = req.body.username.toLowerCase().trim();
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email ? 'Email already exists' : 'Username already taken'
      });
    }

    const user = new User({ 
      fullName: req.body.fullName.trim(),
      username,
      email,
      password: req.body.password
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration Error:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        error: `${field} already exists` 
      });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Enhanced login with security
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ 
      $or: [
        { username: username.toLowerCase().trim() },
        { email: username.toLowerCase().trim() }
      ]
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({ 
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', {
      message: error.message,
      stack: error.stack,
      attempt: req.body.username
    });
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router; 