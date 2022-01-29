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

    players.forEach((player) => {
      if (player.health <= 0) {
        io.emit("player-lost", player.name);
      }
    });

    io.emit("update-players", players);
  });

  socket.on("new-user", (res) => {
    players.push({ ...res, id: socket.id });

    io.emit("update-players", players);
  });

  socket.on("disconnect", () => {
    const index = players.indexOf(players.filter((e) => e.id === socket.id)[0]);
    players.splice(index, 1);

    io.emit("update-players", players);
  });
});
