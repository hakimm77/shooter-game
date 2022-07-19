import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import { PlayerType } from "../types";
import { io } from "socket.io-client";
import checkCollision from "../helpers/checkCollision";
import { LoginContext } from "../hooks/LoginContext";
import PlayerComponent from "../components/PlayerComponent";

const socket = io("/");

const GameScreen = () => {
  const [players, setPlayers] = useState<Array<PlayerType>>([]);
  const { username, setUsername, setBegin, setLoading } =
    useContext(LoginContext);

  let playerIndex = players.findIndex((e) => e.name === username);

  useEffect(() => {
    socket.on("update-players", async (res) => {
      if (res) {
        setPlayers(res);
      }
    });
  }, []);

  useEffect(() => {
    if (playerIndex > -1) {
      if (players[playerIndex].health <= 0) {
        setBegin(false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  }, [players[playerIndex]]);

  onkeydown = (e) => {
    if (playerIndex >= 0) {
      switch (e.keyCode) {
        case 38:
          if (players[playerIndex].y <= 0 - 10) break;
          socket.emit("update-client", {
            [playerIndex]: {
              ...players[playerIndex],
              y: players[playerIndex].y - 10,
              direction: 0,
            },
          });

          break;
        case 40:
          if (players[playerIndex].y >= window.innerHeight - 90) break;
          socket.emit("update-client", {
            [playerIndex]: {
              ...players[playerIndex],
              y: players[playerIndex].y + 10,
              direction: 0.5,
            },
          });
          break;
        case 39:
          if (players[playerIndex].x >= window.innerWidth - 50) break;
          socket.emit("update-client", {
            [playerIndex]: {
              ...players[playerIndex],
              x: players[playerIndex].x + 10,
              direction: 0.25,
            },
          });
          break;
        case 37:
          if (players[playerIndex].x <= 0 - 10) break;
          socket.emit("update-client", {
            [playerIndex]: {
              ...players[playerIndex],
              x: players[playerIndex].x - 10,
              direction: -0.25,
            },
          });
          break;
        case 32:
          socket.emit("update-client", {
            [playerIndex]: {
              ...players[playerIndex],
              fire: true,
            },
          });

          setTimeout(() => {
            socket.emit("update-client", {
              [playerIndex]: {
                ...players[playerIndex],
                fire: false,
              },
            });
          }, 80);

          players
            .filter((e) => e.name !== players[playerIndex].name)
            .forEach((player) => {
              if (checkCollision(players[playerIndex], player)) {
                setTimeout(() => {
                  socket.emit("update-client", {
                    [playerIndex]: {
                      ...players[playerIndex],
                      fire: false,
                    },
                    [players.indexOf(player)]: {
                      ...players[players.indexOf(player)],
                      health: players[players.indexOf(player)].health - 10,
                    },
                  });
                }, 80);
              }
            });

          break;
      }
    }
  };

  return (
    <Flex
      position="relative"
      w="100%"
      h="100vh"
      overflow="hidden"
      backgroundImage={require("../assets/game-screen-image.png")}
    >
      {players.map((player, componentIndex) => (
        <PlayerComponent player={player} key={componentIndex} />
      ))}
    </Flex>
  );
};

export default GameScreen;
