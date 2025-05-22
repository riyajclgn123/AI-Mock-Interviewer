import { createContext, useContext, useEffect, useState } from "react";
import api from "../config/axios";
import { UserDto } from "../constants/types";

type AuthContextType = {
  user: UserDto | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);

  const login = async (username: string, password: string) => {
  try {
    const response = await api.post<UserDto>("/api/login", { username, password });
    setUser(response.data);
    localStorage.setItem("user", JSON.stringify(response.data));
  } catch (err) {
    console.error("Login failed:", err);
    throw err; // Let the caller handle it (e.g., show error message)
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useUser = () => useAuth().user!;
