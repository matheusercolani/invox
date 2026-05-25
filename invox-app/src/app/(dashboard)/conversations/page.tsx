"use client";

import { useState } from "react";
import {
  Search, CheckCheck, Clock, Filter,
  Send, Paperclip, Smile, MoreHorizontal,
  Zap, Tag, ChevronDown, MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InstagramIcon } from "@/components/icons/instagram";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { NoirBg } from "@/components/noir-bg";
import { cn } from "@/lib/utils";

type Channel = "instagram" | "whatsapp";
type ConvFilter = "all" | "unread" | Channel;

const conversations = [
  { id: 1, name: "Ana Lima",        handle: "@analima_fit",      channel: "instagram" as Channel, last: "Quero saber mais sobre o curso!", time: "2min",  unread: 2, avatar: "AL", status: "lead",       automated: true  },
  { id: 2, name: "Carlos Mendes",   handle: "@carlosm",          channel: "instagram" as Channel, last: "Quanto custa o plano mensal?",   time: "5min",  unread: 1, avatar: "CM", status: "lead",       automated: true  },
  { id: 3, name: "Júlia Santos",    handle: "+55 11 99234-5678", channel: "whatsapp"  as Channel, last: "Recebi o link, obrigada!",        time: "12min", unread: 0, avatar: "JS", status: "convertido", automated: false },
  { id: 4, name: "Rafael Costa",    handle: "@rafaelcosta_",     channel: "instagram" as Channel, last: "Como funciona a mentoria?",       time: "18min", unread: 0, avatar: "RC", status: "lead",       automated: true  },
  { id: 5, name: "Mariana Ferreira",handle: "+55 21 98765-4321", channel: "whatsapp"  as Channel, last: "Vi no story, me manda o link",    time: "34min", unread: 3, avatar: "MF", status: "novo",       automated: true  },
  { id: 6, name: "Pedro Alves",     handle: "@pedroalves_",      channel: "instagram" as Channel, last: "Já comprei! Quando começa?",      time: "1h",    unread: 0, avatar: "PA", status: "convertido", automated: false },
  { id: 7, name: "Fernanda Lima",   handle: "+55 31 97654-3210", channel: "whatsapp"  as Channel, last: "Tem parcelamento disponível?",     time: "2h",    unread: 0, avatar: "FL", status: "lead",       automated: true  },
];

const messages = [
  { id: 1, from: "contact", text: "Oi! Vi seu story sobre o curso de tráfego pago. Quero saber mais!", time: "14:32", automated: false },
  { id: 2, from: "bot",     text: "Olá, Ana! Que ótimo que você se interessou 🎉\n\nO Curso de Tráfego Pago é um programa completo com 8 semanas de conteúdo prático. Aqui estão os detalhes:", time: "14:32", automated: true },
  { id: 3, from: "bot",     text: "📌 O que você vai aprender:\n• Google Ads do zero ao avançado\n• Meta Ads (Facebook + Instagram)\n• TikTok Ads e estratégias\n• Relatórios e otimização\n\n🔗 Acesse a página completa: https://curso.invox.com.br", time: "14:32", automated: true },
  { id: 4, from: "contact", text: "Que incrível! E qual é o investimento?", time: "14:35", automated: false },
  { id: 5, from: "bot",     text: "Temos 3 planos:\n\n💰 Básico: R$ 397 à vista\n💎 Pro: R$ 697 à vista (mais vendido)\n🚀 VIP: R$ 1.497 com mentoria individual\n\nQuer que eu envie o link de cada plano?", time: "14:35", automated: true },
  { id: 6, from: "contact", text: "Quero saber mais sobre o plano Pro!", time: "14:38", automated: false },
];

const statusColors: Record<string, string> = {
  novo:       "bg-blue-500/20 text-blue-300 border-blue-500/30",
  lead:       "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  convertido: "bg-green-500/20 text-green-300 border-green-500/30",
};

const filterTabs = [
  { label: "Todas",     value: "all" as ConvFilter },
  { label: "Não lidas", value: "unread" as ConvFilter },
  { label: "Instagram", value: "instagram" as ConvFilter },
  { label: "WhatsApp",  value: "whatsapp" as ConvFilter },
];

