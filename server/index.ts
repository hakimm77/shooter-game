const app = require("express")();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

app.get("/", (req, res) => {
  res.json("hello world !");
});

let players = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("update-client", (res) => {
    players = res;
    io.emit("update-players", res);
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
