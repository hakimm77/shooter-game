import React, { useContext } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { LoginContext } from "../hooks/LoginContext";
import { io } from "socket.io-client";

const socket = io("/");

const Login = () => {
  const { username, setUsername, setBegin, loading, setLoading } =
    useContext(LoginContext);

  const handleAddingUser = async () => {
    if (username) {
      setLoading(true);

      socket.emit("new-user", {
        name: username,
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

  return (
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
        onChange={(e: any) => {
          setUsername(e.target.value);
        }}
      />
      <Button mt={5} onClick={handleAddingUser} isLoading={loading}>
        Start Game
      </Button>
    </Flex>
  );
};

export default Login;
