"use client";

import { useState } from "react";
import {
  Search, Plus, Filter, MoreHorizontal,
  Users, UserCheck, UserPlus, TrendingUp,
  ChevronDown, Tag, Calendar, ArrowUpRight,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { InstagramIcon } from "@/components/icons/instagram";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { NoirBg } from "@/components/noir-bg";
import { cn } from "@/lib/utils";

type Channel = "instagram" | "whatsapp";
type Status = "inscrito" | "lead" | "convertido" | "inativo";
type Filter = "all" | Channel;

const contacts = [
  { id: 1, name: "Ana Lima", handle: "@analima_fit", channel: "instagram" as Channel, status: "convertido" as Status, tags: ["curso", "vip"], joined: "há 2 dias", avatar: "AL", messages: 12 },
  { id: 2, name: "Carlos Mendes", handle: "@carlosm", channel: "instagram" as Channel, status: "lead" as Status, tags: ["preço"], joined: "há 3 dias", avatar: "CM", messages: 4 },
  { id: 3, name: "Júlia Santos", handle: "+55 11 99234-5678", channel: "whatsapp" as Channel, status: "inscrito" as Status, tags: ["novo"], joined: "há 4 dias", avatar: "JS", messages: 7 },
  { id: 4, name: "Rafael Costa", handle: "@rafaelcosta_", channel: "instagram" as Channel, status: "lead" as Status, tags: ["mentoria"], joined: "há 5 dias", avatar: "RC", messages: 3 },
  { id: 5, name: "Mariana Ferreira", handle: "+55 21 98765-4321", channel: "whatsapp" as Channel, status: "convertido" as Status, tags: ["curso", "afiliado"], joined: "há 6 dias", avatar: "MF", messages: 21 },
  { id: 6, name: "Pedro Alves", handle: "@pedroalves_", channel: "instagram" as Channel, status: "convertido" as Status, tags: ["vip"], joined: "há 1 semana", avatar: "PA", messages: 9 },
  { id: 7, name: "Fernanda Lima", handle: "+55 31 97654-3210", channel: "whatsapp" as Channel, status: "lead" as Status, tags: ["preço", "parcelamento"], joined: "há 1 semana", avatar: "FL", messages: 5 },
  { id: 8, name: "Thiago Santos", handle: "@thiagosnt", channel: "instagram" as Channel, status: "inscrito" as Status, tags: ["novo"], joined: "há 2 semanas", avatar: "TS", messages: 2 },
  { id: 9, name: "Camila Rocha", handle: "+55 41 96543-2109", channel: "whatsapp" as Channel, status: "inativo" as Status, tags: [], joined: "há 3 semanas", avatar: "CR", messages: 1 },
  { id: 10, name: "Lucas Oliveira", handle: "@lucasoliveira", channel: "instagram" as Channel, status: "lead" as Status, tags: ["mentoria", "story"], joined: "há 3 semanas", avatar: "LO", messages: 6 },
];

const statusConfig: Record<Status, { label: string; color: string; bg: string; border: string }> = {
  inscrito:   { label: "Inscrito",   color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
  lead:       { label: "Lead",       color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  convertido: { label: "Convertido", color: "text-green-400",  bg: "bg-green-500/10",  border: "border-green-500/20" },
  inativo:    { label: "Inativo",    color: "text-zinc-500",   bg: "bg-zinc-500/10",   border: "border-zinc-500/20" },
};

const tabs = [
  { label: "Todos", value: "all" as Filter },
  { label: "Instagram", value: "instagram" as Filter },
  { label: "WhatsApp", value: "whatsapp" as Filter },
];

export default function ContactsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);

  const filtered = contacts.filter((c) => {
    const matchChannel = filter === "all" || c.channel === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.handle.toLowerCase().includes(search.toLowerCase());
    return matchChannel && matchSearch;
  });

  const toggleSelect = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map((c) => c.id));

  const total = contacts.length;
  const converted = contacts.filter((c) => c.status === "convertido").length;
  const leads = contacts.filter((c) => c.status === "lead").length;
  const newThisWeek = contacts.filter((c) => c.joined.includes("dia")).length;

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
            { label: "Total de contatos", value: total, icon: Users,      color: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
            { label: "Convertidos",       value: converted, icon: UserCheck, color: "text-green-400",  border: "border-green-500/20",  bg: "bg-green-500/5"  },
            { label: "Leads ativos",      value: leads,     icon: TrendingUp, color: "text-yellow-400", border: "border-yellow-500/20", bg: "bg-yellow-500/5" },
            { label: "Novos esta semana", value: newThisWeek, icon: UserPlus, color: "text-blue-400",   border: "border-blue-500/20",   bg: "bg-blue-500/5"   },
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

          {selected.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-zinc-500">{selected.length} selecionado(s)</span>
              <button className="px-3 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-sm transition-colors">Exportar</button>
              <button className="px-3 py-2 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm transition-colors">Excluir</button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_160px_130px_160px_120px_48px] gap-4 px-5 py-3 border-b border-white/6 bg-white/[0.02]">
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={selected.length === filtered.length && filtered.length > 0}
                onChange={toggleAll}
                className="w-4 h-4 rounded border-white/20 accent-blue-500 cursor-pointer"
              />
            </div>
            {["Contato", "Canal", "Status", "Última interação", "Mensagens"].map((h) => (
              <p key={h} className="text-xs font-semibold text-zinc-600 uppercase tracking-wider flex items-center gap-1">
                {h} {h === "Contato" && <ChevronDown className="w-3 h-3" />}
              </p>
            ))}
            <div />
          </div>

          {/* Rows */}
          {filtered.map((contact, i) => {
            const s = statusConfig[contact.status];
            return (
              <div
                key={contact.id}
                className={cn(
                  "grid grid-cols-[40px_1fr_160px_130px_160px_120px_48px] gap-4 px-5 py-3.5 items-center hover:bg-white/[0.03] transition-colors group",
                  i < filtered.length - 1 && "border-b border-white/5"
                )}
              >
                {/* Checkbox */}
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(contact.id)}
                    onChange={() => toggleSelect(contact.id)}
                    className="w-4 h-4 rounded border-white/20 accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Contact */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className="bg-white/8 text-xs font-bold text-zinc-300">{contact.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-200 truncate">{contact.name}</p>
                    <p className="text-xs text-zinc-600 truncate">{contact.handle}</p>
                  </div>
                </div>

                {/* Channel */}
                <div>
                  {contact.channel === "instagram" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
                      <InstagramIcon className="w-3 h-3" /> Instagram
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-medium">
                      <WhatsAppIcon className="w-3 h-3" /> WhatsApp
                    </span>
                  )}
                </div>

                {/* Status */}
                <div>
                  <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold border ${s.bg} ${s.color} ${s.border}`}>
                    {s.label}
                  </span>
                </div>

                {/* Last interaction */}
                <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                  {contact.joined}
                </div>

                {/* Messages */}
                <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-300">
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-700" />
                  {contact.messages}
                </div>

                {/* Actions */}
                <button className="w-8 h-8 rounded-lg text-zinc-700 hover:text-zinc-300 hover:bg-white/6 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-sm text-zinc-600">Mostrando {filtered.length} de {total} contatos</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((n) => (
              <button key={n} className={cn("w-8 h-8 rounded-lg text-sm font-medium transition-colors", n === 1 ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5")}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
