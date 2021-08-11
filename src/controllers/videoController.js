export const trending = (req, res) => {
  res.render("home", { pageTitle: "Home", potato: "potato" });
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
