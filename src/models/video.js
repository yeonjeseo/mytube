import mongoose from "mongoose";

// Video schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 50 },
  description: { type: String, required: true, trim: true, maxLength: 100 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

// pre middleware
// videoSchema.pre("save", async function () {
//   this.hashtags = this.hashtags[0]
//     .split(",")
//     .map((item) => item.trim())
//     .map((item) => (item[0] === "#" ? item : "#" + item));
// });

// static method
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((item) => item.trim())
    .map((item) => (item.startsWith("#") ? item : `#${item}`));
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
