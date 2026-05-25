"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Check, Zap, MessageSquare, Users, TrendingUp,
  ChevronRight, Shield, Clock,
} from "lucide-react";
import { NoirBg } from "@/components/noir-bg";
import { InstagramIcon } from "@/components/icons/instagram";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { InvoxLogo } from "@/components/icons/invox-logo";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Gratuito",
    price: "0",
    period: "para sempre",
    description: "Comece a automatizar sem gastar nada.",
    highlight: false,
    cta: "Criar conta grátis",
    ctaHref: "/signup",
    features: [
      "Até 1.000 contatos",
      "1 canal (Instagram ou WhatsApp)",
      "3 fluxos automáticos ativos",
      "Resposta a palavras-chave",
      "Análises básicas",
      "Suporte via comunidade",
    ],
  },
  {
    name: "Pro",
    price: "97",
    period: "mês",
    description: "Para criadores e negócios em crescimento.",
    highlight: true,
    badge: "Mais popular",
    cta: "Começar Pro",
    ctaHref: "/signup",
    features: [
      "Contatos ilimitados",
      "Instagram + WhatsApp",
      "Fluxos ilimitados",
      "IA integrada (GPT-4o)",
      "Análises avançadas em tempo real",
      "Sequências de follow-up",
      "Integrações com Zapier / Make",
      "Suporte prioritário",
    ],
  },
  {
    name: "Business",
    price: "297",
    period: "mês",
    description: "Para agências e times de marketing.",
    highlight: false,
    cta: "Falar com vendas",
    ctaHref: "/signup",
    features: [
      "Tudo do plano Pro",
      "Até 5 usuários na conta",
      "Múltiplas contas conectadas",
      "API de integração completa",
      "Relatórios personalizados",
      "Gerente de conta dedicado",
      "Onboarding assistido",
      "SLA garantido 99,9%",
    ],
  },
];

