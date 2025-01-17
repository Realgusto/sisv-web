import { NextResponse } from 'next/server'

import {
    PrismaClient,
} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request, { params }: { params: Promise<{ companyId: string }> }) {
    const { companyId } = await params;

    if (!companyId) {
        return NextResponse.json({ error: 'ID da Empresa não fornecido' }, { status: 404 });
    }

    try {
        const company = await prisma.company.findUnique({
            where: {
                id: companyId
            }
        })

        if (!company) {
            return NextResponse.json({ error: 'Empresa não encontrada' }, { status: 404 });
        }

        return NextResponse.json({ ...company }, { status: 200 })
    } catch (error) {
        console.error('Erro ao buscar empresa: '+ error)
        return NextResponse.json({ error: 'Erro ao buscar empresa: ' + error }, { status: 500 })
    } finally {
        await prisma.$disconnect();
    }
}