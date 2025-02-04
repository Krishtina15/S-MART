import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import multer from "multer";
import generateTokenAndSetCookie from "../utility/generateToken.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
	cb(null, 'uploads/profilePicture'); // Specify the directory for uploaded images
  },
  filename: (req, file, cb) => {
	cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize:1024 * 1024 },
  fileFilter: (req, file, cb) => {
	console.log("Uploading file:", file.originalname);
	if (file.mimetype.startsWith("image/")) {
	  cb(null, true);
	} else {
	  cb(new Error("Only image files are allowed"));
	}
  },
});

export const uploadImages=upload.single('profilePicture');

export const signup = async (req, res) => {
	console.log("Request body:", req.body);
	console.log("Request file:", req.file);
	try {
	  const { username, email, password, confirmPassword } = req.body;
	  // Optionally, check if file is provided
	  const profilePicture = req.file ? req.file.path : ''; // or set a default URL
  
	  if (password !== confirmPassword) {
		return res.status(400).json({ error: "Passwords don't match" });
	  }
  
	  const userExists = await User.findOne({ username });
	  if (userExists) {
		return res.status(400).json({ error: "Username already exists" });
	  }

	  const emailExists = await User.findOne({ email });
	  if (emailExists) {
		return res.status(400).json({ error: "Email already exists" });
	  }
  
	  // HASH PASSWORD
	  const salt = await bcrypt.genSalt(10);
	  const hashedPassword = await bcrypt.hash(password, salt);
  
	  const newUser = new User({
		username,
		email,
		profilePicture, // now defined from req.file
		password: hashedPassword,
	  });
  
	  // Generate JWT token here
	  generateTokenAndSetCookie(newUser._id, res);
	  await newUser.save();
  
	  res.status(201).json({
		_id: newUser._id,
		username: newUser.username,
		email: newUser.email,
		profilePicture: newUser.profilePicture,
	  });
	} catch (error) {
	  console.log("Error in signup controller", error.message);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };
  

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			username: user.username,
			email : user.email,
			//profilePic: user.profilePic,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};