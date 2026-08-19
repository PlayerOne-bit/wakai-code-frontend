import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = { id: string; email: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredAuth() {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      const storedExpiresAt = await AsyncStorage.getItem('expiresAt');

      const isExpired = !storedExpiresAt || Date.now() > Number(storedExpiresAt);

      if (storedToken && storedUser && !isExpired) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else if (storedToken) {
        await AsyncStorage.multiRemove(['token', 'user', 'expiresAt']);
      }
      setIsLoading(false);
    }
    loadStoredAuth();
  }, []);

  async function login(newUser: User, newToken: string) {
    const expiresAt = Date.now() + THIRTY_DAYS_MS;
    setUser(newUser);
    setToken(newToken);
    await AsyncStorage.setItem('token', newToken);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    await AsyncStorage.setItem('expiresAt', expiresAt.toString());
  }

  async function logout() {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove(['token', 'user', 'expiresAt']);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}