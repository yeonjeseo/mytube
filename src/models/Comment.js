import mongoose from "mongoose";
import User from "./User";

const commentSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  comment: { type: String, require: true },
});

commentSchema.pre("findOneAndRemove", async function () {
  const commentId = this._id;
  const userId = this.author;
  const user = await User.findById(userId);
  const idx = user.comments.findIndex((id) => id === commentId);
  user.comments.splice(idx, 1);
  user.save();
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
