"use client";

import { useState } from "react";
import {
  CheckCircle2, AlertCircle, Plus, Trash2,
  Bell, Shield, Link2, Key, ChevronRight,
  RefreshCw, ExternalLink, Copy, Eye, EyeOff,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { NoirBg } from "@/components/noir-bg";
import { cn } from "@/lib/utils";

const sections = ["Canais", "Links de venda", "Notificações", "Segurança", "Conta"];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("Canais");
  const [showKey, setShowKey] = useState(false);
  const [notifications, setNotifications] = useState({ lead: true, error: true, daily: false, weekly: true });

  return (
    <div className="flex-1 overflow-y-auto relative">
      <NoirBg />

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#070a14]/85 backdrop-blur-xl border-b border-white/6 px-8 h-14 flex items-center">
        <h1 className="text-base font-semibold text-zinc-200 font-manrope">Configurações</h1>
      </div>

      <div className="relative z-10 flex gap-8 px-8 py-8 max-w-6xl">

        {/* Sidebar nav */}
        <aside className="w-52 flex-shrink-0">
          <nav className="flex flex-col gap-1 sticky top-24">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                  activeSection === s
                    ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                {s}
                {activeSection === s && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 flex flex-col gap-6">

          {/* ── CANAIS ── */}
          {activeSection === "Canais" && (
            <>
              <div>
                <h2 className="text-xl font-bold font-manrope text-white mb-1">Canais conectados</h2>
                <p className="text-sm text-zinc-500">Gerencie suas contas de Instagram e WhatsApp vinculadas ao Invox.</p>
              </div>

              {/* Instagram card */}
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                      <InstagramIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Instagram</p>
                      <p className="text-xs text-zinc-500">Mensagens diretas, stories e comentários</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Conectado
                  </span>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-base">M</div>
                    <div>
                      <p className="text-base font-semibold text-white">@matheus.rico</p>
                      <p className="text-sm text-zinc-500">42.1k seguidores · Conta profissional</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/15 mb-5">
                    <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-400/80">Token expira em <strong className="text-yellow-400">45 dias</strong>. Reconecte antes para manter o bot ativo sem interrupção.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 text-sm font-medium transition-all">
                      <RefreshCw className="w-4 h-4" /> Reconectar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 text-sm font-medium transition-all">
                      <ExternalLink className="w-4 h-4" /> Ver no Instagram
                    </button>
                  </div>
                </div>
              </div>

              {/* WhatsApp card */}
              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <WhatsAppIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">WhatsApp Business</p>
                      <p className="text-xs text-zinc-500">Mensagens, sequências e automações via API oficial</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Conectado
                  </span>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-base">M</div>
                    <div>
                      <p className="text-base font-semibold text-white">+55 11 99999-0000</p>
                      <p className="text-sm text-zinc-500">Conta Business · Verificada ✓</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 text-sm font-medium transition-all">
                      <RefreshCw className="w-4 h-4" /> Atualizar token
                    </button>
                  </div>
                </div>
              </div>

              {/* Add channel CTA */}
              <button className="flex items-center gap-3 p-5 rounded-2xl border border-dashed border-white/10 hover:border-blue-500/30 transition-colors group text-left">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-colors">
                  <Plus className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">Adicionar outro canal</p>
                  <p className="text-xs text-zinc-600">Conecte mais contas de Instagram ou WhatsApp</p>
                </div>
              </button>
            </>
          )}

          {/* ── LINKS DE VENDA ── */}
          {activeSection === "Links de venda" && (
            <>
              <div>
                <h2 className="text-xl font-bold font-manrope text-white mb-1">Links de checkout</h2>
                <p className="text-sm text-zinc-500">Esses links são enviados automaticamente pelos seus fluxos quando um lead está pronto para comprar.</p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: "Curso Principal", url: "https://checkout.hotmart.com/produto/xyz", active: true },
                  { label: "Mentoria VIP",    url: "https://checkout.kiwify.com.br/mentoria", active: true },
                  { label: "Produto Digital", url: "",                                          active: false },
                ].map((link, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-white/8 bg-white/[0.02]">
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", link.active && link.url ? "bg-green-500" : "bg-zinc-700")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-200 mb-2">{link.label}</p>
                      <input
                        defaultValue={link.url}
                        placeholder="https://checkout.exemplo.com.br/produto"
                        className="w-full h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-blue-500/40 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {link.url && (
                        <button className="w-8 h-8 rounded-xl border border-white/8 text-zinc-600 hover:text-zinc-300 flex items-center justify-center transition-colors">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold transition-all">
                        Salvar
                      </button>
                    </div>
                  </div>
                ))}
                <button className="flex items-center gap-3 p-5 rounded-2xl border border-dashed border-white/10 hover:border-blue-500/30 transition-colors group">
                  <Plus className="w-5 h-5 text-zinc-600 group-hover:text-blue-400 transition-colors" />
                  <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors font-medium">Adicionar novo link</span>
                </button>
              </div>
            </>
          )}

          {/* ── NOTIFICAÇÕES ── */}
          {activeSection === "Notificações" && (
            <>
              <div>
                <h2 className="text-xl font-bold font-manrope text-white mb-1">Notificações</h2>
                <p className="text-sm text-zinc-500">Escolha quando e como o Invox vai te avisar sobre eventos importantes.</p>
              </div>

              <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
                {([
                  { key: "lead",   label: "Novo lead qualificado",    desc: "Quando o bot identificar um potencial comprador",     icon: Bell },
                  { key: "error",  label: "Erro em fluxo",            desc: "Quando uma mensagem automática falhar ao ser enviada", icon: AlertCircle },
                  { key: "daily",  label: "Resumo diário",            desc: "Relatório com métricas do dia anterior às 8h",        icon: CheckCircle2 },
                  { key: "weekly", label: "Relatório semanal",        desc: "Resumo completo de desempenho toda segunda-feira",     icon: ChevronRight },
                ] as const).map(({ key, label, desc, icon: Icon }, i, arr) => (
                  <div key={key} className={cn("flex items-center justify-between px-6 py-5", i < arr.length - 1 && "border-b border-white/6")}>
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-zinc-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">{label}</p>
                        <p className="text-sm text-zinc-600 mt-0.5">{desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-all flex-shrink-0 ml-6",
                        notifications[key] ? "bg-blue-600" : "bg-white/10"
                      )}
                    >
                      <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all", notifications[key] ? "left-5" : "left-0.5")} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── SEGURANÇA ── */}
          {activeSection === "Segurança" && (
            <>
              <div>
                <h2 className="text-xl font-bold font-manrope text-white mb-1">Segurança e API</h2>
                <p className="text-sm text-zinc-500">Gerencie sua chave de API e configurações de acesso.</p>
              </div>

              <div className="rounded-2xl border border-white/8 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <Key className="w-5 h-5 text-blue-400" />
                  <p className="text-sm font-semibold text-zinc-200">Chave de API do Invox</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-400 font-mono flex items-center">
                    {showKey ? "inv_live_sk_a8f3bc12e9d74a1b..." : "••••••••••••••••••••••••••••"}
                  </div>
                  <button onClick={() => setShowKey(!showKey)} className="w-10 h-10 rounded-xl border border-white/10 text-zinc-600 hover:text-zinc-300 flex items-center justify-center transition-colors">
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button className="w-10 h-10 rounded-xl border border-white/10 text-zinc-600 hover:text-zinc-300 flex items-center justify-center transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-zinc-700 mt-2">Nunca compartilhe esta chave. Ela dá acesso total à sua conta.</p>
              </div>

              {/* Danger zone */}
              <div className="rounded-2xl border border-red-500/20 overflow-hidden" style={{ background: "rgba(239,68,68,0.03)" }}>
                <div className="px-6 py-4 border-b border-red-500/10">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <p className="text-sm font-semibold text-red-400">Zona de perigo</p>
                  </div>
                </div>
                {[
                  { label: "Pausar todos os fluxos",       desc: "Para todas as automações imediatamente. Pode reativar quando quiser.", btn: "Pausar tudo",    color: "border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10" },
                  { label: "Desconectar Instagram",        desc: "O bot para de responder no Instagram. Seus dados permanecem salvos.",  btn: "Desconectar",  color: "border-red-500/20 text-red-400 hover:bg-red-500/10" },
                  { label: "Excluir todos os contatos",    desc: "Remove permanentemente todos os contatos e histórico de conversas.",   btn: "Excluir dados", color: "border-red-500/20 text-red-400 hover:bg-red-500/10" },
                ].map((item, i) => (
                  <div key={i} className={cn("flex items-center justify-between px-6 py-4", i < 2 && "border-b border-red-500/10")}>
                    <div>
                      <p className="text-sm font-semibold text-zinc-300">{item.label}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{item.desc}</p>
                    </div>
                    <button className={cn("flex-shrink-0 ml-4 px-4 py-2 rounded-xl border text-sm font-medium transition-all", item.color)}>
                      {item.btn}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── CONTA ── */}
          {activeSection === "Conta" && (
            <>
              <div>
                <h2 className="text-xl font-bold font-manrope text-white mb-1">Minha conta</h2>
                <p className="text-sm text-zinc-500">Informações do seu perfil e plano atual.</p>
              </div>

              <div className="rounded-2xl border border-white/8 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">M</div>
                  <div>
                    <p className="text-base font-bold text-white">Victor Matheus</p>
                    <p className="text-sm text-zinc-500">mastertime.im@gmail.com</p>
                  </div>
                  <span className="ml-auto px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-xs font-bold text-zinc-400 uppercase tracking-wider">FREE</span>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Nome completo", value: "Victor Matheus" },
                    { label: "E-mail",        value: "mastertime.im@gmail.com" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="text-xs font-medium text-zinc-600 mb-1.5 block">{field.label}</label>
                      <input defaultValue={field.value} className="w-full h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-sm text-zinc-200 outline-none focus:border-blue-500/40 transition-all" />
                    </div>
                  ))}
                  <button className="self-start px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold transition-all mt-2">
                    Salvar alterações
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/8 to-cyan-500/5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-base font-bold font-manrope text-white">Plano Free</p>
                    <p className="text-sm text-zinc-500 mt-0.5">0 de 1.000 contatos utilizados</p>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-bold transition-all shadow-lg shadow-blue-900/30">
                    Fazer upgrade
                  </button>
                </div>
                <div className="w-full bg-white/8 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full" style={{ width: "0%" }} />
                </div>
                <p className="text-xs text-zinc-600 mt-2">Upgrade para Pro e automatize contatos ilimitados + IA avançada</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
