import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define schema for User model
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    min: 8
  },
  rootSeed: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  publicKey: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;
