import React, { useContext, useEffect, useState } from "react";
import { ChakraProvider, extendTheme, Flex } from "@chakra-ui/react";
import GameScreen from "./screens/GameScreen";
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
  return (
    <ChakraProvider theme={theme}>
      <GameScreen />
    </ChakraProvider>
  );
};

export default App;
