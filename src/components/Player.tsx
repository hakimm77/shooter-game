import React, { useEffect, useState } from "react";
import { Flex, Image, Text } from "@chakra-ui/react";
import { PlayerType } from "../types";

interface PlayerCordsType {
  x: number;
  y: number;
}

const Player: React.FC<{ props: PlayerType }> = (props) => {
  const [playerCords, setPlayerCords] = useState<Array<PlayerCordsType>>([
    {
      x: props.props.x,
      y: props.props.y,
    },
  ]);
  const [direction, setDirection] = useState<number>(0);

  onkeydown = (e) => {
    switch (e.keyCode) {
      case 38:
        if (playerCords[0].y <= 0 - 10) break;
        setPlayerCords((p) => [{ x: p[0].x, y: p[0].y - 10 }]);
        setDirection(0);
        break;
      case 40:
        if (playerCords[0].y >= window.innerHeight - 50) break;
        setPlayerCords((p) => [{ x: p[0].x, y: p[0].y + 10 }]);
        setDirection(0.5);
        break;
      case 39:
        if (playerCords[0].x >= window.innerWidth - 50) break;
        setPlayerCords((p) => [{ x: p[0].x + 10, y: p[0].y }]);
        setDirection(0.25);
        break;
      case 37:
        if (playerCords[0].x <= 0 - 10) break;
        setPlayerCords((p) => [{ x: p[0].x - 10, y: p[0].y }]);
        setDirection(-0.25);
        break;
      case 32:
        console.log("space bar");
        break;
    }
  };

  useEffect(() => {}, [playerCords[0].x, playerCords[0].y]);

  return (
    <Flex
      position="absolute"
      flexDir="column"
      top={playerCords[0].y}
      left={playerCords[0].x}
      alignItems="center"
    >
      <Flex backgroundColor="rgba(0, 0, 0, 0.5)" margin={2} padding={0.5}>
        <Text color="white" fontSize={15}>
          {props.props.name}
        </Text>
      </Flex>

      <Image
        w={10}
        h={10}
        src={require("../assets/player-image.png")}
        transform={`rotate(${direction}turn)`}
      />
    </Flex>
  );
};

export default Player;
