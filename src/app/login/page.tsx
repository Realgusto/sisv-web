"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import Cookies from 'js-cookie'
import { Mail, Lock } from 'lucide-react'
import { TOKEN_KEY } from '@/constants'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const userData = await new Promise((resolve) => 
        setTimeout(() => resolve({ id: 1, name: email, token: 'abc123' }), 2000)
      );
      Cookies.set(TOKEN_KEY, userData.token, { expires: 7 });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <motion.div 
        className="px-10 py-6 shadow-lg rounded-lg bg-white"
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
        <h3 className="text-base mb-8 text-center">Acesso ao sistema</h3>
        <div className="flex flex-row items-center mb-4">
          <Mail className="text-gray-400 mx-4" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-blue-300 focus:border-blue-500 transition duration-200"
          />
        </div>
        <div className="flex flex-row items-center mb-4">
          <Lock className="text-gray-400 mx-4" />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-blue-300 focus:border-blue-500 transition duration-200"
          />
        </div>
        <Button 
          onClick={handleLogin} 
          className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition duration-200`} 
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
        <div className="mt-8 select-none text-center text-xs text-gray-600">
          4easy Tecnologia. Todos os direitos reservados.
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
