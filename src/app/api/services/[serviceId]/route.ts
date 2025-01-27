import { NextResponse } from 'next/server'

import {
    PrismaClient,
} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: Promise<{ serviceId: string }> }) {
    const { serviceId } = await params;

    if (!serviceId) {
        return NextResponse.json({ error: 'ID do Serviço não fornecido' }, { status: 404 });
    }

    try {
        const service = await prisma.service.findUnique({
            where: {
                id: serviceId
            }
        })

        if (!service) {
            return NextResponse.json({ error: 'Serviço não encontrado' }, { status: 404 });
        }

        return NextResponse.json({ service }, { status: 200 })
    } catch (error) {
        console.error('Erro ao buscar serviço: '+ error)
        return NextResponse.json({ error: 'Erro ao buscar serviço: ' + error }, { status: 500 })
    } finally {
        await prisma.$disconnect();
    }
}