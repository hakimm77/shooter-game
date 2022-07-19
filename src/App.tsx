import React, { useContext, useEffect, useState } from "react";
import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import GameScreen from "./screens/GameScreen";
import { LoginContext } from "./hooks/LoginContext";
import Login from "./screens/Login";
import { PlayerType } from "./types";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        userSelect: "none",
      },
    },
  },
});

const App = () => {
  const [begin, setBegin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>("");

  return (
    <ChakraProvider theme={theme}>
      <LoginContext.Provider
        value={{ username, setUsername, begin, setBegin, loading, setLoading }}
      >
        {begin ? <GameScreen /> : <Login />}
      </LoginContext.Provider>
    </ChakraProvider>
  );
};

export default App;
