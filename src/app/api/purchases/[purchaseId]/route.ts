import { NextResponse } from 'next/server'

import {
    PrismaClient,
} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: { purchaseId: string } }) {
    const { purchaseId } = await params;

    if (!purchaseId) {
        return NextResponse.json({ error: 'ID da Ordem não fornecido' }, { status: 404 });
    }

    try {
        const purchase = await prisma.purchase.findUnique({
            where: {
                id: purchaseId
            }
        })

        const items = await prisma.purchaseItems.findMany({
            where: {
                purchaseId: purchaseId
            }
        })

        if (!purchase) {
            return NextResponse.json({ error: 'Ordem não encontrada' }, { status: 404 });
        }

        if (!items) {
            return NextResponse.json({ error: 'Itens não encontrados' }, { status: 404 });
        }

        return NextResponse.json({ ...purchase, items }, { status: 200 })
    } catch (error) {
        console.error('Erro ao buscar ordens: '+ error)
        return NextResponse.json({ error: 'Erro ao buscar ordens: ' + error }, { status: 500 })
    } finally {
        await prisma.$disconnect();
    }
}