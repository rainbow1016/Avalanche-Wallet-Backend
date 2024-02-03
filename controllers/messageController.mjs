import Message from "../models/txMessageModel.mjs";
import asyncHandler from "../middlewares/asyncHandler.mjs";
import { ethers } from "ethers";
import abi from "../utils/erc20.abi.json" assert { type: "json" };
const HTTPSProvider = new ethers.JsonRpcProvider(
  process.env.NODE_URL || "https://api.avax-test.network/ext/bc/C/rpc"
);
let iface = new ethers.Interface(abi);

const recordMessage = asyncHandler(async (req, res) => {
  const { txHash, message } = req.body;
  if (!txHash || !message) {
    throw new Error("Please fill all the inputs.");
  }
  const newMessage = new Message({ txHash, message });
  try {
    await newMessage.save();
    return res.status(201).json({
      _id: newMessage._id,
      txHash: newMessage.txHash,
      message: newMessage.message
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid message data");
  }
});

// can access contract address
const getMessage = asyncHandler(async (req, res) => {
  const { txHash, address } = req.body;
  let tx = "";
  let message = "";
  try {
    let result = await Message.findOne({ txHash }).select("message -_id");
    message = result.message;
  } catch (error) {}
  try {
    tx = await HTTPSProvider.getTransaction(txHash);
  } catch (error) {
    res.status(400);
    throw new Error("Invalid TX Hash");
  }
  let data = tx.data;
  try {
    let parsed = iface.parseTransaction({ data });
    if (parsed.name == "transfer") {
      if (address == tx.from || address == parsed.args[0]) {
        return res.status(200).json({ message: message });
      } else {
        res.status(400);
        throw new Error("Not Permissioned Access");
      }
    } else {
      console.log("not transfer tx");
    }
  } catch (error) {
    if (address == tx.from || address == tx.to) {
      return res.status(200).json({ message: message });
    } else {
      res.status(400);
      throw new Error("Not Permissioned Access");
    }
  }
});

export { recordMessage, getMessage };
