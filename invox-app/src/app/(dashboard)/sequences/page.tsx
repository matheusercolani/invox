import { Plus, Clock, Users, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sequences = [
  {
    id: 1,
    name: "Sequência de vendas — Curso X",
    steps: 5,
    duration: "5 dias",
    enrolled: 124,
    completed: 89,
    active: true,
    messages: [
      { day: 1, text: "Olá! Vi que você se interessou pelo curso. Posso te contar mais?" },
      { day: 2, text: "Aqui está o que nossos alunos conquistaram..." },
      { day: 3, text: "Você sabia que a turma fecha em 48h?" },
      { day: 4, text: "Última chance — acesso com bônus exclusivo" },
      { day: 5, text: "A turma fechou, mas guardei uma vaga para você." },
    ],
  },
  {
    id: 2,
    name: "Nutrição de leads — Consultoria",
    steps: 3,
    duration: "3 dias",
    enrolled: 56,
    completed: 38,
    active: true,
    messages: [
      { day: 1, text: "Obrigado pelo interesse! Aqui está o material prometido." },
      { day: 2, text: "Como posso te ajudar a alcançar seus resultados?" },
      { day: 3, text: "Vamos agendar uma call de 15min?" },
    ],
  },
  {
    id: 3,
    name: "Onboarding novos seguidores",
    steps: 2,
    duration: "2 dias",
    enrolled: 312,
    completed: 201,
    active: false,
    messages: [
      { day: 1, text: "Bem-vindo! Sou [nome] e aqui compartilho..." },
      { day: 2, text: "Você tem alguma dúvida? Estou aqui para ajudar!" },
    ],
  },
];

export default function SequencesPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Sequências</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Drip messages automáticas para nutrir seus leads</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 border-0">
          <Plus className="w-4 h-4" />
          Nova sequência
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {sequences.map((seq) => (
          <Card key={seq.id} className="bg-card border-border/50">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{seq.name}</h3>
                    {!seq.active && (
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 border-0">Pausada</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {seq.steps} mensagens · {seq.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {seq.enrolled} inscritos
                    </span>
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle2 className="w-3 h-3" />
                      {seq.completed} completaram
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground">
                  Editar <ChevronRight className="w-3 h-3" />
                </Button>
              </div>

              {/* Steps preview */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {seq.messages.map((msg, i) => (
                  <div key={i} className="flex-shrink-0 w-48 p-3 rounded-lg bg-secondary/50 border border-border/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">{msg.day}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">Dia {msg.day}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{msg.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
