const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");

app.use(express.static(path.join(__dirname, "/../../build")));

let players = [];

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

server.listen(4000, () => {
  console.log("listening on *:4000");
});
