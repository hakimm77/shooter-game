import React, { useContext, useEffect, useState } from "react";
import { Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import { PlayerType } from "../types";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const GameScreen = () => {
  const [players, setPlayers] = useState<Array<PlayerType>>([]);
  const [userName, setUserName] = useState<string>("");
  const [begin, setBegin] = useState(false);
  const [loading, setLoading] = useState(false);
  const playerIndex = players.indexOf(
    players.filter((e) => e.name === userName)[0]
  );

  onkeydown = (e) => {
    if (begin && playerIndex >= 0) {
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
          console.log("space bar");
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

          break;
      }
    }
  };

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
    socket.on("update-players", (res) => {
      if (res) {
        setPlayers(res);
      }
    });
  }, []);

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
