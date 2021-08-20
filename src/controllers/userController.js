//Use User model
import User from "../models/User";
import bcript from "bcrypt";
import fetch from "node-fetch";
import { access } from "fs";
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
  // only not social only
  const user = await User.findOne({ username, socialOnly: false });
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
    const apiUrl = "https://api.github.com";
    // 이건 유저 데이터만 가져옴
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    // 이건 email 데이터
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // 메서드 체인이 안 먹힘?!
    // .find((emails) => email.primary && emails.verified);
    const emailObj = emailData.find((item) => item.primary && item.verified);
    if (!emailObj) return res.redirect("/login");
    //emailObj의 이메일을 활용해서 유저를 찾음
    //회원이 없을 경우, else로 넘어가야 하는데, find로 못 찾아도 빈 배열이 리턴됨 => 빈 배열은 nullish value가 아니라서 if로 넘어감
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      //create an account
      console.log(userData.name, "this means user not exists");
      user = await User.create({
        name: userData.name,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        username: userData.login,
        email: emailObj.email,
        password: "",
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("See User");
