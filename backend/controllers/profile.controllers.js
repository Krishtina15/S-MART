import User from "../models/user.model.js"; 

// Get user profile
export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Update profile
export const updateUserProfile = async (req, res) => {
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
