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
  console.log(id);

  //url에서 받은 id로 DB 내의 비디오를 찾음
  Video.findById(id)
    .then((video) => {
      return res.render("watch", {
        pageTitle: video.title,
        video,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.redirect("/");
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

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;

  try {
    await Video.create({
      title,
      description,
      createdAt: Date.now(),
      // hashtags: hashtags.split(","),
      hashtags: hashtags //mongoose 모델에 옵션이 있네! 트림 옵션
        .split(",")
        .map((item) => item.trim())
        .map((item) => (item[0] === "#" ? item : "#" + item)),
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
