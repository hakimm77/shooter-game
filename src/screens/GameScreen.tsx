import React, { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { PlayerType } from "../types";
import Player from "../components/Player";

const GameScreen: React.FC = () => {
  const [players, setPlayers] = useState<Array<PlayerType>>([
    {
      name: "hakim",
      x: 100,
      y: 100,
    },
    {
      name: "nassim",
      x: 150,
      y: 100,
    },
  ]);

  return (
    <Flex
      position="relative"
      w="100%"
      h="100vh"
      overflow="hidden"
      backgroundImage={require("../assets/game-screen-image.png")}
    >
      {players.map((player) => (
        <Player props={player} />
      ))}
    </Flex>
  );
};

export default GameScreen;
