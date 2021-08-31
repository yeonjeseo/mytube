import session from "express-session";
import User from "../models/User";
import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  //ES6 way
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  if (!video)
    return res.status("404").render("404", { pageTitle: "Video not found!" });
  return res.render("watch", { pageTitle: video.title, video });
};

//form을 화면에 보여주는 컨트롤러
export const getEdit = async (req, res) => {
  //video id
  const { id } = req.params;
  //user id
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video)
    return res.status(404).render("404", { pageTitle: "Video not found!" });
  if (String(video.owner) !== String(_id)) return res.status(403).redirect("/");
  return res.render("video/edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const {
    params: { id },
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
  } = req;

  // const { id } = req.params;
  // const { title, description, hashtags } = req.body;
  // const {
  //   user: { _id },
  // } = req.session;
  const videoExists = await Video.exists({ _id: id });
  if (!videoExists)
    return res.status(404).render("404", { pageTitle: "Video not found!" });
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not the owner");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved!");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  res.render("videos/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  console.log(req.files);
  const {
    session: {
      user: { _id },
    },
    body: { title, description, hashtags },
    files: { video, thumb },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      createdAt: Date.now(),
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("videos/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!videoExists)
    return res.status(404).render("404", { pageTitle: "Video not found!" });
  if (String(video.owner) !== String(_id)) return res.status(403).redirect("/");
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  let videos = [];
  // 폼으로 작성한건 req.query로 넘어옴
  // 그 중에서 keyword는 input tag 에서 name을 keyword로 정했기 때문에 keyword로 넘어옴
  // console.log(keyword);
  const { keyword } = req.query;
  if (keyword) {
    //search
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = (req, res) => {
  console.log(req.params);
  console.log(req.body);
  res.end();
};
