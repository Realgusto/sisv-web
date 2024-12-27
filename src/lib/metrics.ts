import FetchAPI from '@/utils/fetch-api'

export const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://sisv.vercel.app'

export async function getMetrics(): Promise<MetricsType> {
  const id = String(new Date().getMonth() + 1) + new Date().getFullYear().toString()

  try {
      const response = await FetchAPI({
        URL: `${baseURL}/api/overview?id=${id}`,
        method: 'GET'
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

export async function getCrescimentoMensal(actualValue: number, pastValue: number) {
  if (pastValue === 0) return 0

  return Math.round(((actualValue - pastValue) / pastValue) * 100)
}