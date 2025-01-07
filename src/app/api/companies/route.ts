import { NextResponse } from 'next/server'

import { Company, PrismaClient, UserCompany } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    try {
        if (!userId) {
            return NextResponse.json({ message: 'O campo "userId" é obrigatório' }, { status: 400 })
        }

        const companies = await prisma.userCompany.findMany({
            where: { userId },
            relationLoadStrategy: 'join',
            select: {                
                Company: {
                    select: {
                        id: true,
                        cnpj: true,
                        name: true,
                        fantasy: true,
                        address: true,
                        phone: true,
                        email: true,
                        city: true,
                        state: true,
                        active: true,
                        updated_at: true,
                    }
                }
            }
        })
        
        if (!companies) {
            return NextResponse.json({ message: 'Empresa(s) não encontrada(s)' }, { status: 401 })
        }

        const companiesData = companies.map((company: { Company: Company }) => company.Company)

        return NextResponse.json(companiesData, { status: 200 })
    } catch (err) {
        console.error('Erro ao buscar empresa(s): ' + err)
        return NextResponse.json({ error: 'Erro ao buscar empresa(s): ' + err }, { status: 500 })
    } finally {
        await prisma.$disconnect()
    }
}