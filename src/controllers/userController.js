//Use User model
import User from "../models/User";

// Request for join
export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "Create Account!" });

// Send data to server
export const postJoin = async (req, res) => {
  const pageTitle = "Create Account!";
  const { username, email, name, password, password2, location } = req.body;

  if (password !== password2)
    return res.render("join", {
      pageTitle,
      errorMessage: "Password comfirmation does not match!",
    });

  const chkDuiplicate = await User.exists({ $or: [{ username }, { email }] });
  if (chkDuiplicate)
    return res.render("join", { pageTitle, errorMessage: "already taken" });

  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  return res.redirect("/login");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Log In");
export const logout = (req, res) => res.send("Log Out");
export const see = (req, res) => res.send("See User");
