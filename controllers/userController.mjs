import User from "../models/userModel.mjs";
import asyncHandler from "../middlewares/asyncHandler.mjs";
import createToken from "../utils/createToken.mjs";
import bcrypt from "bcrypt";

const createUser = asyncHandler(async (req, res) => {
  const { username, password, rootSeed, salt, publicKey } = req.body;
  if (!username || !password || !rootSeed || !publicKey) {
    throw new Error("Please fill all the inputs.");
  }
  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).send("User already exists");

  const newUser = new User({ username, password, rootSeed, salt, publicKey });
  try {
    await newUser.save();
    createToken(res, newUser._id);

    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      rootSeed: newUser.rootSeed,
      salt: newUser.salt,
      publicKey: newUser.publicKey
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      return res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        rootSeed: existingUser.rootSeed,
        salt: existingUser.salt,
        publicKey: existingUser.publicKey
      });
    } else {
      return res.status(401).json({ message: "Incorrect password" });
    }
  } else {
    return res.status(401).json({ message: "Incorrect username" });
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httyOnly: true,
    expires: new Date(0)
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

const checkExistUser = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(200).json({ existUser: true });
  } else {
    return res.status(200).json({ existUser: false });
  }
});

const getPublicKeyFromUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username }).select("publicKey -_id");
  if (user) {
    return res.status(200).json({ publicKey: user.publicKey });
  } else {
    return res.status(401).json({ message: "Incorrect username" });
  }
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  checkExistUser,
  getPublicKeyFromUsername
};
