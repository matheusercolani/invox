"use client";

import { useState } from "react";
import {
  Plus, MessageSquare, Zap, MoreHorizontal,
  ArrowRight, TrendingUp, Users, MousePointerClick,
  ChevronRight, Search, SlidersHorizontal,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { NoirBg } from "@/components/noir-bg";
import { cn } from "@/lib/utils";

type Channel = "instagram" | "whatsapp";
type Filter = "all" | Channel;

const flows = [
  {
    id: 1,
    name: "Resposta automática a stories",
    description: "Quando alguém responde a um story, o bot envia uma mensagem personalizada com link de vendas e qualifica o lead automaticamente.",
    trigger: "Story Reply",
    channel: "instagram" as Channel,
    active: true,
    stats: { sent: 482, conversions: 67, ctr: 14 },
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    name: "Palavra-chave: preço / valor",
    description: "Detecta mensagens com 'preço', 'valor', 'quanto custa' e envia automaticamente a tabela de planos com link de checkout.",
    trigger: "Palavra-chave",
    channel: "instagram" as Channel,
    active: true,
    stats: { sent: 1240, conversions: 198, ctr: 16 },
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Boas-vindas — novo contato",
    description: "Envia mensagem de boas-vindas assim que alguém inicia uma conversa ou salva o número, apresentando o negócio e oferecendo um recurso gratuito.",
    trigger: "Novo Contato",
    channel: "whatsapp" as Channel,
    active: true,
    stats: { sent: 890, conversions: 134, ctr: 15 },
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    name: "Comentário em publicação",
    description: "Detecta comentários específicos em posts e reels e inicia uma conversa no DM com o link do produto mencionado na publicação.",
    trigger: "Comentário",
    channel: "instagram" as Channel,
    active: false,
    stats: { sent: 295, conversions: 35, ctr: 12 },
    color: "from-orange-500 to-amber-500",
  },
  {
    id: 5,
    name: "Sequência de vendas — 5 dias",
    description: "Sequência automática de 5 mensagens ao longo de 5 dias para nutrir leads que demonstraram interesse mas ainda não compraram.",
    trigger: "Drip / Sequência",
    channel: "whatsapp" as Channel,
    active: true,
    stats: { sent: 340, conversions: 89, ctr: 26 },
    color: "from-pink-500 to-rose-500",
  },
];

const triggerIcons: Record<string, typeof Zap> = {
  "Story Reply": MessageSquare,
  "Palavra-chave": Zap,
  "Novo Contato": Users,
  "Comentário": MousePointerClick,
  "Drip / Sequência": TrendingUp,
};

const tabs: { label: string; value: Filter }[] = [
  { label: "Todos os fluxos", value: "all" },
  { label: "Instagram", value: "instagram" },
  { label: "WhatsApp", value: "whatsapp" },
];

export default function FlowsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = flows.filter((f) => {
    const matchChannel = filter === "all" || f.channel === filter;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase());
    return matchChannel && matchSearch;
  });

  const activeCount = flows.filter((f) => f.active).length;
  const totalSent = flows.reduce((a, f) => a + f.stats.sent, 0);
  const totalConv = flows.reduce((a, f) => a + f.stats.conversions, 0);

  return (
    <div className="flex-1 overflow-y-auto relative">
      <NoirBg />

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#070a14]/85 backdrop-blur-xl border-b border-white/6 px-8 h-14 flex items-center justify-between">
        <h1 className="text-base font-semibold text-zinc-200 font-manrope">Automação</h1>
        <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/30 active:scale-95">
          <Plus className="w-4 h-4" />
          Novo fluxo
        </button>
      </div>

      <div className="relative z-10 px-8 py-8 max-w-6xl">

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Fluxos ativos", value: `${activeCount} de ${flows.length}`, icon: Zap, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
            { label: "Mensagens enviadas", value: totalSent.toLocaleString("pt-BR"), icon: MessageSquare, color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
            { label: "Total de conversões", value: totalConv.toLocaleString("pt-BR"), icon: TrendingUp, color: "text-green-400", border: "border-green-500/20", bg: "bg-green-500/5" },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-4 p-5 rounded-2xl border ${s.border} ${s.bg}`}>
              <div className={`w-11 h-11 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold font-manrope text-white">{s.value}</p>
                <p className="text-sm text-zinc-500 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + search */}
        <div className="flex items-center gap-3 mb-6">
          {/* Tab filters */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  filter === tab.value
                    ? "bg-white/10 text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {tab.value === "instagram" && <InstagramIcon className="w-3.5 h-3.5" />}
                {tab.value === "whatsapp" && <WhatsAppIcon className="w-3.5 h-3.5 text-green-400" />}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar fluxo..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/4 border border-white/8 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-blue-500/40 focus:bg-white/6 transition-all"
            />
          </div>

          <button className="h-10 px-4 rounded-xl border border-white/8 bg-white/4 text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2 text-sm">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Flow cards */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="text-center py-20 text-zinc-600">
              <Zap className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-base font-medium text-zinc-500">Nenhum fluxo encontrado</p>
              <p className="text-sm mt-1">Tente outro filtro ou crie um novo fluxo</p>
            </div>
          )}

          {filtered.map((flow) => {
            const TriggerIcon = triggerIcons[flow.trigger] ?? Zap;
            const convRate = Math.round((flow.stats.conversions / flow.stats.sent) * 100);

            return (
              <div
                key={flow.id}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border transition-all cursor-pointer",
                  flow.active
                    ? "border-white/10 hover:border-white/20 bg-white/[0.03]"
                    : "border-white/6 hover:border-white/12 bg-white/[0.015] opacity-70 hover:opacity-90"
                )}
              >
                {/* Left accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${flow.color} opacity-80`} />

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(26,86,255,0.04), transparent)" }}
                />

                <div className="flex items-start gap-5 pl-7 pr-5 py-5">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${flow.color} flex items-center justify-center flex-shrink-0 shadow-lg mt-0.5`}>
                    <TriggerIcon className="w-5 h-5 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-base font-semibold text-white font-manrope">{flow.name}</h3>

                        {/* Channel badge */}
                        {flow.channel === "instagram" ? (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
                            <InstagramIcon className="w-3 h-3" />
                            Instagram
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-medium">
                            <WhatsAppIcon className="w-3 h-3" />
                            WhatsApp
                          </span>
                        )}

                        {/* Trigger badge */}
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium">
                          {flow.trigger}
                        </span>

                        {!flow.active && (
                          <span className="px-2.5 py-1 rounded-full bg-yellow-500/8 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                            Pausado
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Toggle */}
                        <div
                          className={cn(
                            "relative w-10 h-5 rounded-full transition-all cursor-pointer flex-shrink-0",
                            flow.active ? "bg-blue-600" : "bg-white/10"
                          )}
                        >
                          <div className={cn(
                            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all",
                            flow.active ? "left-5" : "left-0.5"
                          )} />
                        </div>
                        <button className="w-8 h-8 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/6 flex items-center justify-center transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-500 leading-relaxed mb-4 max-w-2xl">{flow.description}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-sm">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-zinc-400 font-medium">{flow.stats.sent.toLocaleString("pt-BR")}</span>
                        <span className="text-zinc-700">enviadas</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                        <span className="text-green-400 font-semibold">{flow.stats.conversions}</span>
                        <span className="text-zinc-700">conversões</span>
                      </div>

                      {/* Conversion bar */}
                      <div className="flex items-center gap-2.5 flex-1 max-w-48">
                        <div className="flex-1 h-1.5 rounded-full bg-white/6">
                          <div
                            className={`h-1.5 rounded-full bg-gradient-to-r ${flow.color} transition-all`}
                            style={{ width: `${Math.min(convRate * 4, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-zinc-500 font-medium flex-shrink-0">{convRate}% conv.</span>
                      </div>

                      <a
                        href="#"
                        className="ml-auto flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Editar fluxo <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty CTA */}
        <div className="mt-6 p-8 rounded-2xl border border-dashed border-white/8 flex flex-col items-center text-center hover:border-blue-500/20 transition-colors cursor-pointer group">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/15 transition-colors">
            <Plus className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-base font-semibold text-zinc-300 font-manrope mb-1">Criar novo fluxo</p>
          <p className="text-sm text-zinc-600 max-w-xs">Escolha um gatilho, defina as mensagens e ative para Instagram ou WhatsApp</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
            Começar agora <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
