import { createContext, useContext, useState, useEffect } from "react";
import { UserDto } from "../constants/types";
import { LoginPage } from "../pages/login-page/login-page";
import { Loader } from "@mantine/core";

const currentUser = "currentUser";

type AuthState = {
  user: UserDto | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  refetchUser: () => void;
  isAuthenticated: boolean;
};

const INITIAL_STATE: AuthState = {
  user: null,
  login: () => {},
  logout: () => {},
  refetchUser: () => {},
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthState>(INITIAL_STATE);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = sessionStorage.getItem(currentUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string) => {
    const mockUser: UserDto = {
      id: 1,
      firstName: "Mock",
      lastName: "User",
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    sessionStorage.setItem(currentUser, JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem(currentUser);
  };

  const refetchUser = () => {
    const storedUser = sessionStorage.getItem(currentUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        refetchUser,
        isAuthenticated,
      }}
    >
      {isAuthenticated ? children : <LoginPage fetchCurrentUser={refetchUser} />}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthState {
  return useContext(AuthContext);
}

export function useUser(): UserDto {
  const { user } = useContext(AuthContext);
  if (!user) {
    throw new Error(`useUser must be used within an authenticated app`);
  }
  return user;
}