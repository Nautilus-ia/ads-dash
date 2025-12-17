'use client'
import useCreditCards from "@/app/actions";
import { useMemo } from "react";
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

  const { balance, limit } = useMemo(() => {
    const { balance, limit } = policies.reduce((stats, policy) => {
      return {
        balance: stats.balance + policy.spent,
        limit: {
          used: stats.limit.used + policy.spent,
          total: stats.limit.total + policy.limit
        },
      }
    }, { balance: 0, limit: { used: 0, total: 0 } })
    const limitUsagePercentage = ((limit.used / limit.total) * 100)

    return {
      balance,
      limit: {
        total: limit.total,
        usagePercentage: limitUsagePercentage,
      }
    }
  }, [policies])

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
            <Card className="rounded-2xl border-white/10 bg-white/5 text-slate-50 shadow-2xl backdrop-blur md:w-80">
              <CardHeader className="pb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-200/80">
                  Pulso semanal
                </p>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <div className="rounded-full bg-sky-500/20 p-2 text-sky-200">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold leading-none">+12,4%</p>
                  <p className="text-xs text-slate-200/80">Gastos equilibrados e limite saudável.</p>
                </div>
              </CardContent>
            </Card>
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-white/10 bg-white/5 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Saldo total</CardTitle>
                    <DollarSign className="h-4 w-4 text-sky-200" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{formatCurrency(balance)}</div>
                    <p className="mt-2 text-xs text-slate-300">Pronto para novas movimentações.</p>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Limite de crédito</CardTitle>
                    <CreditCard className="h-4 w-4 text-sky-200" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{formatCurrency(limit.total)}</div>
                    <Progress value={limit.usagePercentage} className="mt-3 bg-white/10" />
                    <p className="mt-2 text-xs text-slate-300">{limit.usagePercentage.toFixed(2)}% utilizado</p>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-slate-50 shadow-xl backdrop-blur lg:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-slate-200">Momento do mês</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold">Foco em liquidez</p>
                      <p className="text-xs text-slate-300">
                        Distribuição de gastos estável com margem para imprevistos.
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-sky-100">
                      Status: confortável
                    </div>
                  </CardContent>
                </Card>
              </div>

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
                    <CardTitle className="text-sm font-medium text-slate-200">MRR (recorrente)</CardTitle>
                    <DollarSign className="h-4 w-4 text-sky-200" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-lg font-semibold">{formatCurrency(120000)}</p>
                    <p className="text-xs text-slate-300">Últimos 30 dias · crescimento de +4,3% MoM.</p>
                    <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-sky-100">
                      Receita recorrente saudável e previsível.
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">LTV médio</CardTitle>
                    <Users className="h-4 w-4 text-sky-200" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-lg font-semibold">{formatCurrency(4200)}</p>
                    <p className="text-xs text-slate-300">Base ativa · LTV/CAC em 3,4x (meta ≥ 3x).</p>
                    <Progress value={72} className="bg-white/10" />
                    <p className="text-xs text-slate-300">Retenção estável, churn controlado.</p>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-200">Investimento por produto</CardTitle>
                    <BarChart3 className="h-4 w-4 text-sky-200" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>App banking</span>
                        <span>{formatCurrency(120000)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-sky-400/70" style={{ width: "64%" }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Plataforma B2B</span>
                        <span>{formatCurrency(85000)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-sky-400/70" style={{ width: "45%" }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Gateway</span>
                        <span>{formatCurrency(54000)}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10">
                        <div className="h-2 rounded-full bg-sky-400/70" style={{ width: "32%" }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-white/10 bg-black/40 text-slate-50 shadow-xl backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-100">Pulso financeiro e técnico</CardTitle>
                  <CardDescription className="text-slate-300">
                    Correlação entre MRR, LTV e ROE para priorizar produtos e squads.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">MRR previsto</p>
                    <p className="text-xl font-semibold text-sky-100">{formatCurrency(132000)}</p>
                    <p className="text-xs text-slate-400">+3,1% vs mês anterior</p>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">ROE consolidado</p>
                    <p className="text-xl font-semibold text-sky-100">14,2%</p>
                    <p className="text-xs text-slate-400">Patrimônio vs lucro anualizado</p>
                  </div>
                  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">LTV/CAC</p>
                    <p className="text-xl font-semibold text-sky-100">3,4x</p>
                    <p className="text-xs text-slate-400">Acima do alvo mínimo de 3x</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-white/10 bg-white/5 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-100">Relatórios executivos</CardTitle>
                    <CardDescription className="text-slate-300">
                      Em uma visão: burn rate, run rate e mapa de riscos financeiros.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Burn rate consolidado</p>
                        <p className="text-xs text-slate-300">Atualizado hoje às 08:00</p>
                      </div>
                      <Button variant="outline" asChild className="border-white/20 text-slate-100 hover:bg-white/10">
                        <a href="/">Exportar</a>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Runway dos squads</p>
                        <p className="text-xs text-slate-300">Projeção com base no consumo de cartões</p>
                      </div>
                      <Button variant="outline" asChild className="border-white/20 text-slate-100 hover:bg-white/10">
                        <a href="/">Exportar</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-white/10 bg-black/40 text-slate-50 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-100">Alertas e governança</CardTitle>
                    <CardDescription className="text-slate-300">
                      Centralize decisões e auditoria para softwares e despesas.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Policy de gastos</p>
                        <p className="text-xs text-slate-300">Limite de time em revisão</p>
                      </div>
                      <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-100">Ajustar</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Acesso a softwares</p>
                        <p className="text-xs text-slate-300">Auditoria semanal programada</p>
                      </div>
                      <span className="rounded-full bg-sky-500/20 px-3 py-1 text-xs text-sky-100">Saudável</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                      <div>
                        <p className="font-medium text-slate-100">Contratos renovação</p>
                        <p className="text-xs text-slate-300">Licenças vencendo em 30 dias</p>
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
