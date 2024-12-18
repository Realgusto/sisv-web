import { NextResponse } from 'next/server'

import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const data = await request.json()
    const { email, password }: User = data
    
    try {
        if (!email || !password) {
            return NextResponse.json({ message: 'E-mail e senha são obrigatórios' }, { status: 400 })
        }

        const users = await prisma.user.findUnique({
            where: {
                email,
                password
            }
        })
        
        if (!users) {
            return NextResponse.json({ message: 'E-mail ou senha inválidos' }, { status: 401 })
        }

        return NextResponse.json(users, { status: 200 })
    } catch (err) {
        console.error('Erro ao fazer login: ' + err)
        return NextResponse.json({ error: 'Erro ao fazer login: ' + err }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}