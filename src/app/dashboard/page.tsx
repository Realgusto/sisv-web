// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, DollarSign, Users, ShoppingCart, UserMinus, PieChart } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SalesChart } from '@/components/SalesChart'
import { 
  getClientesAtivos,
  getCrescimentoMensal,
  getProdutosEmEstoque,
  getTotalVendasMes,
  getVendasUltimos12Meses,
  getTicketMedio,
  getClientesInativos,
  getLucratividade,
  getProdutosMaisVendidos } from '@/lib/metrics'
import { TopProductsChart } from '@/components/TopProductsChart'
import { cn } from '@/lib/utils'

export default async function Dashboard() {
  const CONTAINER_HEIGHT = cn('h-[220px] sm:h-[270px] md:h-[320px] lg:h-[370px] xl:h-[420px]')
  
  const totalVendasMes = await getTotalVendasMes();
  const clientesAtivos = await getClientesAtivos();
  const produtosEmEstoque = await getProdutosEmEstoque();
  const crescimentoMensal = await getCrescimentoMensal();

  const dadosVendas = await getVendasUltimos12Meses();

  const ticketMedio = await getTicketMedio();
  const clientesInativos = await getClientesInativos();
  // const taxaConversao = await getTaxaConversao();
  const lucratividade = await getLucratividade();

  const produtosMaisVendidos = await getProdutosMaisVendidos();

  return (
    <div className="p-6 space-y-6 w-full max-w-full overflow-x-hidden">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              }).format(totalVendasMes)}
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
            <div className="text-2xl font-bold">{Intl.NumberFormat('pt-BR').format(clientesAtivos)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Intl.NumberFormat('pt-BR').format(produtosEmEstoque)}</div>
            <CardDescription className="mt-2">
              Métrica fictícia, apenas para exemplo
            </CardDescription>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crescimentoMensal}%</div>
          </CardContent>
        </Card> */}

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
              }).format(ticketMedio)}
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
            <div className="text-2xl font-bold">{Intl.NumberFormat('pt-BR').format(clientesInativos)}</div>
            <CardDescription className="mt-2">
              Últimos 30 dias
            </CardDescription>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taxaConversao}%</div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucratividade</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lucratividade}%</div>
            <CardDescription className="mt-2">
              Métrica fictícia, apenas para exemplo
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
            <SalesChart data={dadosVendas} />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Top 5 Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent className={cn(CONTAINER_HEIGHT, 'w-full')}>
            <TopProductsChart data={produtosMaisVendidos} />
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