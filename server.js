const PORT = 3000; // Sets the output port

const express = require("express");
const session = require('express-session');
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require("path");


//necessairy to load script and css files without type mismatch even if in right path
app.use("/public", express.static(path.join(__dirname, "public")));

// linking link to according html file
const pages = [{ url: "/game", file: "/public/main.html" }];

//links the right html for each url
pages.forEach((page) => {
  app.get(page.url, (req, res) => {
    res.sendFile(`${__dirname}${page.file}`);
  });
});

//creates server on localhost:PORT
server.listen(process.env.PORT || 5000);

//important stuff happens here
//get executed when client creates instance of io()
io.on("connection", (socket) => {
  // 'disconnect' is build in event
  socket.on("disconnect", () => {
    let ip = socket.handshake.address;
  });
});
