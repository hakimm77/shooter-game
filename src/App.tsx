import React from "react";
import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import GameScreen from "./screens/GameScreen";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#727272",
        userSelect: "none",
      },
    },
  },
});

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <GameScreen />
    </ChakraProvider>
  );
};

export default App;
