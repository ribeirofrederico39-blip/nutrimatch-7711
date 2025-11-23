"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Sparkles, TrendingUp, Calendar, MessageSquare, BarChart3 } from "lucide-react";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function PremiumModal({ isOpen, onClose, onUpgrade }: PremiumModalProps) {
  const premiumFeatures = [
    {
      icon: <Sparkles className="w-5 h-5 text-[#FF9E4A]" />,
      title: "Planos Ilimitados",
      description: "Gere quantos planos alimentares quiser, sem limites mensais"
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-[#FF9E4A]" />,
      title: "Consultas IA Ilimitadas",
      description: "Tire dúvidas e peça ajustes sem restrições"
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-[#FF9E4A]" />,
      title: "Histórico Completo",
      description: "Acompanhe toda sua evolução com gráficos detalhados"
    },
    {
      icon: <Calendar className="w-5 h-5 text-[#FF9E4A]" />,
      title: "Planejamento Semanal",
      description: "Receba planos para a semana inteira com lista de compras"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-[#FF9E4A]" />,
      title: "Análise Avançada",
      description: "Comparativo de preços por região e sugestões personalizadas"
    },
    {
      icon: <Crown className="w-5 h-5 text-[#FF9E4A]" />,
      title: "Suporte Prioritário",
      description: "Atendimento preferencial e respostas mais rápidas"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF9E4A] to-[#8FD694] rounded-full flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Desbloqueie Todo o Potencial do NutriMatch
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Transforme sua jornada nutricional com recursos premium
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preço */}
          <div className="text-center bg-gradient-to-br from-[#8FD694]/10 to-[#FF9E4A]/10 rounded-lg p-6">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-gray-800">R$ 30</span>
              <span className="text-gray-600">/mês</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Cancele quando quiser, sem compromisso
            </p>
          </div>

          {/* Comparação */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="text-center mb-3">
                <Badge variant="outline" className="mb-2">Gratuito</Badge>
                <p className="text-sm text-gray-600">Plano Atual</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">1 plano/mês</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">3 consultas IA/mês</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">Recursos básicos</span>
                </li>
              </ul>
            </div>

            <div className="border-2 border-[#8FD694] rounded-lg p-4 bg-gradient-to-br from-[#8FD694]/5 to-[#FF9E4A]/5">
              <div className="text-center mb-3">
                <Badge className="mb-2 bg-[#8FD694] text-white">Premium</Badge>
                <p className="text-sm font-medium text-gray-800">Recomendado</p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FD694] mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Planos ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FD694] mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Consultas ilimitadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FD694] mt-0.5 flex-shrink-0" />
                  <span className="font-medium">Todos os recursos</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">O que você ganha com Premium:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-800">{feature.title}</h4>
                    <p className="text-xs text-gray-600 mt-0.5">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button 
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] hover:opacity-90 text-white font-semibold py-6 text-lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Assinar Premium por R$ 30/mês
            </Button>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Continuar com Plano Gratuito
            </Button>
          </div>

          {/* Garantia */}
          <div className="text-center text-xs text-gray-500 border-t pt-4">
            <p>✨ Garantia de 7 dias - cancele sem custo se não gostar</p>
            <p className="mt-1">🔒 Pagamento seguro e dados protegidos</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
