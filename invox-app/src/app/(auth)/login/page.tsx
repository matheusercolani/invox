"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InstagramIcon } from "@/components/icons/instagram";
import { InvoxLogo } from "@/components/icons/invox-logo";
import { NoirBg } from "@/components/noir-bg";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Erro ao entrar. Tente novamente.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Erro de conexão. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
      <NoirBg />

      <div className="fixed top-5 left-5 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          Voltar
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <InvoxLogo size={44} />
          <span className="text-[20px] font-bold font-manrope tracking-tight mt-3">Invox</span>
          <p className="text-zinc-500 text-[13.5px] mt-1">Bem-vindo de volta</p>
        </div>

        <div className="glass rounded-2xl p-7">
          {/* Instagram OAuth */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border border-blue-500/25 text-[13.5px] font-semibold hover:from-blue-600/30 hover:to-cyan-500/30 hover:border-blue-500/40 transition-all mb-5"
            onClick={() => router.push("/dashboard")}
          >
            <InstagramIcon className="w-4 h-4 text-blue-300" />
            Continuar com Instagram
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-zinc-600 text-[11px] font-medium">ou acesse com e-mail</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20 text-[13.5px]"
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus-visible:border-blue-500/50 focus-visible:ring-blue-500/20 text-[13.5px] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <a href="#" className="text-[12px] text-zinc-600 hover:text-zinc-400 transition-colors">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[13.5px] font-bold transition-all shadow-lg shadow-blue-900/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Entrar <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-zinc-600 text-[12px] mt-5">
            Não tem conta?{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Criar gratuitamente
            </Link>
          </p>
        </div>

        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-blue-600/15 blur-2xl rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
