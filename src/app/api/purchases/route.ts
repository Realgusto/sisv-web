import { NextResponse } from 'next/server'

import {
    Status,
    PrismaClient,
    Purchase
} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const url = new URL(request.url)
    const page = url.searchParams.get('page')

    let purchases: Purchase[]

    try {
        if (page === 'order') {
            purchases = await prisma.purchase.findMany({
                where: {
                    status: { notIn: [ Status.Aberta, Status.Cancelada ]}
                }
            })
        } else if (page === 'budget') {
            purchases = await prisma.purchase.findMany({
                where: {
                    status: Status.Aberta
                }
            })
        } else {
            purchases = await prisma.purchase.findMany()
        }
        
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
        await prisma.purchase.update({
            where: { id: id },
            data: {
                status: Status.Cancelada
            }
        });

        return NextResponse.json({ id: id, message: 'Ordem cancelada com sucesso' });
    } catch (error) {
        console.error('Erro ao cancelar ordem: ' + error);
        return NextResponse.json({ error: 'Erro ao cancelar ordem: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
