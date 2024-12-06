import { PrismaClient } from '@prisma/client';
import { subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Dados mocados para teste
const MOCK_DATA = {
  vendasMensais: 45678.90,
  clientesAtivos: 142,
  produtosEstoque: 567,
  historicoVendas: Array.from({ length: 12 }, (_, i) => ({
    mes: format(subMonths(new Date(), i), 'MMM', { locale: ptBR }),
    valor: Math.random() * 50000 + 30000, // Valores entre 30000 e 80000
  })).reverse(),
};

const prisma = new PrismaClient()

export async function getTotalVendasMes(): Promise<number> {  
  const id = String(new Date().getMonth() + 1) + new Date().getFullYear().toString()

  const sales = await prisma.overview.findUnique({
    where: {
      id: id
    },
  });

  return sales?.salesMonthly || 0;

  // Versão com dados mocados
  // return MOCK_DATA.vendasMensais;
}

export async function getClientesAtivos(): Promise<number> {
  const id = String(new Date().getMonth() + 1) + new Date().getFullYear().toString()

  const customer = await prisma.overview.findUnique({
    where: {
      id: id
    },
  });

  return customer?.activeCustomers || 0;

  // Versão com dados mocados
  // return MOCK_DATA.clientesAtivos;
}

export async function getProdutosEmEstoque(): Promise<number> {
  // const id = String(new Date().getMonth() + 1) + new Date().getFullYear().toString()

  // const products = await prisma.overview.findUnique({
  //   where: {
  //     id: id
  //   },
  // });

  // return products?.   estoque  || 0;

  // Versão com dados mocados
  return MOCK_DATA.produtosEstoque;
}

export async function getCrescimentoMensal(): Promise<number> {
  const mesAtual = new Date().getMonth() + 1
  const mesAnterior = new Date().getMonth()

  const id = String(new Date().getMonth() + 1) + new Date().getFullYear().toString()

  const sales = await prisma.overview.findUnique({
    where: {
      id: id
    },
  });

  const lastYear: { mth: number, tot_sales: number }[]  = JSON.parse(JSON.stringify(sales?.salesLastYear))
  const valorAtual = lastYear.find((sales) => sales.mth === mesAtual) || { tot_sales: 0 };
  const valorAnterior = lastYear.find((sales) => sales.mth === mesAnterior) || { tot_sales: 0 };

  if (valorAnterior.tot_sales === 0) return 0;

  return Math.round(((valorAtual.tot_sales - valorAnterior.tot_sales) / valorAnterior.tot_sales) * 100);

  // Versão com dados mocados
  // return Math.round(Math.random() * 40 - 20); // Crescimento variável com possibilidade de negativo
}

export async function getVendasUltimos12Meses(): Promise<VendasMensais[]> {
  const id = String(new Date().getMonth() + 1) + new Date().getFullYear().toString()

  const sales = await prisma.overview.findUnique({
    where: {
      id: id
    },
  });

  const lastYear: { mth: number, tot_sales: number }[]  = JSON.parse(JSON.stringify(sales?.salesLastYear))

  return lastYear.map((sales) => {
    return {
      mes: format(new Date(new Date().getFullYear(), sales.mth - 1), 'MMMM', { locale: ptBR }),
      valor: sales.tot_sales,
    }
  }) || [];

  // Versão com dados mocados
  // return MOCK_DATA.historicoVendas;
}

export async function getTicketMedio() {
  const id = String(new Date().getMonth() + 1) + new Date().getFullYear().toString()

  const ticket = await prisma.overview.findUnique({
    where: {
      id: id
    },
  });

  return ticket?.averageTicket || 0;
}

export async function getProdutosMaisVendidos(): Promise<{ nome: string, quantidade: number, fill: string }[]> {
  const id = String(new Date().getMonth() + 1) + new Date().getFullYear().toString()

  const sales = await prisma.overview.findUnique({
    where: {
      id: id
    },
  });

  const top5: { product: string, un: string, amount: number }[] = JSON.parse(JSON.stringify(sales?.top5BestSeller))
  
  return top5.map((product, index) => {
    return {
      nome: product.product,
      quantidade: product.amount,
      fill: 'hsl(var(--chart-'+(index+1)+'))'
    }
  }) || [];

  // return [
  //   { nome: 'A', quantidade: 150, fill: 'hsl(var(--chart-1))' },
  //   { nome: 'B', quantidade: 120, fill: 'hsl(var(--chart-2))' },
  //   { nome: 'C', quantidade: 198, fill: 'hsl(var(--chart-3))' },
  //   { nome: 'D', quantidade: 67, fill: 'hsl(var(--chart-4))' },
  //   { nome: 'E', quantidade: 245, fill: 'hsl(var(--chart-5))' }
  // ];
}

export async function getClientesInativos() {
  const id = String(new Date().getMonth() + 1) + new Date().getFullYear().toString()

  const customer = await prisma.overview.findUnique({
    where: {
      id: id
    },
  });

  return customer?.inactiveCustomers || 0; // Implemente a lógica real
}

// export async function getTaxaConversao() {
//   // Taxa de conversão de visitas em vendas
//   return 23.5; // Implemente a lógica real
// }

export async function getLucratividade() {
  // Percentual de lucro médio
  return 32.8; // Implemente a lógica real
} 