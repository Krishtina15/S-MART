import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
 
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  profilePicture:{
    type: String,
    required:true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  products:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
  }],
  cart:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
  }],
  totalSales:{
    type:Number,
  },
  totalRevenue:{
    type:Number,
  },
  Admin:{
    type:Boolean,
    required :true,
  }
  
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;

