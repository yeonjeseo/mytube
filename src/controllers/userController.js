//Use User model
import User from "../models/User";
import bcript from "bcrypt";
import fetch from "node-fetch";
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

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";

  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    //access api
    const { access_token } = tokenRequest;
    const userRequest = await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userRequest);
  } else {
    return res.redirect("/login");
  }
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log Out");
export const see = (req, res) => res.send("See User");
