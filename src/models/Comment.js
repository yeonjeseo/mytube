import mongoose from "mongoose";
import User from "./User";

const commentSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  comment: { type: String, require: true },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
