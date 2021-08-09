// const express = require("express");
import express from "express";

const PORT = 4000;
const app = express();

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const privateMiddleware = (req, res, next) => {
  const url = req.url;
  if (url === "/protected") {
    return res.send("<h1>Not Allowed!</h1>");
  }
  console.log("Allowed, You may continue.");
  next();
};

const handleHome = (req, res) => {
  res.send(`<h1>some html?</h1>`);
};

app.get("/", logger, handleHome);

const handleLogin = (req, res) => {
  return res.send({ message: "login" });
};
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}😀`);

app.listen(PORT, handleListening);
