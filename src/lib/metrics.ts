// import { prisma } from './db';
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

export async function getTotalVendasMes(): Promise<number> {
  // Versão com Prisma (comentada)
  /*
  const inicio = startOfMonth(new Date());
  const fim = endOfMonth(new Date());

  const vendas = await prisma.venda.aggregate({
    where: {
      dataCriacao: {
        gte: inicio,
        lte: fim,
      },
    },
    _sum: {
      valorTotal: true,
    },
  });

  return vendas._sum.valorTotal || 0;
  */

  // Versão com dados mocados
  return MOCK_DATA.vendasMensais;
}

export async function getClientesAtivos(): Promise<number> {
  // Versão com Prisma (comentada)
  /*
  const ultimoMes = subMonths(new Date(), 1);
  
  const clientes = await prisma.cliente.count({
    where: {
      ultimaCompra: {
        gte: ultimoMes,
      },
      ativo: true,
    },
  });

  return clientes;
  */

  // Versão com dados mocados
  return MOCK_DATA.clientesAtivos;
}

export async function getProdutosEmEstoque(): Promise<number> {
  // Versão com Prisma (comentada)
  /*
  const produtos = await prisma.produto.aggregate({
    where: {
      quantidadeEstoque: {
        gt: 0,
      },
    },
    _sum: {
      quantidadeEstoque: true,
    },
  });

  return produtos._sum.quantidadeEstoque || 0;
  */

  // Versão com dados mocados
  return MOCK_DATA.produtosEstoque;
}

export async function getCrescimentoMensal(): Promise<number> {
  // Versão com Prisma (comentada)
  /*
  const mesAtual = startOfMonth(new Date());
  const mesAnterior = startOfMonth(subMonths(new Date(), 1));
  
  const vendasMesAtual = await prisma.venda.aggregate({
    where: {
      dataCriacao: {
        gte: mesAtual,
      },
    },
    _sum: {
      valorTotal: true,
    },
  });

  const vendasMesAnterior = await prisma.venda.aggregate({
    where: {
      dataCriacao: {
        gte: mesAnterior,
        lt: mesAtual,
      },
    },
    _sum: {
      valorTotal: true,
    },
  });

  const valorAtual = vendasMesAtual._sum.valorTotal || 0;
  const valorAnterior = vendasMesAnterior._sum.valorTotal || 0;

  if (valorAnterior === 0) return 0;
  
  return Math.round(((valorAtual - valorAnterior) / valorAnterior) * 100);
  */

  // Versão com dados mocados
  return Math.round(Math.random() * 40 - 20); // Crescimento variável com possibilidade de negativo
}

export async function getVendasUltimos12Meses(): Promise<VendasMensais[]> {
  // Versão com Prisma (comentada)
  /*
  const meses = Array.from({ length: 12 }, (_, i) => {
    const data = subMonths(new Date(), i);
    return {
      inicio: startOfMonth(data),
      fim: endOfMonth(data),
      mes: format(data, 'MMM', { locale: ptBR }),
    };
  }).reverse();

  const vendas = await Promise.all(
    meses.map(async ({ inicio, fim, mes }) => {
      const resultado = await prisma.venda.aggregate({
        where: {
          dataCriacao: {
            gte: inicio,
            lte: fim,
          },
        },
        _sum: {
          valorTotal: true,
        },
      });

      return {
        mes,
        valor: resultado._sum.valorTotal || 0,
      };
    })
  );

  return vendas;
  */

  // Versão com dados mocados
  return MOCK_DATA.historicoVendas;
}

export async function getTicketMedio() {
  // Retorna o valor médio das vendas
  return 450.75; // Implemente a lógica real do banco de dados
}

export async function getProdutosMaisVendidos() {
  // Retorna os top 5 produtos mais vendidos - Nome até 8 caracteres
  return [
    { nome: 'Prod. A', quantidade: 150 },
    { nome: 'Prod. B', quantidade: 120 },
    { nome: 'Prod. C', quantidade: 198 },
    { nome: 'Prod. D', quantidade: 67 },
    { nome: 'Prod. E', quantidade: 245 }
    // ...
  ];
}

export async function getClientesInativos() {
  // Clientes sem compras nos últimos 30 dias
  return 45; // Implemente a lógica real
}

export async function getTaxaConversao() {
  // Taxa de conversão de visitas em vendas
  return 23.5; // Implemente a lógica real
}

export async function getLucratividade() {
  // Percentual de lucro médio
  return 32.8; // Implemente a lógica real
} 