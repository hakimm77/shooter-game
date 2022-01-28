export interface PlayerType {
  name: string;
  x: number;
  y: number;
  direction: number;
  fire: {
    x: number;
    y: number;
    isFired: boolean;
  };
  health: number;
}
