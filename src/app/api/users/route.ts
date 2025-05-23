import { NextResponse } from 'next/server'

import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')

    try {
        if (!id) {
            return NextResponse.json({ message: 'O campo "ID" é obrigatório' }, { status: 400 })
        }

        const users = await prisma.user.findUnique({ where: { id } })
        
        if (!users) {
            return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 401 })
        }

        return NextResponse.json(users, { status: 200 })
    } catch (err) {
        console.error('Erro ao buscar usuários: ' + err)
        return NextResponse.json({ error: 'Erro ao buscar usuários: ' + err }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST(request: Request) {
    const data: User = await request.json()
    try {
        const newUser = await prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
            },
        })
        return NextResponse.json(newUser, { status: 201 })
    } catch (error) {
        console.error('Erro ao criar usuário: ' + error)
        return NextResponse.json({ error: 'Erro ao criar usuário: ' + error }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function PUT(request: Request) {
    const data: User = await request.json()
    const { id } = data
    try {
        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: {
                email: data.email,
                name: data.name,
                password: data.password,
            },
        })
        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Erro ao editar usuário: ' + error)
        return NextResponse.json({ error: 'Erro ao editar usuário: ' + error }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}

export async function DELETE(request: Request) {
    const { id }: User = await request.json()
    try {
        await prisma.user.delete({
            where: { id: id },
        })
        return NextResponse.json({ id: id, message: 'Usuário deletado com sucesso' })
    } catch (error) {
        console.error('Erro ao deletar usuário: ' + error)
        return NextResponse.json({ error: 'Erro ao deletar usuário: ' + error }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}
