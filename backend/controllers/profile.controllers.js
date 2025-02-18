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

  const { id } = req.params;

  const { username, email } = req.body;

   console.log("got User  query")
  // Validate input data

  if (!username || !email) {

    return res.status(400).json({ success: false, message: 'Username and email are required' });

  }


  try {

    const user = await User.findByIdAndUpdate(

      id,

      { $set: { username, email } },

      { new: true }

    ).select('-password');
    console.log("User updated:", user);
    if (!user) {

      return res.status(404).json({ success: false, message: 'User  not found' });

    }


    res.status(200).json({ success: true, data: user });

  } catch (err) {

    console.error("Error updating user profile:", err); // Log the error for debugging

    res.status(500).json({ success: false, message: 'Server Error' });

  }

};