"use client";

import {
  MessageSquare, TrendingUp, Users, Zap,
  ChevronRight, ArrowRight, Plus,
} from "lucide-react";
import { NoirBg } from "@/components/noir-bg";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

const ONBOARDING_STEPS = [
  { label: "Conectar canal (Instagram ou WhatsApp)", href: "/settings" },
  { label: "Criar primeiro fluxo automático", href: "/flows" },
  { label: "Configurar resposta de story", href: "/flows" },
];

const QUICK_ACTIONS = [
  { title: "Enviar links automaticamente por DM a partir dos comentários", popular: true },
  { title: "Gere leads com stories do Instagram", popular: false },
  { title: "Responda todas as suas DMs automaticamente", popular: false },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();

  const name = loading ? "" : (user?.name ?? "Usuário");
  const firstName = name.split(" ")[0];

  // Stats are always zero until backend data is wired
  const stats = [
    { label: "Mensagens enviadas", value: "0", icon: MessageSquare, color: "text-blue-400", border: "border-blue-500/20", glow: "bg-blue-600/5" },
    { label: "Taxa de resposta", value: "—", icon: TrendingUp, color: "text-green-400", border: "border-green-500/20", glow: "bg-green-600/5" },
    { label: "Leads qualificados", value: "0", icon: Users, color: "text-blue-400", border: "border-blue-500/20", glow: "bg-blue-600/5" },
    { label: "Fluxos ativos", value: "0", icon: Zap, color: "text-cyan-400", border: "border-cyan-500/20", glow: "bg-cyan-600/5" },
  ];

  return (
    <div className="flex-1 overflow-y-auto relative">
      <NoirBg />

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#070a14]/80 backdrop-blur-xl border-b border-white/6 px-8 h-12 flex items-center justify-between">
        <h1 className="text-[14px] font-semibold text-zinc-200 font-manrope">Inicial</h1>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/8 border border-yellow-500/15">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
          <span className="text-yellow-400 text-[11px] font-medium">Configure seus canais</span>
        </div>
      </div>

      <div className="relative z-10 px-8 py-7 max-w-5xl">
        {/* Welcome */}
        <div className="mb-8 animate-fade-up">
          <h2
            className="text-[32px] font-bold font-manrope tracking-tight mb-1"
            style={{
              background: "linear-gradient(180deg, #f0f4ff 0%, rgba(240,244,255,0.55) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {loading ? "Carregando..." : `Olá, ${firstName}!`}
          </h2>
          <p className="text-[13px] text-zinc-500">
            Sua conta está pronta. Conecte um canal para começar.
          </p>
        </div>

        {/* Stats — all zero for new users */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative overflow-hidden p-5 border ${stat.border} ${stat.glow} rounded-xl group hover:border-opacity-50 transition-all animate-fade-up`}
              style={{ animationDelay: `${i * 0.07}s`, background: "rgba(255,255,255,0.02)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <p className="text-[24px] font-bold font-manrope text-white leading-none mb-1">{stat.value}</p>
              <p className="text-zinc-600 text-[11px]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Onboarding checklist (highlighted for new users) */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="p-6 border border-blue-500/20 rounded-2xl bg-blue-500/[0.04]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[11px] text-blue-400 font-bold uppercase tracking-wider mb-1">Primeiros passos</p>
                <h3 className="text-[15px] font-semibold font-manrope text-zinc-200">
                  Configure o Invox e comece a vender automaticamente
                </h3>
              </div>
              <span className="text-[11px] text-zinc-600 bg-white/5 px-2.5 py-1 rounded-full border border-white/8">
                0 de {ONBOARDING_STEPS.length} concluídos
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {ONBOARDING_STEPS.map((step) => (
                <Link
                  key={step.label}
                  href={step.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 flex-shrink-0 group-hover:border-blue-500/50 transition-colors" />
                  <span className="text-[13px] text-zinc-400 flex-1 group-hover:text-zinc-200 transition-colors">
                    {step.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick automations */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.28s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold font-manrope text-zinc-200">Comece por aqui</h3>
            <Link
              href="/flows"
              className="text-[12px] text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <div
                key={action.title}
                className="relative overflow-hidden p-5 border border-white/8 rounded-xl hover:border-blue-500/30 transition-all cursor-pointer group"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <p className="text-[13px] font-medium text-zinc-300 group-hover:text-white leading-snug mb-3 transition-colors">
                  {action.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-600 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Quick Automation
                  </span>
                  {action.popular && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-400/10 text-orange-400 font-bold uppercase tracking-widest border border-orange-400/20">
                      Popular
                    </span>
                  )}
                </div>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"
                  style={{ background: "radial-gradient(circle at top right, rgba(26,86,255,0.06), transparent 70%)" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Empty conversations + CTA */}
        <div className="animate-fade-up" style={{ animationDelay: "0.35s" }}>
          <div className="p-8 border border-dashed border-white/8 rounded-2xl flex flex-col items-center text-center hover:border-blue-500/20 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-[14px] font-semibold text-zinc-300 font-manrope mb-1">Nenhuma conversa ainda</p>
            <p className="text-[12.5px] text-zinc-600 max-w-xs mb-4">
              Conecte seu Instagram ou WhatsApp para começar a receber mensagens aqui.
            </p>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[13px] font-semibold transition-all shadow-lg shadow-blue-900/30"
            >
              <Plus className="w-3.5 h-3.5" /> Conectar canal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
