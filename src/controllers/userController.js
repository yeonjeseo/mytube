//Use User model
import User from "../models/User";
import bcript from "bcrypt";
// import { render } from "pug";

// Request for join
export const getJoin = (req, res) =>
  res.render("join", { pageTitle: "Create Account!" });

// Send data to server
export const postJoin = async (req, res) => {
  const pageTitle = "Create Account!";
  const { username, email, name, password, password2, location } = req.body;

  if (password !== password2)
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password comfirmation does not match!",
    });

  const chkDuiplicate = await User.exists({ $or: [{ username }, { email }] });
  if (chkDuiplicate)
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: "already taken" });

  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    res.status(400).render("join", { pageTitle, errorMessage: error._message });
  }
};

export const getLogin = (req, res) => {
  const pageTitle = "Log in";
  res.render("login", { pageTitle });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Log In";

  // check if account exists
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: `${username} not exists!`,
    });
  }

  // check if password matches
  const chkPwd = await bcript.compare(password, user.password);
  if (!chkPwd) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "Password is not correct!" });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log Out");
export const see = (req, res) => res.send("See User");
