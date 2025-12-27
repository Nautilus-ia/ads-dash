'use client'
import useCreditCards from "@/app/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CreditCard, DollarSign, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TransactionsList } from "@/components/transactions-list";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { cards, policies, transactions } = useCreditCards()

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const cloudSuppliers = [
    { name: "AWS", monthly: 84500, trend: "+6,8%" },
    { name: "GCP", monthly: 39200, trend: "+3,1%" },
    { name: "Azure", monthly: 28750, trend: "-1,4%" },
    { name: "Cloudflare", monthly: 9600, trend: "+2,2%" },
  ]

  const monthlyCloudCosts = [
    { month: "Jan", aws: 76000, gcp: 35200, azure: 26800 },
    { month: "Fev", aws: 79200, gcp: 36800, azure: 27400 },
    { month: "Mar", aws: 81000, gcp: 37400, azure: 27900 },
    { month: "Abr", aws: 82500, gcp: 38600, azure: 28250 },
    { month: "Mai", aws: 84500, gcp: 39200, azure: 28750 },
    { month: "Jun", aws: 86800, gcp: 40100, azure: 29400 },
  ]

  const productCosts = [
    { name: "Compute", share: 46 },
    { name: "Storage", share: 22 },
    { name: "Networking", share: 18 },
    { name: "Observability", share: 14 },
  ]

  const lineChart = { width: 600, height: 180, padding: 24 }
  const supplierMax = Math.max(...cloudSuppliers.map((supplier) => supplier.monthly))
  const productMax = Math.max(...productCosts.map((product) => product.share))
  const monthlyTotals = monthlyCloudCosts.map(
    (month) => month.aws + month.gcp + month.azure
  )
  const monthlyAws = monthlyCloudCosts.map((month) => month.aws)
  const monthlyGcp = monthlyCloudCosts.map((month) => month.gcp)
  const monthlyAzure = monthlyCloudCosts.map((month) => month.azure)
  const chartMax = Math.max(
    ...monthlyTotals,
    ...monthlyAws,
    ...monthlyGcp,
    ...monthlyAzure
  )

  const buildLinePoints = (values: number[], max: number) => {
    const { width, height, padding } = lineChart
    const range = Math.max(max, 1)
    const step = (width - padding * 2) / (values.length - 1)
    return values
      .map((value, index) => {
        const x = padding + index * step
        const y = height - padding - (value / range) * (height - padding * 2)
        return `${x},${y}`
      })
      .join(" ")
  }

  return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-black via-slate-950 to-slate-900 text-slate-50">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-48 bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-sky-500/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-6xl flex-col space-y-8 p-4 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-sky-200">
                <span>Dados ilustrativos</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                  Sua central financeira única
                </h2>
                <p className="text-sm text-slate-200/80">
                  Monitoramento em tempo real para softwares, equipes e despesas.
                </p>
                <p className="text-xs text-slate-400">
                  Todos os nomes e números são fictícios para demonstração.
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="w-fit rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
              <TabsTrigger
                value="overview"
                className="rounded-xl px-4 py-2 text-sm text-slate-200 transition data-[state=active]:bg-sky-500/20 data-[state=active]:text-white"
              >
                Visão geral
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-xl px-4 py-2 text-sm text-slate-200 transition data-[state=active]:bg-sky-500/20 data-[state=active]:text-white"
              >
                Análises
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="rounded-xl px-4 py-2 text-sm text-slate-200 transition data-[state=active]:bg-sky-500/20 data-[state=active]:text-white"
              >
                Relatórios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">

              <div className="grid gap-4 lg:grid-cols-2">
                <Card className="border-white/10 bg-white/5 text-slate-100 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-100">Custos de cloud por fornecedor</CardTitle>
                    <CardDescription className="text-slate-300">
                      Visão mensal para comparar tendências e renegociar contratos.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {cloudSuppliers.map((supplier) => (
                        <div key={supplier.name} className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
                          <div className="flex h-24 w-full items-end">
                            <div
                              className="w-full rounded-md bg-sky-400/80"
                              style={{ height: `${(supplier.monthly / supplierMax) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-100">{supplier.name}</span>
                          <span className="text-[10px] text-slate-400">{formatCurrency(supplier.monthly)}</span>
                          <span className="text-[10px] font-semibold text-sky-100">{supplier.trend}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-100">Evolucao mensal do custo cloud</CardTitle>
                    <CardDescription className="text-slate-300">
                      AWS, GCP e Azure com comparacao direta por mes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <svg viewBox={`0 0 ${lineChart.width} ${lineChart.height}`} className="h-44 w-full">
                        <line
                          x1={lineChart.padding}
                          y1={lineChart.height - lineChart.padding}
                          x2={lineChart.width - lineChart.padding}
                          y2={lineChart.height - lineChart.padding}
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="2"
                        />
                        <polyline
                          points={buildLinePoints(monthlyAws, chartMax)}
                          fill="none"
                          stroke="rgba(56,189,248,0.9)"
                          strokeWidth="3"
                        />
                        <polyline
                          points={buildLinePoints(monthlyGcp, chartMax)}
                          fill="none"
                          stroke="rgba(16,185,129,0.85)"
                          strokeWidth="3"
                        />
                        <polyline
                          points={buildLinePoints(monthlyAzure, chartMax)}
                          fill="none"
                          stroke="rgba(251,191,36,0.85)"
                          strokeWidth="3"
                        />
                      </svg>
                      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400">
                        <span className="text-slate-200">Total: {formatCurrency(monthlyTotals[monthlyTotals.length - 1])}</span>
                        <div className="flex flex-wrap gap-3">
                          <span className="text-sky-200">AWS</span>
                          <span className="text-emerald-200">GCP</span>
                          <span className="text-amber-200">Azure</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-400 sm:grid-cols-6">
                      {monthlyCloudCosts.map((month) => (
                        <div key={month.month} className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-center">
                          {month.month}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-white/10 bg-white/5 text-slate-50 shadow-xl backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-100">Distribuicao de custo por produto</CardTitle>
                  <CardDescription className="text-slate-300">
                    Ajuda a identificar se um SKU esta dominando o crescimento.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {productCosts.map((product) => (
                      <div key={product.name} className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-black/30 p-3">
                        <div className="flex h-24 w-full items-end">
                          <div
                            className="w-full rounded-md bg-emerald-400/80"
                            style={{ height: `${(product.share / productMax) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-100">{product.name}</span>
                        <span className="text-[10px] text-slate-400">{product.share}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-white/10 bg-white/5 text-slate-100 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-100">Últimas Transações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      <TransactionsList transactions={transactions} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-3 border-white/10 bg-black/40 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-100">Cartão de Crédito</CardTitle>
                    <CardDescription className="text-slate-300">VocêCard</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {cards.map((card, index) => (
                          <div key={index} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                            <div className={`${card.color} rounded-lg p-2 shadow-md`}>
                              <CreditCard className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none text-slate-100">
                                {card.type} terminando em {card.last4}
                              </p>
                              <p className="text-sm text-slate-300">Válido até {card.expiry}</p>
                            </div>
                            <Button variant="outline" asChild className="border-white/20 text-slate-100 hover:bg-white/10">
                              <a href="/">Gerenciar</a>
                            </Button>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-white/10 bg-white/5 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Custo cloud do mês</CardTitle>
                    <DollarSign className="h-4 w-4 text-sky-200" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-lg font-semibold">
                      {formatCurrency(monthlyTotals[monthlyTotals.length - 1])}
                    </p>
                    <p className="text-xs text-slate-300">Resumo mensal consolidado das clouds.</p>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-sky-100">
                      Crescimento de +4,1% vs mês anterior.
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Custo por receita</CardTitle>
                    <TrendingUp className="h-4 w-4 text-sky-200" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-lg font-semibold">18,4%</p>
                    <p className="text-xs text-slate-300">Percentual do faturamento destinado a cloud.</p>
                    <Progress value={68} className="bg-white/10" />
                    <p className="text-xs text-slate-300">Meta interna: ≤ 20%.</p>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Top fornecedores</CardTitle>
                    <BarChart3 className="h-4 w-4 text-sky-200" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm text-slate-300">
                      {cloudSuppliers.slice(0, 3).map((supplier) => (
                        <div key={supplier.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>{supplier.name}</span>
                            <span>{formatCurrency(supplier.monthly)}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white/10">
                            <div
                              className="h-2 rounded-full bg-sky-400/70"
                              style={{ width: `${(supplier.monthly / supplierMax) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-white/10 bg-black/40 text-slate-50 shadow-xl backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-100">Gestao de custos por cloud</CardTitle>
                  <CardDescription className="text-slate-300">
                    Sinaliza oportunidades de otimizacao e contratos a renegociar.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Spot vs reservado</p>
                    <p className="text-xl font-semibold text-sky-100">62% reservado</p>
                    <p className="text-xs text-slate-400">Meta: 70% para reduzir volatilidade.</p>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Servicos em alerta</p>
                    <p className="text-xl font-semibold text-sky-100">5 ativos</p>
                    <p className="text-xs text-slate-400">Compute e storage acima do baseline.</p>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Economia potencial</p>
                    <p className="text-xl font-semibold text-sky-100">{formatCurrency(18500)}</p>
                    <p className="text-xs text-slate-400">Rightsizing e reservas anuais.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-white/10 bg-white/5 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-100">Relatorios de custo cloud</CardTitle>
                    <CardDescription className="text-slate-300">
                      Projecoes, alocacao por centro de custo e contratacao.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Forecast por fornecedor</p>
                        <p className="text-xs text-slate-300">Proximos 90 dias por cloud.</p>
                      </div>
                      <Button variant="outline" asChild className="border-white/20 text-slate-100 hover:bg-white/10">
                        <a href="/">Exportar</a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Alocacao por produto</p>
                        <p className="text-xs text-slate-300">Compute, storage e networking.</p>
                      </div>
                      <Button variant="outline" asChild className="border-white/20 text-slate-100 hover:bg-white/10">
                        <a href="/">Exportar</a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Reservas e compromissos</p>
                        <p className="text-xs text-slate-300">Economia projetada por contrato.</p>
                      </div>
                      <Button variant="outline" asChild className="border-white/20 text-slate-100 hover:bg-white/10">
                        <a href="/">Exportar</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-100">Governanca de custos cloud</CardTitle>
                    <CardDescription className="text-slate-300">
                      Alertas, orcamentos e conformidade por fornecedor.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Budget estourando</p>
                        <p className="text-xs text-slate-300">AWS acima de 92% do teto.</p>
                      </div>
                      <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-100">Revisar</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Desvios detectados</p>
                        <p className="text-xs text-slate-300">GCP acima do baseline em 12%.</p>
                      </div>
                      <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-100">Analisar</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Contratos a vencer</p>
                        <p className="text-xs text-slate-300">Azure commit termina em 45 dias.</p>
                      </div>
                      <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-100">Planejar</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  )
}
