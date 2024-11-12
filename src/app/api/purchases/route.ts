import { NextResponse } from 'next/server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    try {
        const orders = await prisma.purchase.findMany();
        return NextResponse.json(orders);
    } catch (error) {
        console.error('Erro ao buscar ordens: ', error);
        return NextResponse.json({ error: 'Erro ao buscar ordens: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    const data = await request.json();
    try {
        const newOrder = await prisma.purchase.create({
            data: {
                date: new Date(),
                supplier: data.supplier,
                product: data.product,
                quantity: data.quantity,
                value: data.value,
                delivery_date: data.delivery_date,
                status: 'Solicitada',
            },
        });
        return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
        console.error('Erro ao criar ordem: ', error);
        return NextResponse.json({ error: 'Erro ao criar ordem: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request: Request) {
    const data = await request.json();
    const { id } = data;
    try {
        const updatedOrder = await prisma.purchase.update({
            where: { id: id },
            data: {
                supplier: data.supplier,
                product: data.product,
                quantity: data.quantity,
                value: data.value,
                delivery_date: data.delivery_date,
                status: data.status,
            },
        });
        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error('Erro ao editar ordem: ', error);
        return NextResponse.json({ error: 'Erro ao editar ordem: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    try {
        await prisma.purchase.delete({
            where: { id: id },
        });
        return NextResponse.json({ message: 'Ordem deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar ordem: ', error);
        return NextResponse.json({ error: 'Erro ao deletar ordem: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
