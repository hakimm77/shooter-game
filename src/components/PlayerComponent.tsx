import { Flex, Image, Text } from "@chakra-ui/react";
import { PlayerComponentType } from "../types";

const PlayerComponent = ({ player }: PlayerComponentType) => {
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
