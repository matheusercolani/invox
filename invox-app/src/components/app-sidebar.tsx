"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitBranch,
  MessageSquare,
  Settings,
  ChevronDown,
  Plus,
  Users,
  HelpCircle,
  PanelLeftClose,
} from "lucide-react";
import { InvoxLogo } from "@/components/icons/invox-logo";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InstagramIcon } from "@/components/icons/instagram";
import { WhatsAppIcon } from "@/components/icons/whatsapp";
import { useAuth } from "@/contexts/auth-context";

const navMain = [
  { href: "/dashboard", label: "Inicial", icon: LayoutDashboard },
  { href: "/contacts", label: "Contatos", icon: Users },
  { href: "/flows", label: "Automação", icon: GitBranch },
  { href: "/conversations", label: "Caixa de Entrada", icon: MessageSquare, badge: "12" },
  { href: "/settings", label: "Configurações", icon: Settings },
];

const navBottom = [
  { href: "/profile", label: "Meu Perfil", icon: Users },
  { href: "/help", label: "Ajuda", icon: HelpCircle },
];

function getInitials(name: string): string {
  return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

const PLAN_LABELS: Record<string, string> = { free: "FREE", pro: "PRO", business: "BUSINESS" };

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const displayName = user?.name ?? "Carregando...";
  const initials = user?.name ? getInitials(user.name) : "?";
  const planLabel = PLAN_LABELS[user?.plan ?? "free"] ?? "FREE";

  return (
    <aside className="w-[200px] flex-shrink-0 flex flex-col h-screen border-r border-white/6 bg-sidebar relative">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-white/6 relative z-10">
        <div className="flex items-center gap-2.5">
          <InvoxLogo size={26} />
          <span className="font-bold text-[15px] font-manrope tracking-tight">Invox</span>
        </div>
      </div>

      {/* Account */}
      <div className="px-3 py-2.5 border-b border-white/6 relative z-10">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors group">
            <Avatar className="w-7 h-7 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-[10px] font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[12.5px] font-semibold truncate leading-tight">{displayName}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                <span className="bg-white/8 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase">{planLabel}</span>
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-600 flex-shrink-0 group-hover:text-zinc-400 transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-zinc-950 border-white/10">
            <DropdownMenuItem className="gap-2 text-[12.5px] text-zinc-300 hover:text-white focus:text-white focus:bg-white/5">
              <Plus className="w-3.5 h-3.5" /> {user?.email ?? ""}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              className="gap-2 text-[12.5px] text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/5 cursor-pointer"
            >
              Sair da conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-2.5 flex flex-col gap-0.5 overflow-y-auto relative z-10">
        {navMain.map(({ href, label, icon: Icon, badge }) => {
          const active = pathname === href || (href !== "/dashboard" && href !== "/" && pathname.startsWith(href)) || (href === "/dashboard" && pathname === "/dashboard");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all",
                active
                  ? "bg-blue-500/15 text-blue-300 border border-blue-500/20"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-blue-400" : "text-zinc-600")} />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="h-[18px] min-w-[18px] px-1 text-[9px] bg-blue-500/20 text-blue-300 font-bold rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2.5 pb-3 border-t border-white/6 pt-2.5 flex flex-col gap-0.5 relative z-10">
        {navBottom.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all"
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </Link>
        ))}

        <button className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-zinc-600 hover:text-zinc-300 hover:bg-white/5 transition-all">
          <PanelLeftClose className="w-4 h-4 flex-shrink-0" />
          <span>Recolher</span>
        </button>

        {/* Canais conectados */}
        <div className="px-2 pt-2.5 mt-1 border-t border-white/6">
          <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-bold mb-2 px-1">Canais</p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
              <InstagramIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-[12px] text-zinc-400 flex-1">Instagram</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
              <WhatsAppIcon className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              <span className="text-[12px] text-zinc-400 flex-1">WhatsApp</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="px-2 pt-2.5 mt-1 border-t border-white/6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-zinc-600">Contatos grátis</span>
            <span className="text-[10px] text-zinc-600">0/1000</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1 rounded-full" style={{ width: "0%" }} />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-2.5 px-1">
          <button className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-[11.5px] font-bold font-manrope tracking-wide transition-all shadow-lg shadow-blue-900/30">
            Upgrade Pro
          </button>
        </div>
      </div>
    </aside>
  );
}