const features = [
  {
    icon: Zap,
    title: "Automação inteligente",
    description:
      "Crie fluxos de resposta para Instagram e WhatsApp com gatilhos baseados em palavras-chave, stories, comentários e novos contatos.",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
  },
  {
    icon: Users,
    title: "Qualificação de leads",
    description:
      "Identifique e segmente contatos automaticamente conforme interagem. Foque sua energia nos leads que realmente convertem.",
    color: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/5",
  },
  {
    icon: TrendingUp,
    title: "Análises em tempo real",
    description:
      "Acompanhe taxa de abertura, conversões e CTR de cada fluxo. Entenda o que funciona e otimize continuamente.",
    color: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
];

const steps = [
  {
    number: "01",
    title: "Conecte seus canais",
    description:
      "Vincule seu Instagram e WhatsApp em menos de 2 minutos. Sem código, sem configurações complexas.",
  },
  {
    number: "02",
    title: "Crie seus fluxos",
    description:
      "Monte automações visuais com nosso editor. Defina gatilhos, mensagens e condições de forma intuitiva.",
  },
  {
    number: "03",
    title: "Venda no piloto automático",
    description:
      "Ative os fluxos e deixe o Invox trabalhar. Responda leads, envie links e feche vendas 24/7.",
  },
];

const blogPosts = [
  {
    tag: "Automação",
    title: "Como fechar 10× mais vendas pelo Instagram com DMs automáticas",
  },
  {
    tag: "Tutorial",
    title: "Guia completo: conectando o Invox ao WhatsApp Business em 5 minutos",
  },
  {
    tag: "Estratégia",
    title: "Os 5 gatilhos de automação que todo criador de conteúdo deveria usar",
  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [heroEmail, setHeroEmail] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <NoirBg />

      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
        <nav
          className={cn(
            "max-w-6xl mx-auto flex items-center justify-between px-5 py-2.5 rounded-2xl transition-all duration-300",
            scrolled
              ? "bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl"
              : "bg-transparent"
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <InvoxLogo size={26} />
            <span className="text-[16px] font-bold font-manrope tracking-tight">Invox</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-zinc-400">
            <a href="#produto" className="hover:text-white transition-colors">Produto</a>
            <a href="#precos" className="hover:text-white transition-colors">Preços</a>
            <a href="#blog" className="hover:text-white transition-colors">Blog</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:block text-[13px] text-zinc-400 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[13px] font-semibold transition-all shadow-lg shadow-blue-900/30 active:scale-95"
            >
              Criar conta <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-4 pt-40 pb-28">
        {/* Early access badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-[11.5px] font-medium text-blue-200/90 tracking-wide font-manrope">
            Acesso antecipado — vagas limitadas
          </span>
          <ArrowRight className="w-3 h-3 text-blue-400" />
        </div>

        <h1
          className="text-5xl md:text-7xl font-black font-manrope tracking-tighter leading-[1.05] mb-6 animate-fade-up max-w-4xl"
          style={{ animationDelay: "0.05s" }}
        >
          <span
            style={{
              background: "linear-gradient(180deg, #ffffff 40%, rgba(255,255,255,0.5) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Automatize suas DMs
            <br />e venda enquanto{" "}
          </span>
          <span
            style={{
              background: "linear-gradient(90deg, #1a56ff 0%, #00c8ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            dorme
          </span>
        </h1>

        <p
          className="text-zinc-400 text-base md:text-xl max-w-xl mx-auto leading-relaxed mb-10 animate-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          Crie automações para Instagram e WhatsApp que respondem leads, qualificam contatos e fecham vendas — 24 horas por dia, 7 dias por semana.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-3 mb-16 animate-fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          <Link
            href="/signup"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[14.5px] font-bold transition-all shadow-2xl shadow-blue-900/40 active:scale-95 font-manrope"
          >
            Começar grátis <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#produto"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 hover:border-white/20 text-white text-[14.5px] font-medium transition-all"
          >
            Ver como funciona <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Social proof */}
        <div
          className="flex items-center gap-10 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          {[
            { value: "2.400+", label: "usuários ativos" },
            { value: "94%", label: "taxa de resposta" },
            { value: "3,2×", label: "aumento em vendas" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black font-manrope text-white">{s.value}</p>
              <p className="text-[12px] text-zinc-600 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Integration strip ── */}
      <div className="relative z-10 border-y border-white/5 bg-white/[0.012] py-5">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-5 md:gap-12">
          <p className="text-[10px] font-bold tracking-widest text-zinc-600 uppercase shrink-0 font-manrope">
            Integrado com
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center text-[13px] font-semibold font-manrope text-zinc-500">
            {[
              { name: "Instagram", el: <InstagramIcon className="w-4 h-4" /> },
              { name: "WhatsApp", el: <WhatsAppIcon className="w-4 h-4 text-green-500" /> },
              { name: "Meta API", el: <div className="w-4 h-4 rounded bg-blue-600/30 flex items-center justify-center text-[8px] font-black text-blue-400">M</div> },
              { name: "OpenAI", el: <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-zinc-400">AI</div> },
              { name: "Cloudflare", el: <div className="w-4 h-4 text-orange-400 flex items-center justify-center text-[14px] leading-none">⚡</div> },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2 hover:text-zinc-300 transition-colors">
                {item.el}
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section id="produto" className="relative z-10 py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold tracking-widest text-blue-400 uppercase font-manrope mb-3">
              Produto
            </p>
            <h2 className="text-3xl md:text-5xl font-black font-manrope tracking-tight text-white mb-4">
              Tudo para vender via{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #1a56ff, #00c8ff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                mensagem direta
              </span>
            </h2>
            <p className="text-zinc-500 text-base max-w-md mx-auto">
              Do primeiro contato ao fechamento — o Invox automatiza cada etapa da sua jornada de vendas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`p-6 rounded-2xl border ${f.border} ${f.bg} hover:border-opacity-60 transition-all group animate-fade-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className={`w-11 h-11 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}
                >
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-[15px] font-semibold text-white font-manrope mb-2">{f.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="p-8 rounded-2xl border border-white/8 bg-white/[0.02]">
            <p className="text-[11px] font-bold tracking-widest text-zinc-600 uppercase font-manrope mb-8 text-center">
              Como funciona
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div key={step.number}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-4xl font-black font-manrope leading-none"
                      style={{
                        background: "linear-gradient(135deg, #1a56ff, #00c8ff)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-zinc-200 font-manrope mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[12.5px] text-zinc-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="precos" className="relative z-10 py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold tracking-widest text-blue-400 uppercase font-manrope mb-3">
              Preços
            </p>
            <h2 className="text-3xl md:text-5xl font-black font-manrope tracking-tight text-white mb-4">
              Simples e transparente
            </h2>
            <p className="text-zinc-500 text-base max-w-xs mx-auto">
              Comece grátis e escale conforme seu negócio cresce. Sem surpresas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl border p-6 flex flex-col transition-all animate-fade-up",
                  plan.highlight
                    ? "border-blue-500/50 bg-blue-500/[0.07] shadow-2xl shadow-blue-900/20 md:-mt-4 md:pb-10"
                    : "border-white/8 bg-white/[0.02]"
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shadow-lg shadow-blue-900/30">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-5">
                  <h3 className="text-[15px] font-bold text-white font-manrope mb-1">{plan.name}</h3>
                  <p className="text-[12px] text-zinc-500 mb-5">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    {plan.price !== "0" && (
                      <span className="text-[14px] text-zinc-400 mb-1.5">R$</span>
                    )}
                    <span className="text-5xl font-black font-manrope text-white leading-none">
                      {plan.price === "0" ? "Grátis" : plan.price}
                    </span>
                    {plan.price !== "0" && (
                      <span className="text-[12px] text-zinc-500 mb-1.5">/{plan.period}</span>
                    )}
                  </div>
                  {plan.price === "0" && (
                    <p className="text-[11px] text-zinc-600 mt-1">{plan.period}</p>
                  )}
                </div>

                <Link
                  href={plan.ctaHref}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all mb-6",
                    plan.highlight
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-lg shadow-blue-900/30"
                      : "border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200"
                  )}
                >
                  {plan.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex flex-col gap-2.5">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5">
                      <Check
                        className={cn(
                          "w-4 h-4 flex-shrink-0 mt-0.5",
                          plan.highlight ? "text-blue-400" : "text-zinc-600"
                        )}
                      />
                      <span className="text-[12.5px] text-zinc-400">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[11.5px] text-zinc-600 mt-8">
            Todos os planos incluem SSL, backups automáticos e infraestrutura na Cloudflare.
            <br />
            Cancele a qualquer momento, sem fidelidade.
          </p>
        </div>
      </section>

      {/* ── Blog ── */}
      <section id="blog" className="relative z-10 py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-blue-400 uppercase font-manrope mb-2">
                Blog
              </p>
              <h2 className="text-2xl md:text-4xl font-black font-manrope tracking-tight text-white">
                Aprenda a vender mais
              </h2>
            </div>
            <span className="text-[11px] px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold uppercase tracking-widest">
              Em breve
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {blogPosts.map((post) => (
              <div
                key={post.title}
                className="p-5 rounded-2xl border border-white/8 bg-white/[0.02] opacity-50 select-none"
              >
                <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-3">
                  {post.tag}
                </span>
                <h3 className="text-[13.5px] font-semibold text-zinc-300 font-manrope leading-snug mb-4">
                  {post.title}
                </h3>
                <p className="text-[11px] text-zinc-700">Em breve</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/25 p-10 text-center">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,86,255,0.12), transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <div className="flex justify-center mb-5">
                <InvoxLogo size={52} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black font-manrope tracking-tight text-white mb-3">
                Comece a vender hoje
              </h2>
              <p className="text-zinc-400 text-base mb-8 max-w-sm mx-auto">
                Configure sua primeira automação em menos de 5 minutos. Grátis, sem cartão.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = `/signup${heroEmail ? `?email=${encodeURIComponent(heroEmail)}` : ""}`;
                }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={heroEmail}
                  onChange={(e) => setHeroEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="flex-1 h-12 px-4 rounded-xl bg-white/6 border border-white/10 text-white placeholder:text-zinc-600 text-[13.5px] outline-none focus:border-blue-500/50 transition-colors"
                />
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[13.5px] font-bold transition-all shadow-lg shadow-blue-900/30 whitespace-nowrap"
                >
                  Criar conta grátis
                </button>
              </form>
              <p className="text-[11px] text-zinc-600 mt-3">
                Grátis para sempre · Sem cartão de crédito · Cancele quando quiser
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/6 py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <InvoxLogo size={22} />
            <span className="text-[15px] font-bold font-manrope tracking-tight">Invox</span>
          </div>
          <div className="flex gap-7 text-[12.5px] text-zinc-500">
            <a href="#produto" className="hover:text-zinc-300 transition-colors">Produto</a>
            <a href="#precos" className="hover:text-zinc-300 transition-colors">Preços</a>
            <a href="#blog" className="hover:text-zinc-300 transition-colors">Blog</a>
            <Link href="/login" className="hover:text-zinc-300 transition-colors">Entrar</Link>
          </div>
          <p className="text-[11.5px] text-zinc-600">© 2025 Invox. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
