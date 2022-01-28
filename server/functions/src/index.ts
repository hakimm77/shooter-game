const app = require("express")();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

interface PlayerType {
  name: string;
  x: number;
  y: number;
  direction: number;
  fire: boolean;
  health: number;
  id: string;
}

app.get("/", (req: any, res: any) => {
  res.json("hello world !");
});

let players: Array<PlayerType> = [];

io.on("connection", (socket: any) => {
  console.log("a user connected");

  socket.on("update-client", async (res: any) => {
    players = await res;

    players.forEach((player) => {
      if (player.health <= 0) {
        io.emit("player-lost", player.name);
      }
    });

    io.emit("update-players", players);
  });

  socket.on("new-user", (res: any) => {
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
