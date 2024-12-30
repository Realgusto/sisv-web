import { NextResponse } from 'next/server'

import {
    PrismaClient,
    Overview
} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    
    // Verifica se o ID é nulo ou indefinido
    if (!id) {
        return NextResponse.json({ error: 'ID não fornecido' }, { status: 400 });
    }

    try {
        const overview: Overview | null = await prisma.overview.findUnique({
            where: {
                id: id
            }
        });
        
        if (!overview) {
            return NextResponse.json({ error: 'Nenhuma métrica encontrada' }, { status: 404 });
        }

        return NextResponse.json(overview, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar métricas: '+ error);
        return NextResponse.json({ error: 'Erro ao buscar métricas: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    const data: Overview = await request.json()

    try {
        const newOverview = await prisma.overview.create({
            data: {
                id: data.id,
                salesMonthly: data.salesMonthly,
                averageTicket: data.averageTicket,
                salesLastYear: JSON.parse(JSON.stringify(data.salesLastYear)),
                top5BestSeller: JSON.parse(JSON.stringify(data.top5BestSeller)),
                activeCustomers: data.activeCustomers,
                inactiveCustomers: data.inactiveCustomers,
                expenses: data.expenses,
                shopping: data.shopping,
                receipt: data.receipt, 
                payment: data.payment,
            }
        })
        return NextResponse.json(newOverview, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar métricas: '+ error);
        return NextResponse.json({ error: 'Erro ao criar métricas: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request: Request) {
    const data: Overview = await request.json();
    const { id } = data;

    try {
        const updatedOverview = await prisma.overview.update({
            where: { id: id },
            data: {
                salesMonthly: data.salesMonthly,
                averageTicket: data.averageTicket,
                salesLastYear: JSON.parse(JSON.stringify(data.salesLastYear)),
                top5BestSeller: JSON.parse(JSON.stringify(data.top5BestSeller)),
                activeCustomers: data.activeCustomers,
                inactiveCustomers: data.inactiveCustomers,
                expenses: data.expenses,
                shopping: data.shopping,
                receipt: data.receipt, 
                payment: data.payment,
            },
        });
        return NextResponse.json(updatedOverview);
    } catch (error) {
        console.error('Erro ao editar métricas: '+ error);
        return NextResponse.json({ error: 'Erro ao editar métricas: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
    const { id }: Overview = await request.json();
    try {
        // Verifica se o registro existe
        const overview = await prisma.overview.findUnique({
            where: { id: id },
        });

        if (!overview) {
            return NextResponse.json({ error: 'Métricas não encontradas' }, { status: 404 });
        }

        await prisma.overview.delete({
            where: { id: id },
        });
        return NextResponse.json({ id: id, message: 'Métricas deletadas com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar métricas: ' + error);
        return NextResponse.json({ error: 'Erro ao deletar métricas: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
