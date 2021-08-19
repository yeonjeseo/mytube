// const express = require("express");
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/rootRouter";
import usersRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import session from "express-session";
import { localsMiddlewares } from "./middlewares";
import MongoStore from "connect-mongo";

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
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/mytube" }),
  })
);

// app.use((req, res, next) => {
//   console.log(res);
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });

app.use(localsMiddlewares);
app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/videos", videoRouter);

const handleLogin = (req, res) => {
  return res.send({ message: "login" });
};
app.get("/login", handleLogin);

export default app;
