'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, Lock } from 'lucide-react'
import { User as UserType, useUser } from '@/contexts/UserContext'

export default function LoginPage() {
  const { login } = useUser()
  
  const { resolvedTheme } = useTheme()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (username === 'admin' && password === 'senha123') {
        const userData: UserType = { id: 1, name: username, token: '4easyTokenTester' }
        setTimeout(() => {
          login(userData)
          setLoading(false)
        }, 2000)
      } else {
        setError('Usuário ou senha inválidos')
      }
    } catch (error) {
      console.error("Erro ao fazer login: ", error)
    }   
  }

  return (
    <div className={`min-h-screen flex justify-center items-center p-8 ${resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Card className={`w-full max-w-md rounded-lg shadow-lg ${resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} p-10`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-700'}`}>Acesso Restrito</h1>
          <p className={`text-gray-500 ${resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Por favor, entre na sua conta.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <div className="flex flex-col">
            <label className={`text-gray-500 mb-1 ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="username">Usuário</label>
            <div className="flex items-center border rounded-lg border-gray-400 p-1.5">
              <User className={`h-5 w-5 mr-2 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              <input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 transition duration-200 ${resolvedTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-900'}`}
                required
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className={`text-gray-500 mb-1 ${resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} htmlFor="password">Senha</label>
            <div className="flex items-center border rounded-lg border-gray-400 p-1.5">
              <Lock className={`h-5 w-5 mr-2 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2 transition duration-200 ${resolvedTheme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-900'}`}
                required
              />
            </div>
          </div>
          <Button type="submit" className={`w-full ${resolvedTheme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'} transition duration-200 text-white font-semibold rounded-md p-2`} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className={`hover:underline ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Esqueceu a senha?</a>
        </div>
        <div className="mt-4 text-center">
          <p className={`text-gray-600 ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Não tem uma conta? <a href="#" className={`hover:underline ${resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Registre-se</a></p>
        </div>
        <div className={`mt-6 select-none text-center text-xs ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          4easy Tecnologia. Todos os direitos reservados.
        </div>
      </Card>
    </div>
  );
}