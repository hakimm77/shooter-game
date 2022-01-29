import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import { PlayerType } from "../types";
import { io } from "socket.io-client";
import PlayerComponent from "../components/PlayerComponent";
import checkCollision from "../helpers/checkCollision";

const socket = io("/");

const GameScreen = () => {
  const [players, setPlayers] = useState<Array<PlayerType>>([]);
  const [begin, setBegin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string>("");
  let playerIndex = players.findIndex((e) => e.name !== userName);

  const handleAddingUser = async () => {
    if (userName) {
      setLoading(true);

      socket.emit("new-user", {
        name: userName,
        x: 100,
        y: 100,
        direction: 0,
        fire: false,
        health: 100,
      });
      setBegin(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket.on("update-players", async (res) => {
      if (res) {
        setPlayers(res);

        if (playerIndex > -1) {
          if (res[playerIndex].health <= 0) {
            console.log("dead");
            setBegin(false);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }
      }
    });
  }, []);

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
    <>
      {begin ? (
        <Flex
          position="relative"
          w="100%"
          h="100vh"
          overflow="hidden"
          backgroundImage={require("../assets/game-screen-image.png")}
        >
          {players.map((player: PlayerType) => (
            <Flex
              position="absolute"
              flexDir="column"
              transform={`translate(${player.x}px, ${player.y}px)`}
              alignItems="center"
            >
              <Flex
                flexDir="column"
                justifyContent="center"
                alignItems="center"
              >
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
                    <Flex
                      position="absolute"
                      w="0.5px"
                      h={250}
                      bgColor="#fff"
                    />
                  )}
                </Flex>
              </Flex>
            </Flex>
          ))}
        </Flex>
      ) : (
        <Flex
          flexDir="column"
          backgroundImage={require("../assets/background-image.jpeg")}
          w="100%"
          minH="100vh"
          alignItems="center"
          pt={100}
        >
          <Text
            fontSize={50}
            fontFamily="'Mochiy Pop P One', sans-serif"
            color="#fff"
            textShadow=" 0 0 8px #000, 0 0 8px #000"
            mb="150px"
          >
            Shooter Game
          </Text>

          <Input
            placeholder="Enter your user name..."
            bg="#fafafa"
            w={300}
            borderColor="#585858"
            borderWidth={2}
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
          <Button mt={5} onClick={handleAddingUser} isLoading={loading}>
            Start Game
          </Button>
        </Flex>
      )}
    </>
  );
};

export default GameScreen;
