import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'
import { Purchase } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const purchases: Purchase[] = await prisma.purchase.findMany();
        
        if (!purchases) {
            throw new Error('Nenhuma ordem encontrada');
        }

        return NextResponse.json(purchases);
    } catch (error) {
        console.error('Erro ao buscar ordens: ', error);
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
                supplier: data.supplier,
                product: data.product,
                quantity: data.quantity,
                value: data.value,
                delivery_date: data.delivery_date,
                status: 'Solicitada',
                department: data.department,
                observations: data.observations
            },
        });
        return NextResponse.json(newPurchase, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar ordem: ', error);
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
        console.error('Erro ao editar ordem: ', error);
        return NextResponse.json({ error: 'Erro ao editar ordem: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
    const { id }: Purchase = await request.json();
    try {
        await prisma.purchase.delete({
            where: { id: id },
        });
        return NextResponse.json({ id: id, message: 'Ordem deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar ordem: ', error);
        return NextResponse.json({ error: 'Erro ao deletar ordem: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
