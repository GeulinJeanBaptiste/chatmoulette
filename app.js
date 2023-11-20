import express from "express";
import http from "http";
const app = express();
import { Server } from "socket.io";
import fs from "fs";
const server = http.Server(app);
const io = new Server(server);
const host = "127.0.0.1";
const port = 8000;

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});
// gestion utilisateur.
const userList = [];

io.on("connection", (socket) => {
  socket.emit("welcome", { userList: userList, id: socket.id });
  socket.on("newUser", (data) => {
    userList.push({
      pseudo: data.pseudo,
      id: socket.id,
    });
    socket.broadcast.emit("resNewUser", { userList: userList });
  });
  socket.on("message", (data) => {
    /*     {
      pseudo: pseudo,
      time: ms,
      text: textChatbox,
      "id":,
    } */
    let messageForHistorique = data;
    messageForHistorique.id = socket.id;
    fs.readFile("./data/historique.json", (err, data) => {
      console.dir(messageForHistorique);
      console.dir(JSON.parse(data));
      let historique = JSON.parse(data).historique;
      historique.push(messageForHistorique);
      fs.writeFile(
        "./data/historique.json",
        JSON.stringify({ historique: historique }),
        (err) => {}
      );
    });
    socket.broadcast.emit("resmessage", { data: data });
  });
  socket.on("disconnect", () => {
    let deleteIndex;
    userList.forEach((value, index) => {
      if (socket.id === value.id) {
        deleteIndex = index;
      }
    });
    userList.splice(deleteIndex, 1);
    socket.broadcast.emit("disconnectUser", { userList: userList });
  });
});

server.listen(port, host, () => {
  console.log(`serveur lancé sur http://${host}:${port}`);
});
