import Video from "../models/video";

export const home = async (req, res) => {
  //DB에서 Video 데이터를 찾은 뒤에야 rendering이 진행 됨
  // Video.find({}, (err, videos) => {
  //   console.log("Search");
  //   return res.render("home", { pageTitle: "Home", videos });
  // });
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch (err) {
    return res.render("Server Error!", err);
  }
};

export const watch = (req, res) => {
  //ES6 way
  const { id } = req.params;
  return res.render("watch", {
    pageTitle: `Watching :`,
  });
};

//form을 화면에 보여주는 컨트롤러
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("edit", { pageTitle: `Editing :  ${video.title}` });
};

export const postEdit = (req, res) => {
  const { title, description, hashtags } = req.body;
  console.log(title, description, hashtags);
  return res.redirect(`/videos/${id}`);
};

export const search = (req, res) => res.send("Search Video");

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  const { title, description, hashtags } = req.body;
  console.log(title, description, hashtags);
  const video = new Video({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags
      .split(",")
      .map((item) => item.trim())
      .map((item) => {
        return item[0] === "#" ? item : "#" + item;
      }),
    meta: {
      views: 0,
      rating: 0,
    },
  });

  console.log(video);
  return res.redirect("/");
};
export const deleteVideo = (req, res) => res.send("Delete Video");
