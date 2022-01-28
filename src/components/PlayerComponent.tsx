import { Flex, Image, Text } from "@chakra-ui/react";
import React, { useRef } from "react";
import { io } from "socket.io-client";
import checkCollision from "../helpers/checkCollision";
import { PlayerType } from "../types";

const socket = io("http://localhost:4000");

const PlayerComponent: React.FC<{
  player: PlayerType;
  players: Array<PlayerType>;
  playerIndex: number;
}> = ({ player, players, playerIndex }) => {
  onkeydown = (e) => {
    if (players.length) {
      switch (e.keyCode) {
        case 38:
          if (players[playerIndex].y <= 0 - 10) break;
          socket.emit(
            "update-client",
            Object.assign([...players], {
              [playerIndex]: {
                ...players[playerIndex],
                y: players[playerIndex].y - 10,
                direction: 0,
              },
            })
          );

          break;
        case 40:
          if (players[playerIndex].y >= window.innerHeight - 90) break;
          socket.emit(
            "update-client",
            Object.assign([...players], {
              [playerIndex]: {
                ...players[playerIndex],
                y: players[playerIndex].y + 10,
                direction: 0.5,
              },
            })
          );
          break;
        case 39:
          if (players[playerIndex].x >= window.innerWidth - 50) break;
          socket.emit(
            "update-client",
            Object.assign([...players], {
              [playerIndex]: {
                ...players[playerIndex],
                x: players[playerIndex].x + 10,
                direction: 0.25,
              },
            })
          );
          break;
        case 37:
          if (players[playerIndex].x <= 0 - 10) break;
          socket.emit(
            "update-client",
            Object.assign([...players], {
              [playerIndex]: {
                ...players[playerIndex],
                x: players[playerIndex].x - 10,
                direction: -0.25,
              },
            })
          );
          break;
        case 32:
          socket.emit(
            "update-client",
            Object.assign([...players], {
              [playerIndex]: {
                ...players[playerIndex],
                fire: true,
              },
            })
          );

          setTimeout(() => {
            socket.emit(
              "update-client",
              Object.assign([...players], {
                [playerIndex]: {
                  ...players[playerIndex],
                  fire: false,
                },
              })
            );
          }, 80);

          players
            .filter((e) => e.name !== players[playerIndex].name)
            .forEach((player) => {
              if (checkCollision(players[playerIndex], player)) {
                setTimeout(() => {
                  socket.emit(
                    "update-client",
                    Object.assign([...players], {
                      [playerIndex]: {
                        ...players[playerIndex],
                        fire: false,
                      },
                      [players.indexOf(player)]: {
                        ...players[players.indexOf(player)],
                        health: players[players.indexOf(player)].health - 10,
                      },
                    })
                  );
                }, 80);
              }
            });

          break;
      }
    }
  };

  return (
    <Flex
      position="absolute"
      flexDir="column"
      transform={`translate(${player.x}px, ${player.y}px)`}
      alignItems="center"
    >
      <Flex flexDir="column" justifyContent="center" alignItems="center">
        <Flex
          backgroundColor="rgba(0, 0, 0, 0.5)"
          padding={0.5}
          margin={2}
          justifyContent="center"
        >
          <Text color="white" fontSize={15}>
            {player.name}
          </Text>
        </Flex>

        <Flex w={70} h={1} border="0.2px solid #000" mb={2}>
          <Flex w={`${player.health}%`} backgroundColor="red" />
        </Flex>

        <Flex
          transform={`rotate(${player.direction}turn)`}
          flexDir="column-reverse"
          alignItems="center"
          justifyContent="space-between"
        >
          <Image
            zIndex={2}
            w={10}
            h={10}
            src={require("../assets/player-image.png")}
          />
          {player.fire && (
            <Flex position="absolute" w="0.5px" h={250} bgColor="#fff" />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PlayerComponent;
