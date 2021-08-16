import { render } from "pug";
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

export const watch = async (req, res) => {
  //ES6 way
  const { id } = req.params;
  const video = await Video.findById(id);
  if (video) {
    return res.render("watch", { pageTitle: video.title, video });
  }
  return res.render("404", { pageTitle: "Video not found!" });
  //url에서 받은 id로 DB 내의 비디오를 찾음
  // 이건 내 코드인데 일단 주석 처리 해놓고 강의 따라 가자
  // Video.findById(id)
  //   .exec()
  //   .then((video) => {
  //     console.log(`Video Object : ${video}`);
  //     return res.render("watch", {
  //       pageTitle: video.title,
  //       video,
  //     });
  //   })
  //   .catch((err) => {
  //     //오오 난 이미 없는 데이터에 대해 예외처리를 했네?!!
  //     console.log(`Error : ${err}`);
  //     console.log(err);
  //     return res.redirect("/");
  //   });
};

//form을 화면에 보여주는 컨트롤러
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) return res.render("404", { pageTitle: "Video not found!" });
  return res.render("edit", { pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;

  const videoExists = await Video.exists({ _id: id });
  if (!videoExists) return res.render("404", { pageTitle: "Video not found!" });

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  // video.title = title;
  // video.description = description;
  // video.hashtags = hashtags
  //   .split(",")
  //   .map((item) => item.trim())
  //   .map((item) => (item.startsWith("#") ? item : `#${item}`));
  // await video.save();
  return res.redirect(`/videos/${id}`);
};

export const search = (req, res) => res.send("Search Video");

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      createdAt: Date.now(),
      // hashtags: hashtags.split(","),
      hashtags: Video.formatHashtags(hashtags),
      meta: {
        views: 0,
        rating: 0,
      },
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
  // const video = new Video({
  //   title,
  //   description,
  //   createdAt: Date.now(),
  //   hashtags: hashtags
  //     .split(",")
  //     .map((item) => item.trim())
  //     .map((item) => {
  //       return item[0] === "#" ? item : "#" + item;
  //     }),
  //   meta: {
  //     views: 0,
  //     rating: 0,
  //   },
  // });
  // await video
  //   .save()
  //   .then((item) => {
  //     console.log(`${item} saved to DB`);
  //   })
  //   .catch((error) => {
  //     console.log(`Error occures : ${error}`);
  //   });
};
export const deleteVideo = (req, res) => res.send("Delete Video");
