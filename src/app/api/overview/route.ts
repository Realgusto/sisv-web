import { NextResponse } from 'next/server'

import {
    PrismaClient,
    Overview
} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const url = new URL(request.url)
    const id = url.searchParams.get('id')
    const companyId = url.searchParams.get('companyId')
    
    if (!id || !companyId) {
        return NextResponse.json({ error: 'ID ou ID da Empresa não fornecido' }, { status: 400 });
    }

    try {
        const overview: Overview | null = await prisma.overview.findUnique({
            where: {
                id: id,
                companyId: companyId
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
    const data: Overview & { cnpj: string } = await request.json()

    try {
        const company = await prisma.company.findUnique({
            where: {
                cnpj: data.cnpj
            }
        })

        if (!company) {
            return NextResponse.json({ error: 'CNPJ não encontrado' }, { status: 404 });
        }

        const newOverview = await prisma.overview.create({
            data: {
                id: data.id,
                companyId: company.id,
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
    const data: Overview & { cnpj: string } = await request.json();
    const { id } = data;

    try {
        const company = await prisma.company.findUnique({
            where: {
                cnpj: data.cnpj
            }
        })

        if (!company) {
            return NextResponse.json({ error: 'CNPJ não encontrado' }, { status: 404 });
        }

        const updatedOverview = await prisma.overview.update({
            where: {
                id: id,
                companyId: company.id
            },
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
    const { id, cnpj }: Overview & { cnpj: string } = await request.json();
    try {
        const company = await prisma.company.findUnique({
            where: { cnpj }
        })

        if (!company) {
            return NextResponse.json({ error: 'CNPJ não encontrado' }, { status: 404 });
        }

        const overview = await prisma.overview.findUnique({
            where: {
                id: id,
                companyId: company.id
            },
        });

        if (!overview) {
            return NextResponse.json({ error: 'Métricas não encontradas' }, { status: 404 });
        }

        await prisma.overview.delete({
            where: {
                id: id,
                companyId: company.id
            },
        });
        return NextResponse.json({ id: id, message: 'Métricas deletadas com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar métricas: ' + error);
        return NextResponse.json({ error: 'Erro ao deletar métricas: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
