//Use User model
import User from "../models/User";
import bcript from "bcrypt";
import fetch from "node-fetch";
import { access } from "fs";
import { profile } from "console";
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

  const chkDuplicate = await User.exists({ $or: [{ username }, { email }] });
  if (chkDuplicate)
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

export const getEdit = (req, res) => {
  return res.render("user/edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  // create subset of session.user for comparison
  const subset = (({ name, email, username, location }) => ({
    name,
    email,
    username,
    location,
  }))(req.session.user);
  const subsetStr = JSON.stringify(subset);
  const formStr = JSON.stringify({ name, email, username, location });
  //check if form value is different from session.user value
  if (subsetStr !== formStr) {
    // use $and: [{ _id: { $ne: _id } } to except current user's DB
    const chkDuplicate = await User.exists({
      $and: [{ _id: { $ne: _id } }, { $or: [{ username }, { email }] }],
    });
    // at least 1 value is duplicated
    if (chkDuplicate) {
      console.log("duplication!");
      return res.status(400).render("edit-profile", {
        pageTitle: "Edit Profile",
        errorMessage: "Already exists",
      });
    } else {
      // if not duplicated, update DB -> update session
      // allow duplication for name, location
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
          avatarUrl: file ? file.path : avatarUrl,
          email,
          username,
          location,
        },
        { new: true }
      );
      req.session.user = updatedUser;
      return res.redirect("/users/edit");
    }
  }
  //if form value is equal to session.user value, send user to root
  return res.redirect("/");
};

export const getChangePassword = (req, res) => {
  return res.render("user/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  //누가? 비밀번호를 변경하려는지 알아야함.
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirm },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcript.compare(oldPassword, user.password);
  if (!ok)
    return res.status(400).render("user/change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect",
    });
  if (newPassword !== newPasswordConfirm) {
    return res.status(400).render("user/change-password", {
      pageTitle: "Change Password",
      errorMessage: "Check your password confirmation",
    });
  }
  console.log(user.password);
  user.password = newPassword;
  console.log(user.password);
  await user.save();
  console.log(user.password);
  // send notification

  return res.redirect("/users/logout");
};
export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("See User");
