// const express = require("express");
import express from "express";

const PORT = 4000;
const app = express();

const routerLogger = (req, res, next) => {
  console.log("PATH", req.path);
  next();
};
const methodLogger = (req, res, next) => {
  console.log("METHOD", req.method);
  next();
};
const home = (req, res) => {
  console.log("This is home");
  return res.send("I will respond to home request");
};
const login = (req, res) => {
  console.log("This is login");
  return res.send("I will respond to login request");
};

app.use(routerLogger, methodLogger);
app.get("/", home);
app.get("/login", login);

const handleLogin = (req, res) => {
  return res.send({ message: "login" });
};
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}😀`);

app.listen(PORT, handleListening);
