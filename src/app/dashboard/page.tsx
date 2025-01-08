'use client'
import { useEffect, useState } from 'react';

import { DollarSign, Users, ShoppingCart, UserMinus, Banknote, Receipt } from 'lucide-react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SalesChart } from '@/components/SalesChart'
import { TopProductsChart } from '@/components/TopProductsChart'
import { cn } from '@/lib/utils'
import { getMetrics, getCrescimentoMensal } from '@/lib/metrics'
import { format } from 'date-fns'
import { useUser } from '@/contexts/UserContext'
import { ptBR } from 'date-fns/locale'
import TitleCompany from '@/components/TitleCompany'
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader';

export default function Dashboard() {
  const { push } = useRouter()
  const { companySelected } = useUser()

  const [overview, setOverview] = useState<MetricsType | null>(null);
  const [crescimentoMensal, setCrescimentoMensal] = useState(0);
  const [sales, setSales] = useState<MonthlySales[]>([]);
  const [topFive, setTopFive] = useState<bestSeller[]>([]);

  const CONTAINER_HEIGHT = cn('h-[220px] sm:h-[270px] md:h-[320px] lg:h-[370px] xl:h-[420px]')
  
  useEffect(() => {
    const fetchData = async () => {
      if (!companySelected || companySelected?.id === '') {
        push('/companies')
        return
      }
      
      const metrics = await getMetrics(companySelected.id)
      setOverview(metrics)

      const pastMonth = new Date().getMonth() === 0 ? 12 : new Date().getMonth()
      const pastSales = metrics.salesLastYear.find((value) => Number(value.mth) === pastMonth)
      const pastValue = pastSales ? pastSales.tot_sales : 0
      const actualValue = metrics.salesMonthly || 0

      const crescimento = await getCrescimentoMensal(actualValue, pastValue)
      setCrescimentoMensal(crescimento)

      const lastYear: { mth: number, tot_sales: number }[] = metrics.salesLastYear ? JSON.parse(JSON.stringify(metrics.salesLastYear)) : [];
      setSales(lastYear.map((sales) => {
        return {
          mes: format(new Date(new Date().getFullYear(), sales.mth - 1), 'MMMM', { locale: ptBR }),
          valor: sales.tot_sales,
        } 
      }))

      const top5: { product: string, un: string, amount: number }[] = metrics.top5BestSeller ? JSON.parse(JSON.stringify(metrics.top5BestSeller)) : [];

      setTopFive(top5.map((product, index) => {
        return {
          nome: product.product,
          unidade: product.un,
          quantidade: product.amount,
          fill: 'hsl(var(--chart-'+(index+1)+'))'
        }
      }))
    };

    fetchData()
  }, [])

  if (!overview) {
    return (
      <Loader />
    )
  }

  return (
    <div className="p-4 space-y-4 w-full max-w-full overflow-x-hidden">
      <TitleCompany />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Mensais</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(overview.salesMonthly)}
            </div>
            <CardDescription className="mt-2">
              <span className={crescimentoMensal >= 0 ? "text-green-500" : "text-red-500"}>
                {crescimentoMensal >= 0 ? '+' : ''}{crescimentoMensal}%
              </span>
              {' '}em relação ao mês anterior
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Intl.NumberFormat('pt-BR').format(overview.activeCustomers)}</div>
            <CardDescription className="mt-2">
              Número de clientes ativos no mês.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(overview.expenses)}</div>
            <CardDescription className="mt-2">
              Total de despesas no mês, incluindo todas as despesas fixas e variáveis.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Receber</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(overview.receipt)}
            </div>
            <CardDescription className="mt-2">
              Total de contas à receber no mês, representando o valor total das transações de venda pendentes de pagamento.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(overview.averageTicket)}
            </div>
            <CardDescription className="mt-2">
              Ticket médio é calculado dividindo o faturamento total pelo número total de vendas realizadas no mês.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Inativos</CardTitle>
            <UserMinus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Intl.NumberFormat('pt-BR').format(overview.inactiveCustomers)}</div>
            <CardDescription className="mt-2">
              Número de clientes que não realizaram nenhuma compra no mês.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compras</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(overview.shopping)}</div>
            <CardDescription className="mt-2">
              O total de compras realizadas no mês, reflete a quantidade total de transações de compra efetuadas durante o mês.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">À Pagar</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(overview.payment)}
            </div>
            <CardDescription className="mt-2">
              Total de contas à pagar no mês, representando o valor total das transações de compra pendentes de pagamento.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="w-full lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Vendas dos Últimos 12 Meses</CardTitle>
          </CardHeader>
          <CardContent className={cn(CONTAINER_HEIGHT, 'w-full')}>
            <SalesChart data={sales} />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top 5 Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent className={cn(CONTAINER_HEIGHT, 'w-full')}>
            <TopProductsChart data={topFive} />
          </CardContent>
        </Card>
      </div>

      {/* <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="draft">Rascunhos</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Arquivados
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Adicionar Produto
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <ProductsTable
            products={products}
            offset={newOffset ?? 0}
            totalProducts={totalProducts}
          />
        </TabsContent>
      </Tabs> */}
    </div>
  );
}