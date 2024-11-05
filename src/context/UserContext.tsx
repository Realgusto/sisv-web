import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definindo a interface para o usuário
interface User {
  id: string;
  name: string;
  // Adicione outros campos conforme necessário
}

// Definindo a interface para o contexto do usuário
interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Criando o contexto do usuário
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData); // Aqui você pode definir a lógica de login
  };

  const logout = () => {
    setUser(null); // Lógica para logout
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para usar o contexto do usuário
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
