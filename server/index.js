const express = require("express");
const path = require("path");
const socketIO = require("socket.io");

const PORT = process.env.PORT || 4000;

const server = express()
  .use(express.static(path.join(__dirname, "../build")))
  .listen(PORT, () => {
    console.log("listening on port: 4000");
  });

let players = [];
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("update-client", async (res) => {
    players = await res;

    io.emit("update-players", res);
  });

  socket.on("new-user", (res) => {
    players.push({ ...res, id: socket.id });

    io.emit("update-players", players);
  });

  socket.on("disconnect", async () => {
    const index = await players.findIndex((e) => e.id === socket.id);
    if (index > -1) {
      players.splice(index, 1);
    }

    io.emit("update-players", players);
  });
});
