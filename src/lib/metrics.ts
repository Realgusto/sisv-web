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

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export async function getMetrics(): Promise<MetricsType> {
  const id = String(new Date().getMonth() + 1) + new Date().getFullYear().toString()

  try {
      const response = await fetch(`${baseURL}/api/overview?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
      })

      if (!response.ok) {
          throw new Error('Erro ao buscar dados: ' + response.statusText)
      }

      const data: MetricsType = await response.json()
      
      return data || {} as MetricsType;
  } catch (error) {
      console.error(error)
      return {} as MetricsType;
  }
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

export function getCrescimentoMensal(lastYear: { mth: number, tot_sales: number }[]): number {
  const mesAtual = new Date().getMonth() + 1
  const mesAnterior = new Date().getMonth()

  // const lastYear: { mth: number, tot_sales: number }[] = JSON.parse(JSON.stringify(salesLastYear))
  const valorAtual = lastYear.find((sales) => sales.mth === mesAtual) || { tot_sales: 0 };
  const valorAnterior = lastYear.find((sales) => sales.mth === mesAnterior) || { tot_sales: 0 };

  if (valorAnterior.tot_sales === 0) return 0;

  return Math.round(((valorAtual.tot_sales - valorAnterior.tot_sales) / valorAnterior.tot_sales) * 100);

  // Versão com dados mocados
  // return Math.round(Math.random() * 40 - 20); // Crescimento variável com possibilidade de negativo
}