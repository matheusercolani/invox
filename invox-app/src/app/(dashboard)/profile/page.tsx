"use client";

import { useState } from "react";
import { User, Mail, Lock, CheckCircle2, AlertCircle, Eye, EyeOff, Crown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { InstagramIcon } from "@/components/icons/instagram";
import { NoirBg } from "@/components/noir-bg";
import { useAuth } from "@/contexts/auth-context";

const PLAN_LABELS: Record<string, string> = { free: "FREE", pro: "PRO", business: "BUSINESS" };
const PLAN_COLORS: Record<string, string> = {
  free:     "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
  pro:      "text-blue-400 bg-blue-500/10 border-blue-500/20",
  business: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
};

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

export default function ProfilePage() {
  const { user, refresh } = useAuth();

  const [name, setName]           = useState(user?.name ?? "");
  const [email, setEmail]         = useState(user?.email ?? "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);

  const [saving, setSaving]       = useState(false);
  const [msg, setMsg]             = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const body: Record<string, string> = {};
      if (name.trim() && name.trim() !== user?.name)   body.name = name.trim();
      if (email.trim() && email.trim() !== user?.email) body.email = email.trim();
      if (newPw) { body.newPassword = newPw; body.currentPassword = currentPw; }

      if (Object.keys(body).length === 0) {
        setMsg({ type: "err", text: "Nenhuma alteração para salvar." });
        return;
      }

      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { error?: string };

      if (!res.ok) {
        setMsg({ type: "err", text: data.error ?? "Erro ao salvar." });
        return;
      }

      await refresh();
      setCurrentPw("");
      setNewPw("");
      setMsg({ type: "ok", text: "Perfil atualizado com sucesso!" });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  const planLabel = PLAN_LABELS[user.plan] ?? "FREE";
  const planColor = PLAN_COLORS[user.plan] ?? PLAN_COLORS.free;

  return (
    <div className="flex-1 overflow-y-auto relative">
      <NoirBg />

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-[#070a14]/85 backdrop-blur-xl border-b border-white/6 px-8 h-14 flex items-center">
        <h1 className="text-base font-semibold text-zinc-200 font-manrope">Meu Perfil</h1>
      </div>

      <div className="relative z-10 px-8 py-8 max-w-2xl flex flex-col gap-6">

        {/* Avatar + identidade */}
        <div className="flex items-center gap-5 p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
          <Avatar className="w-16 h-16 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xl font-bold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-white font-manrope truncate">{user.name}</p>
            <p className="text-sm text-zinc-500 truncate">{user.email}</p>
            <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-bold border ${planColor}`}>
              <Crown className="w-3 h-3" /> Plano {planLabel}
            </span>
          </div>
        </div>

        {/* Dados da conta */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-zinc-300 font-manrope">Dados da conta</h2>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 font-medium">Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/8 text-sm text-zinc-200 outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 font-medium">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/5 border border-white/8 text-sm text-zinc-200 outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Alterar senha */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-zinc-300 font-manrope">Alterar senha</h2>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 font-medium">Senha atual</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="Digite sua senha atual"
                className="w-full h-10 pl-10 pr-10 rounded-xl bg-white/5 border border-white/8 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-blue-500/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 font-medium">Nova senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full h-10 pl-10 pr-10 rounded-xl bg-white/5 border border-white/8 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-blue-500/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Canais conectados */}
        <div className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-zinc-300 font-manrope">Canais conectados</h2>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/6">
              <div className="flex items-center gap-3">
                <WhatsAppIcon className="w-4 h-4 text-green-400" />
                <span className="text-sm text-zinc-300">WhatsApp Business</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-green-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Conectado
              </span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/6">
              <div className="flex items-center gap-3">
                <InstagramIcon className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-zinc-300">Instagram</span>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> Não conectado
              </span>
            </div>
          </div>
        </div>

        {/* Feedback + botão */}
        {msg && (
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm border ${msg.type === "ok" ? "bg-green-500/10 border-green-500/20 text-green-300" : "bg-red-500/10 border-red-500/20 text-red-300"}`}>
            {msg.type === "ok" ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
            {msg.text}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white text-sm font-semibold font-manrope transition-all active:scale-95 shadow-lg shadow-blue-900/30"
        >
          {saving ? "Salvando..." : "Salvar alterações"}
        </button>

      </div>
    </div>
  );
}
