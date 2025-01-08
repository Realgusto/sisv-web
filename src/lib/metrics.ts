import FetchAPI from '@/utils/fetch-api'

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://sisv.vercel.app'

export async function getMetrics(companyId: string): Promise<MetricsType> {
  if (companyId === '') {
    throw new Error('ID da empresa não informado')
  }
  
  const id = (new Date().getMonth() + 1).toString().padStart(2, '0') + new Date().getFullYear().toString()
  
  console.log(`Consultando em: ${baseURL}/api/overview?id=${id}&companyId=${companyId}`)
  try {
      const response = await FetchAPI({
        URL: `${baseURL}/api/overview?id=${id}&companyId=${companyId}`,
        method: 'GET'
      })

      if (!response.ok) {
          throw new Error('Erro ao buscar dados: ' + response.statusText)
      }

      const data: MetricsType = await response.json()
      
      return data || {
        activeCustomers: 0,
        salesMonthly: 0,
        salesLastYear: [],
        top5BestSeller: [],
        averageTicket: 0,
        inactiveCustomers: 0,
        expenses: 0,
        shopping: 0,
        receipt: 0,
        payment: 0
      } as MetricsType;
  } catch (error) {
      console.error(error)
      return {
        activeCustomers: 0,
        salesMonthly: 0,
        salesLastYear: [],
        top5BestSeller: [],
        averageTicket: 0,
        inactiveCustomers: 0,
        expenses: 0,
        shopping: 0,
        receipt: 0,
        payment: 0
      } as MetricsType;
  }
}

export async function getCrescimentoMensal(actualValue: number, pastValue: number) {
  if (pastValue === 0) return 0

  return Math.round(((actualValue - pastValue) / pastValue) * 100)
}