import { NextResponse } from 'next/server'

import {
    PrismaClient,
    Service,
    StatusService
} from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const url = new URL(request.url)
    const companyId = url.searchParams.get('companyId')

    if (!companyId) {
        return NextResponse.json({ error: 'ID da Empresa não fornecido' }, { status: 400 });
    }

    try {
        const services = await prisma.service.findMany({
            where: {
                companyId: companyId,
                status: {
                    not: StatusService.Cancelada
                }
            }
        })
        
        if (!services) {
            return NextResponse.json({ error: 'Nenhum serviço encontrado' }, { status: 404 });
        }

        return NextResponse.json(services, { status: 200 })
    } catch (error) {
        console.error('Erro ao buscar serviços: '+ error)
        return NextResponse.json({ error: 'Erro ao buscar serviços: ' + error }, { status: 500 })
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    const data: Service = await request.json()

    try {
        const newService = await prisma.service.create({
            data,
        })

        return NextResponse.json({ newService }, { status: 201 })
    } catch (error) {
        console.error('Erro ao criar serviço: '+ error)
        return NextResponse.json({ error: 'Erro ao criar serviço: ' + error }, { status: 500 })
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(request: Request) {
    const data: Service = await request.json();
    const { id, companyId } = data;

    if (!id) {
        return NextResponse.json({ error: 'ID do Serviço não fornecido' }, { status: 400 });
    }

    if (!companyId) {
        return NextResponse.json({ error: 'ID da Empresa não fornecido' }, { status: 400 });
    }

    try {
        const updatedService = await prisma.service.update({
            where: {
                id: id,
                companyId: companyId
            },
            data,
        });

        return NextResponse.json({ updatedService }, { status: 200 });
    } catch (error) {
        console.error('Erro ao editar serviço: '+ error);
        return NextResponse.json({ error: 'Erro ao editar serviço: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
    const { id, companyId }: Service = await request.json();
    try {
        await prisma.service.update({
            where: {
                id: id,
                companyId: companyId
            },
            data: {
                status: StatusService.Cancelada
            }
        });

        return NextResponse.json({ id: id, message: 'Serviço cancelado com sucesso' });
    } catch (error) {
        console.error('Erro ao cancelar serviço: ' + error);
        return NextResponse.json({ error: 'Erro ao cancelar serviço: ' + error }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
