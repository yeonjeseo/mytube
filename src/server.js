// const express = require("express");
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/rootRouter";
import usersRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import session from "express-session";

const app = express();
const logger = morgan("dev");

// Set view engine as pug
app.set("view engine", "pug");
// Set lookup folder for the views
app.set("views", process.cwd() + "/src/views");
// let express uderstands and transforms the form values into javascript
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(
  session({
    secret: "Hello",
    resave: true,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});

app.get("/add-one", (req, res, next) => {
  req.session.potato += 1;
  return res.send(`${req.session.id}\n${req.session.potato}`);
});

app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/videos", videoRouter);

const handleLogin = (req, res) => {
  return res.send({ message: "login" });
};
app.get("/login", handleLogin);

export default app;
