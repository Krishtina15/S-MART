const User = require('../models/user.model');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('orders').select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update profile
exports.updateUserProfile = async (req, res) => {
  const { name, email } = req.body;
  
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, email } },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
