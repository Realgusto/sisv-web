import { NextResponse } from 'next/server'

import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const data = await request.json()
    const { id, email, password }: User = data
    
    try {
        if (!id && (!email || !password)) {
            if (!email || !password) {
                return NextResponse.json({ message: 'E-mail e senha são obrigatórios' }, { status: 400 })
            } else {
                return NextResponse.json({ message: 'O campo "ID" é obrigatório' }, { status: 400 })
            }
        }

        let users: User | null = null;

        if (id) {
            users = await prisma.user.findUnique({
                where: { id: id }
            });
        } else if (email && password) {
            users = await prisma.user.findUnique({
                where: {
                    email,
                    password
                }
            });
        }
        
        if (!users) {
            return NextResponse.json({
                message: email && password ?
                  'E-mail ou senha inválidos'
                    :
                  'Usuário não encontrado'
                }, { status: 401 })
        }

        return NextResponse.json(users, { status: 200 })
    } catch (err) {
        console.error('Erro ao buscar usuários: ' + err)
        return NextResponse.json({ error: 'Erro ao buscar usuários: ' + err }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}