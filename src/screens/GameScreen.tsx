import React, { useEffect, useRef, useState } from "react";
import { Button, Flex, Image, Input, Text } from "@chakra-ui/react";
import { PlayerType } from "../types";
import { io } from "socket.io-client";
import PlayerComponent from "../components/PlayerComponent";

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
            <PlayerComponent
              player={player}
              players={players}
              playerIndex={players.indexOf(player)}
            />
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
