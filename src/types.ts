import React from "react";

export interface PlayerType {
  name: string;
  x: number;
  y: number;
  direction: number;
  fire: boolean;
  health: number;
  id: string;
}

export interface PlayerComponentType {
  player: PlayerType;
}

export interface LoginContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  begin: boolean;
  setBegin: React.Dispatch<React.SetStateAction<boolean>>;
}
