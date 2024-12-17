'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, Lock } from 'lucide-react'
import { User as UserType, useUser } from '@/contexts/UserContext'
import FourEasyIcon from '@/components/FourEasyIcon'
import md5 from 'md5'

export default function LoginPage() {
  const { login } = useUser()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: md5(password.toUpperCase()) })
      })
      console.log(response)
      const userData: UserType | null = response.ok ? await response.json() : null
      if (userData) {
        login(userData)
      } else {
        setError('Usuário ou senha inválidos')
      }
    } catch (error) {
      setError('Erro ao tentar fazer login')
      console.error("Erro ao fazer login: "+ error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-8 bg-background">
      <Card className="w-full max-w-md rounded-lg shadow-lg bg-secondary border-border p-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <FourEasyIcon className="w-16 h-16 mb-6" />
          <h1 className="text-3xl font-bold text-foreground">Acesso Restrito</h1>
          <p className="text-muted-foreground">Por favor, entre na sua conta.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-destructive text-sm text-center">{error}</p>}
          <div className="flex flex-col">
            <label className={`text-muted-foreground mb-1`} htmlFor="email">E-mail</label>
            <div className={`flex items-center focus:border-transparent border rounded-lg border-gray-400 p-1.5 ${isEmailFocused && 'ring-2 ring-ring'}`}>
              <User className="h-5 w-5 mr-2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 focus:outline-none rounded-md p-2 transition duration-200 bg-secondary text-foreground`}
                required
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className={`text-muted-foreground mb-1`} htmlFor="password">Senha</label>
            <div className={`flex items-center focus:border-transparent border rounded-lg border-gray-400 p-1.5 ${isPasswordFocused && 'ring-2 ring-ring'}`}>
              <Lock className="h-5 w-5 mr-2 text-muted-foreground" />
              <input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                onChange={(e) => setPassword(e.target.value)}
                className={`flex-1 focus:outline-none rounded-md p-2 transition duration-200 bg-secondary text-foreground`}
                required
              />
            </div>
          </div>
          <Button type="submit" className={`w-full h-12 bg-primary hover:bg-primary/80 transition duration-200 text-white font-semibold rounded-md p-2`} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <a href="#" className="hover:underline text-foreground">Esqueceu a senha?</a>
        </div>
        <div className="mt-4 text-center">
          <p className="text-muted-foreground">Não tem uma conta? <a href="#" className="hover:underline text-foreground">Registre-se</a></p>
        </div>
        <div className="mt-6 select-none text-center text-xs text-muted-foreground">
          4easy Tecnologia. Todos os direitos reservados.
        </div>
      </Card>
    </div>
  );
}