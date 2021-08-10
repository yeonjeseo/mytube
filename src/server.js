// const express = require("express");
import express from "express";
import morgan from "morgan";

const PORT = 4000;
const app = express();
const logger = morgan("dev");

const home = (req, res) => {
  console.log("This is home");
  return res.send("I will respond to home request");
};
const login = (req, res) => {
  console.log("This is login");
  return res.send("I will respond to login request");
};

app.use(logger);
app.get("/", home);
app.get("/login", login);

const handleLogin = (req, res) => {
  return res.send({ message: "login" });
};
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}😀`);

app.listen(PORT, handleListening);
