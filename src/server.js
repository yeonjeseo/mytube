// const express = require("express");
import express from "express";

const PORT = 4000;
const app = express();

const handleHome = (request, response) => {
  response.send(`<h1>some html?</h1>`);
};
app.get("/", handleHome);
const handleLogin = (req, res) => {
  return res.send({ message: "login" });
};
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}😀`);

app.listen(PORT, handleListening);
