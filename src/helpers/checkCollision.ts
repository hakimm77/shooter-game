import { PlayerType } from "../types";

const checkCollision = (player1: PlayerType, player2: PlayerType) => {
  switch (player1.direction) {
    case 0.25:
      if (
        player1.x + 250 >= player2.x &&
        player1.x + 250 <= player2.x + 250 &&
        player1.y >= player2.y &&
        player1.y <= player2.y + 10
      ) {
        return true;
      } else {
        return false;
      }
      break;

    case -0.25:
      if (
        player1.x - 250 <= player2.x &&
        player1.x - 250 >= player2.x - 250 &&
        player1.y <= player2.y &&
        player1.y >= player2.y - 10
      ) {
        return true;
      } else {
        return false;
      }
      break;

    case 0:
      if (
        player1.y - 250 <= player2.y &&
        player1.y - 250 >= player2.y - 250 &&
        player1.x <= player2.x &&
        player1.x >= player2.x - 10
      ) {
        return true;
      } else {
        return false;
      }
      break;

    case 0.5:
      if (
        player1.y + 250 >= player2.y &&
        player1.y + 250 <= player2.y + 250 &&
        player1.x >= player2.x &&
        player1.x <= player2.x + 10
      ) {
        return true;
      } else {
        return false;
      }
      break;
  }
};

export default checkCollision;
