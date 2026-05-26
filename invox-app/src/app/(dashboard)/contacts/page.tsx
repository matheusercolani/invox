"use client";

import { useState } from "react";
import {
  Search, Plus, Filter, Users,
  UserCheck, UserPlus, TrendingUp,
} from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { NoirBg } from "@/components/noir-bg";
import { cn } from "@/lib/utils";

type ChannelFilter = "all" | "instagram" | "whatsapp";

const tabs = [
  { label: "Todos",     value: "all"       as ChannelFilter },
  { label: "Instagram", value: "instagram" as ChannelFilter },
  { label: "WhatsApp",  value: "whatsapp"  as ChannelFilter },
];

export default function ContactsPage() {
  const [filter, setFilter] = useState<ChannelFilter>("all");
  const [search, setSearch] = useState("");

  return (
    <div className="flex-1 overflow-y-auto relative">
      <NoirBg />

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#070a14]/85 backdrop-blur-xl border-b border-white/6 px-8 h-14 flex items-center justify-between">
        <h1 className="text-base font-semibold text-zinc-200 font-manrope">Contatos</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20 text-sm font-medium transition-all">
            <Filter className="w-4 h-4" /> Importar
          </button>
          <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/30 active:scale-95">
            <Plus className="w-4 h-4" /> Novo contato
          </button>
        </div>
      </div>

      <div className="relative z-10 px-8 py-8 max-w-7xl">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total de contatos", value: 0, icon: Users,      color: "text-blue-400",   border: "border-blue-500/20",   bg: "bg-blue-500/5"   },
            { label: "Convertidos",       value: 0, icon: UserCheck,  color: "text-green-400",  border: "border-green-500/20",  bg: "bg-green-500/5"  },
            { label: "Leads ativos",      value: 0, icon: TrendingUp, color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/5" },
            { label: "Novos esta semana", value: 0, icon: UserPlus,   color: "text-blue-400",   border: "border-blue-500/20",   bg: "bg-blue-500/5"   },
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

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/4 border border-white/8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  filter === tab.value ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {tab.value === "instagram" && <InstagramIcon className="w-3.5 h-3.5" />}
                {tab.value === "whatsapp"  && <WhatsAppIcon  className="w-3.5 h-3.5 text-green-400" />}
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou contato..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/4 border border-white/8 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
        </div>

        {/* Empty state */}
        <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-zinc-300 font-manrope mb-1">Nenhum contato ainda</p>
              <p className="text-[13px] text-zinc-600 max-w-xs">
                Os contatos aparecerão aqui automaticamente quando receberem mensagens pelo WhatsApp ou Instagram.
              </p>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-900/30 active:scale-95 mt-1">
              <Plus className="w-4 h-4" /> Adicionar contato manualmente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
