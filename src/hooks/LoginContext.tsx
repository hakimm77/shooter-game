import { createContext } from "react";
import { LoginContextType } from "../types";

export const LoginContext = createContext<LoginContextType>({
  username: "",
  setUsername: () => {},
  loading: false,
  setLoading: () => {},
  begin: false,
  setBegin: () => {},
});
