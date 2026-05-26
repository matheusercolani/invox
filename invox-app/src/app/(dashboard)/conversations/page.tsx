"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, CheckCheck, Send, Paperclip, Smile,
  MoreHorizontal, Zap, RefreshCw,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { NoirBg } from "@/components/noir-bg";
import { cn } from "@/lib/utils";
import type { WaConversation, WaMessage } from "@/types/whatsapp";

const POLL_INTERVAL = 8000; // 8s polling for new messages

function initials(name: string | null, phone: string): string {
  if (!name) return phone.slice(-2);
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(ts: number | null): string {
  if (!ts) return "";
  const diff = Math.floor(Date.now() / 1000) - ts;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<WaConversation[]>([]);
  const [active, setActive] = useState<WaConversation | null>(null);
  const [messages, setMessages] = useState<WaMessage[]>([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    const res = await fetch("/api/whatsapp/conversations");
    if (!res.ok) return;
    const data = await res.json() as { conversations: WaConversation[] };
    setConversations(data.conversations);
    setLoading(false);
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    const res = await fetch(`/api/whatsapp/messages?conversation_id=${conversationId}`);
    if (!res.ok) return;
    const data = await res.json() as { messages: WaMessage[] };
    setMessages(data.messages);
  }, []);

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Polling
  useEffect(() => {
    const id = setInterval(() => {
      fetchConversations();
      if (active) fetchMessages(active.id);
    }, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [active, fetchConversations, fetchMessages]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!active) return;
    fetchMessages(active.id);
    // Mark as read
    fetch("/api/whatsapp/conversations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation_id: active.id }),
    });
  }, [active, fetchMessages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !active || sending) return;
    setSending(true);
    const text = message.trim();
    setMessage("");

    const res = await fetch("/api/whatsapp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: active.id,
        contact_wa_id: active.contact_wa_id,
        contact_phone: active.contact_phone,
        text,
      }),
    });

    if (res.ok) {
      await fetchMessages(active.id);
      await fetchConversations();
    }
    setSending(false);
  };

  const filtered = conversations.filter((c) =>
    (c.contact_name ?? c.contact_phone)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((a, c) => a + c.unread_count, 0);

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <NoirBg />

      {/* Left — conversation list */}
      <div
        className="w-80 flex-shrink-0 flex flex-col border-r border-white/6 relative z-10"
        style={{ background: "rgba(8,4,15,0.8)" }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-white/6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-base font-semibold text-white font-manrope">
              Caixa de Entrada
            </h1>
            <div className="flex items-center gap-2">
              {totalUnread > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-bold border border-green-500/30">
                  {totalUnread} novas
                </span>
              )}
              <button
                onClick={() => { fetchConversations(); if (active) fetchMessages(active.id); }}
                className="w-7 h-7 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/5 flex items-center justify-center transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversa..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-white/5 border border-white/8 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-green-500/30 transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
              Carregando...
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 px-6 text-center">
              <WhatsAppIcon className="w-8 h-8 text-zinc-700" />
              <p className="text-sm text-zinc-600">Nenhuma conversa ainda</p>
              <p className="text-xs text-zinc-700">
                As mensagens recebidas no WhatsApp aparecem aqui
              </p>
            </div>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActive(conv)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3.5 border-b border-white/5 hover:bg-white/[0.03] transition-colors text-left",
                  active?.id === conv.id && "bg-green-500/8 border-l-2 border-l-green-500"
                )}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-white/8 text-xs font-bold text-zinc-300">
                      {initials(conv.contact_name, conv.contact_phone)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#070a14] bg-green-600 flex items-center justify-center">
                    <WhatsAppIcon className="w-2 h-2 text-white" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={cn("text-sm font-semibold truncate", conv.unread_count > 0 ? "text-white" : "text-zinc-300")}>
                      {conv.contact_name ?? conv.contact_phone}
                    </p>
                    <span className="text-[11px] text-zinc-600 flex-shrink-0 ml-2">
                      {relativeTime(conv.last_message_at)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("text-xs truncate flex-1", conv.unread_count > 0 ? "text-zinc-400" : "text-zinc-600")}>
                      {conv.last_message_text ?? ""}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-bold flex-shrink-0">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right — message view */}
      <div className="flex-1 flex flex-col relative z-10" style={{ background: "rgba(8,4,15,0.6)" }}>
        {!active ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-8">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <WhatsAppIcon className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-[15px] font-semibold text-zinc-300 font-manrope">
              Selecione uma conversa
            </p>
            <p className="text-[13px] text-zinc-600 max-w-xs">
              Escolha uma conversa à esquerda para visualizar as mensagens
            </p>
          </div>
        ) : (
          <>
            {/* Conversation header */}
            <div className="h-14 border-b border-white/6 px-6 flex items-center justify-between bg-[#070a14]/60 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-white/8 text-xs font-bold text-zinc-300">
                    {initials(active.contact_name, active.contact_phone)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    {active.contact_name ?? active.contact_phone}
                  </p>
                  <p className="text-xs text-zinc-600">{active.contact_phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-green-500/20 text-green-400 text-xs font-medium bg-green-500/8">
                  <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp
                </span>
                <button className="w-8 h-8 rounded-xl border border-white/8 text-zinc-600 hover:text-zinc-300 flex items-center justify-center transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-3">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-zinc-700 text-sm">
                  Nenhuma mensagem
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", msg.direction === "outbound" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                        msg.direction === "outbound"
                          ? "bg-gradient-to-br from-green-600/30 to-green-500/20 border border-green-500/20 text-zinc-200 rounded-br-sm"
                          : "bg-white/5 border border-white/8 text-zinc-300 rounded-bl-sm"
                      )}
                    >
                      {msg.body ?? `[${msg.type}]`}
                      <div className={cn("flex items-center gap-1 mt-1.5", msg.direction === "outbound" ? "justify-end" : "justify-start")}>
                        <span className="text-[10px] text-zinc-700">
                          {new Date(msg.wa_timestamp * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {msg.direction === "outbound" && (
                          <CheckCheck className={cn("w-3 h-3", msg.status === "read" ? "text-green-400" : "text-zinc-700")} />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-white/6 bg-[#070a14]/60 backdrop-blur-xl">
              <div className="flex items-end gap-3 p-3 rounded-2xl border border-white/10 bg-white/3 focus-within:border-green-500/30 transition-colors">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Escreva uma mensagem..."
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
                  <button
                    onClick={handleSend}
                    disabled={sending || !message.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:opacity-50 text-white text-xs font-semibold transition-all active:scale-95"
                  >
                    {sending ? <Zap className="w-3.5 h-3.5 animate-pulse" /> : <Send className="w-3.5 h-3.5" />}
                    Enviar
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-zinc-700 mt-2 text-center">
                Enter para enviar · Shift+Enter para nova linha
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