export default function ConversationsPage() {
  const [filter, setFilter] = useState<ConvFilter>("all");
  const [search, setSearch] = useState("");
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [message, setMessage] = useState("");

  const filtered = conversations.filter((c) => {
    if (filter === "unread")   return c.unread > 0;
    if (filter === "instagram" || filter === "whatsapp") return c.channel === filter;
    return true;
  }).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <NoirBg />

      {/* Left panel — conversation list */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-white/6 relative z-10" style={{ background: "rgba(8,4,15,0.8)" }}>
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-base font-semibold text-white font-manrope">Caixa de Entrada</h1>
            {totalUnread > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                {totalUnread} novas
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversa..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-white/5 border border-white/8 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-blue-500/30 transition-all"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
                  filter === tab.value ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                {tab.value === "instagram" && <InstagramIcon className="w-3 h-3" />}
                {tab.value === "whatsapp"  && <WhatsAppIcon  className="w-3 h-3 text-green-400" />}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              className={cn(
                "w-full flex items-start gap-3 px-4 py-3.5 border-b border-white/5 hover:bg-white/[0.03] transition-colors text-left",
                activeConv.id === conv.id && "bg-blue-500/8 border-l-2 border-l-blue-500"
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-white/8 text-xs font-bold text-zinc-300">{conv.avatar}</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#070a14] flex items-center justify-center",
                  conv.channel === "instagram" ? "bg-blue-600" : "bg-green-600"
                )}>
                  {conv.channel === "instagram"
                    ? <InstagramIcon className="w-2 h-2 text-white" />
                    : <WhatsAppIcon  className="w-2 h-2 text-white" />}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={cn("text-sm font-semibold truncate", conv.unread > 0 ? "text-white" : "text-zinc-300")}>{conv.name}</p>
                  <span className="text-[11px] text-zinc-600 flex-shrink-0 ml-2">{conv.time}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className={cn("text-xs truncate flex-1", conv.unread > 0 ? "text-zinc-400" : "text-zinc-600")}>{conv.last}</p>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", statusColors[conv.status])}>
                    {conv.status}
                  </span>
                  {conv.automated && (
                    <span className="flex items-center gap-0.5 text-[10px] text-zinc-700">
                      <Zap className="w-2.5 h-2.5" /> automático
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel — conversation view */}
      <div className="flex-1 flex flex-col relative z-10" style={{ background: "rgba(8,4,15,0.6)" }}>
        {/* Conversation header */}
        <div className="h-14 border-b border-white/6 px-6 flex items-center justify-between bg-[#070a14]/60 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-white/8 text-xs font-bold text-zinc-300">{activeConv.avatar}</AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#070a14] flex items-center justify-center",
                activeConv.channel === "instagram" ? "bg-blue-600" : "bg-green-600"
              )}>
                {activeConv.channel === "instagram"
                  ? <InstagramIcon className="w-2 h-2 text-white" />
                  : <WhatsAppIcon  className="w-2 h-2 text-white" />}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200">{activeConv.name}</p>
              <p className="text-xs text-zinc-600">{activeConv.handle}</p>
            </div>
            <span className={cn("text-[11px] px-2.5 py-1 rounded-full border font-medium ml-1", statusColors[activeConv.status])}>
              {activeConv.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/15 text-xs font-medium transition-all">
              <Tag className="w-3.5 h-3.5" /> Tag
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/15 text-xs font-medium transition-all">
              <Zap className="w-3.5 h-3.5 text-blue-400" /> Adicionar a fluxo
            </button>
            <button className="w-8 h-8 rounded-xl border border-white/8 text-zinc-600 hover:text-zinc-300 flex items-center justify-center transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.from === "bot" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                msg.from === "bot"
                  ? "bg-gradient-to-br from-blue-600/30 to-cyan-500/20 border border-blue-500/20 text-zinc-200 rounded-br-sm"
                  : "bg-white/5 border border-white/8 text-zinc-300 rounded-bl-sm"
              )}>
                {msg.text}
                <div className={cn(
                  "flex items-center gap-1 mt-2",
                  msg.from === "bot" ? "justify-end" : "justify-start"
                )}>
                  {msg.automated && (
                    <span className="flex items-center gap-0.5 text-[10px] text-blue-400/70">
                      <Zap className="w-2.5 h-2.5" /> automático ·
                    </span>
                  )}
                  <span className="text-[10px] text-zinc-700">{msg.time}</span>
                  {msg.from === "bot" && <CheckCheck className="w-3 h-3 text-zinc-700" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/6 bg-[#070a14]/60 backdrop-blur-xl">
          <div className="flex items-end gap-3 p-3 rounded-2xl border border-white/10 bg-white/3 focus-within:border-blue-500/30 transition-colors">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escreva uma mensagem manualmente..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-700 outline-none resize-none leading-relaxed"
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <button className="w-8 h-8 rounded-xl text-zinc-600 hover:text-zinc-400 flex items-center justify-center transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-xl text-zinc-600 hover:text-zinc-400 flex items-center justify-center transition-colors">
                <Smile className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold transition-all active:scale-95">
                <Send className="w-3.5 h-3.5" /> Enviar
              </button>
            </div>
          </div>
          <p className="text-[11px] text-zinc-700 mt-2 text-center">Mensagem manual — o bot continua ativo para outros contatos</p>
        </div>
      </div>
    </div>
  );
}
