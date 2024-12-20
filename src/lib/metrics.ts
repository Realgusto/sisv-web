import FetchAPI from '@/utils/fetch-api';
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
      const response = await FetchAPI({
        URL: `${baseURL}/api/overview?id=${id}`,
        method: 'GET'
      })

      // const response = await fetch(`${baseURL}/api/overview?id=${id}`, {
      //     method: 'GET',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Authorization': '430ec2fc-5060-414b-aa41-7747d507e892',
      //     },
      // })

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

export function getCrescimentoMensal(actualValue: number, pastValue: number) {
  if (pastValue === 0) return 0;

  return Math.round(((actualValue - pastValue) / pastValue) * 100);

  // Versão com dados mocados
  // return Math.round(Math.random() * 40 - 20); // Crescimento variável com possibilidade de negativo
}