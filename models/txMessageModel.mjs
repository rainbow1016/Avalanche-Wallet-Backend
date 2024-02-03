import mongoose from "mongoose";

// Define schema for Message model
const MessageSchema = new mongoose.Schema({
  txHash: {
    type: String,
    required: true,
    unique: true
  },
  message: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
