import { NextResponse } from 'next/server'

import {
    Status,
    PrismaClient,
    Purchase
} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const purchases: Purchase[] = await prisma.purchase.findMany();
        
        if (!purchases) {
            NextResponse.json({ error: 'Nenhuma ordem encontrada' }, { status: 404 });
        }

        return NextResponse.json(purchases, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar ordens: '+ error);
        return NextResponse.json({ error: 'Erro ao buscar ordens: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    const data: Purchase = await request.json();
    try {
        const newPurchase = await prisma.purchase.create({
            data: {
                date: new Date(),
                user_id: data.user_id,
                supplier: data.supplier,
                product: data.product,
                quantity: data.quantity,
                value: data.value,
                delivery_date: data.delivery_date,
                status: data.status || Status.Aberta,
                department: data.department,
                observations: data.observations
            },
        });
        return NextResponse.json(newPurchase, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar ordem: '+ error);
        return NextResponse.json({ error: 'Erro ao criar ordem: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request: Request) {
    const data: Purchase = await request.json();
    const { id } = data;
    try {
        const updatedPurchase = await prisma.purchase.update({
            where: { id: id },
            data: {
                supplier: data.supplier,
                product: data.product,
                quantity: data.quantity,
                value: data.value,
                delivery_date: data.delivery_date,
                status: data.status,
                department: data.department,
                observations: data.observations
            },
        });
        return NextResponse.json(updatedPurchase);
    } catch (error) {
        console.error('Erro ao editar ordem: '+ error);
        return NextResponse.json({ error: 'Erro ao editar ordem: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
    const { id }: Purchase = await request.json();
    try {
        // Verifica se o registro existe
        const purchase = await prisma.purchase.findUnique({
            where: { id: id },
        });

        if (!purchase) {
            return NextResponse.json({ error: 'Ordem não encontrada' }, { status: 404 });
        }

        await prisma.purchase.delete({
            where: { id: id },
        });
        return NextResponse.json({ id: id, message: 'Ordem deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar ordem: ' + error);
        return NextResponse.json({ error: 'Erro ao deletar ordem: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
