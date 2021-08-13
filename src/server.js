// import whole file
import "./db";
// const express = require("express");
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import usersRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;
const app = express();
const logger = morgan("dev");

// Set view engine as pug
app.set("view engine", "pug");
// Set lookup folder for the views
app.set("views", process.cwd() + "/src/views");
// let express uderstands and transforms the form values into javascript
app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/videos", videoRouter);

const handleLogin = (req, res) => {
  return res.send({ message: "login" });
};
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}😀`);

app.listen(PORT, handleListening);
