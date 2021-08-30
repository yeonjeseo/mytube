import mongoose from "mongoose";

// Video schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 50 },
  description: { type: String, required: true, trim: true, maxLength: 150 },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

// static method
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((item) => item.trim())
    .map((item) => (item.startsWith("#") ? item : `#${item}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
