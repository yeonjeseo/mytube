import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  comment: { type: String, require: true },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
