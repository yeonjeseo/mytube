export const trending = (req, res) => {
  const videos = [
    {
      title: "First Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "Second Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
    {
      title: "Third Video",
      rating: 5,
      comments: 2,
      createdAt: "2 minutes ago",
      views: 59,
      id: 1,
    },
  ];
  const obj = {
    name: "Jeffrey",
    age: 32,
    major: "Aerospace Engineering",
  };
  return res.render("home", { pageTitle: "Home", videos, obj });
};
export const see = (req, res) => {
  return res.render("watch", { pageTitle: "Watch", potato: "potato" });
};
export const edit = (req, res) => {
  console.log(req.params);
  return res.render("edit");
};
export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload Video");
export const deleteVideo = (req, res) => res.send("Delete Video");
