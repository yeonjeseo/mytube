// const express = require("express");
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/rootRouter";
import usersRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import session from "express-session";
import { localsMiddlewares } from "./middlewares";
import MongoStore from "connect-mongo";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

// Set view engine as pug
app.set("view engine", "pug");
// Set lookup folder for the views
app.set("views", process.cwd() + "/src/views");
// app.use((req, res, next) => {
//   res.header("Cross-Origin-Embedder-Policy", "require-corp");
//   res.header("Cross-Origin-Opener-Policy", "same-origin");
//   next();
// });
// let express uderstands and transforms the form values into javascript
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: `${process.env.DB_URL}` }),
    // cookie: {
    //   maxAge: 30000,
    // },
  })
);

app.use(localsMiddlewares);
app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));

const handleLogin = (req, res) => {
  return res.send({ message: "login" });
};
app.get("/login", handleLogin);

export default app;
