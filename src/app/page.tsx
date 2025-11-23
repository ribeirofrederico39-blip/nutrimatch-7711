"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PremiumModal } from "@/components/PremiumModal";
import { 
  Calculator, 
  Target, 
  DollarSign, 
  Apple, 
  User,
  Bot,
  ChefHat,
  Crown,
  Lock,
  TrendingUp,
  Calendar,
  ShoppingCart,
  RefreshCw,
  Bell,
  BarChart3,
  Sparkles,
  Check
} from "lucide-react";

interface UserProfile {
  name: string;
  age: string;
  weight: string;
  height: string;
  gender: string;
  activity: string;
  goal: string;
  budget: string;
  restrictions: string;
}

interface MealPlan {
  calories: number;
  meals: {
    name: string;
    foods: string[];
    calories: number;
    cost: number;
    macros: { protein: number; carbs: number; fat: number };
  }[];
  totalCost: number;
  budgetType: string;
}

export default function NutriMatch() {
  const [step, setStep] = useState<'welcome' | 'onboarding' | 'dashboard'>('welcome');
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: '',
    goal: '',
    budget: '',
    restrictions: ''
  });
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'ai', message: string}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [plansGeneratedThisMonth, setPlansGeneratedThisMonth] = useState(0);
  const [aiConsultationsThisMonth, setAiConsultationsThisMonth] = useState(0);

  const calculateIMC = () => {
    if (!profile.weight || !profile.height) return 0;
    const weight = parseFloat(profile.weight);
    const height = parseFloat(profile.height) / 100;
    return weight / (height * height);
  };

  const calculateTMB = () => {
    if (!profile.weight || !profile.height || !profile.age || !profile.gender) return 0;
    const weight = parseFloat(profile.weight);
    const height = parseFloat(profile.height);
    const age = parseFloat(profile.age);
    
    if (profile.gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  };

  const canGeneratePlan = () => {
    return isPremium || plansGeneratedThisMonth < 1;
  };

  const canUseAIChat = () => {
    return isPremium || aiConsultationsThisMonth < 3;
  };

  const generateMealPlan = async () => {
    if (!canGeneratePlan()) {
      setShowPremiumModal(true);
      return;
    }

    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tmb = calculateTMB();
    const activityMultiplier = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    }[profile.activity] || 1.2;
    
    const goalMultiplier = {
      'lose': 0.8,
      'maintain': 1.0,
      'gain': 1.2
    }[profile.goal] || 1.0;
    
    const targetCalories = Math.round(tmb * activityMultiplier * goalMultiplier);
    
    const budgetMeals = {
      'low': {
        breakfast: { foods: ['Aveia', 'Banana', 'Leite'], cost: 3.50 },
        lunch: { foods: ['Arroz', 'Feijão', 'Frango', 'Salada'], cost: 8.00 },
        snack: { foods: ['Pão integral', 'Queijo branco'], cost: 2.50 },
        dinner: { foods: ['Ovo', 'Batata doce', 'Brócolis'], cost: 5.00 }
      },
      'medium': {
        breakfast: { foods: ['Granola', 'Iogurte grego', 'Frutas vermelhas'], cost: 6.00 },
        lunch: { foods: ['Quinoa', 'Salmão', 'Aspargos', 'Salada mista'], cost: 15.00 },
        snack: { foods: ['Castanhas', 'Maçã'], cost: 4.00 },
        dinner: { foods: ['Peito de peru', 'Batata doce', 'Couve-flor'], cost: 12.00 }
      },
      'high': {
        breakfast: { foods: ['Açaí orgânico', 'Granola artesanal', 'Frutas exóticas'], cost: 12.00 },
        lunch: { foods: ['Filé mignon', 'Risotto de cogumelos', 'Rúcula'], cost: 25.00 },
        snack: { foods: ['Mix de nuts premium', 'Smoothie detox'], cost: 8.00 },
        dinner: { foods: ['Bacalhau', 'Quinoa tricolor', 'Legumes grelhados'], cost: 22.00 }
      }
    };
    
    const selectedMeals = budgetMeals[profile.budget as keyof typeof budgetMeals];
    
    const plan: MealPlan = {
      calories: targetCalories,
      meals: [
        {
          name: 'Café da Manhã',
          foods: selectedMeals.breakfast.foods,
          calories: Math.round(targetCalories * 0.25),
          cost: selectedMeals.breakfast.cost,
          macros: { protein: 15, carbs: 45, fat: 20 }
        },
        {
          name: 'Almoço',
          foods: selectedMeals.lunch.foods,
          calories: Math.round(targetCalories * 0.35),
          cost: selectedMeals.lunch.cost,
          macros: { protein: 35, carbs: 40, fat: 25 }
        },
        {
          name: 'Lanche',
          foods: selectedMeals.snack.foods,
          calories: Math.round(targetCalories * 0.15),
          cost: selectedMeals.snack.cost,
          macros: { protein: 10, carbs: 20, fat: 15 }
        },
        {
          name: 'Jantar',
          foods: selectedMeals.dinner.foods,
          calories: Math.round(targetCalories * 0.25),
          cost: selectedMeals.dinner.cost,
          macros: { protein: 30, carbs: 25, fat: 20 }
        }
      ],
      totalCost: Object.values(selectedMeals).reduce((sum, meal) => sum + meal.cost, 0),
      budgetType: profile.budget
    };
    
    setMealPlan(plan);
    setPlansGeneratedThisMonth(plansGeneratedThisMonth + 1);
    setIsGenerating(false);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    if (!canUseAIChat()) {
      setShowPremiumModal(true);
      return;
    }
    
    const responses = [
      `Perfeito! Com base no seu perfil (${profile.goal === 'lose' ? 'emagrecimento' : profile.goal === 'gain' ? 'ganho de massa' : 'manutenção'}), recomendo focar em ${profile.goal === 'lose' ? 'déficit calórico controlado com proteínas magras' : profile.goal === 'gain' ? 'superávit calórico com foco em proteínas e carboidratos complexos' : 'equilíbrio nutricional'}. Posso ajustar seu plano conforme sua preferência de orçamento!`,
      `Ótima pergunta! Para o seu objetivo, sugiro manter uma alimentação balanceada com ${profile.budget === 'low' ? 'opções econômicas como ovos, frango e legumes da estação' : profile.budget === 'medium' ? 'proteínas de qualidade e carboidratos complexos' : 'alimentos premium e orgânicos'}. Isso vai te ajudar a alcançar suas metas de forma saudável!`,
      `Entendo sua dúvida! Com ${Math.round(calculateTMB())} kcal de TMB e seu nível de atividade, você precisa de aproximadamente ${Math.round(calculateTMB() * 1.5)} kcal/dia. Vou te ajudar a distribuir isso nas refeições de forma inteligente!`,
      `Excelente! Para substituições mais econômicas, você pode trocar: Salmão → Sardinha ou Atum em lata | Quinoa → Arroz integral | Castanhas → Amendoim. Todas mantêm bom valor nutricional!`,
      `Dica importante: ${profile.goal === 'lose' ? 'Para emagrecer, mantenha déficit de 300-500 kcal/dia' : profile.goal === 'gain' ? 'Para ganhar massa, adicione 300-500 kcal/dia' : 'Para manter, equilibre calorias consumidas e gastas'}. Hidratação também é fundamental - beba pelo menos 2L de água por dia!`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const newMessages = [
      ...chatMessages,
      { role: 'user' as const, message: chatInput },
      { role: 'ai' as const, message: randomResponse }
    ];
    
    setChatMessages(newMessages);
    setAiConsultationsThisMonth(aiConsultationsThisMonth + 1);
    setChatInput('');
  };

  const handleUpgrade = () => {
    setIsPremium(true);
    setShowPremiumModal(false);
    alert('🎉 Parabéns! Você agora é Premium! Em produção, isso seria integrado com Stripe.');
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8FD694] via-white to-[#FF9E4A] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl border-2 border-[#8FD694]/20">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#8FD694] to-[#FF9E4A] rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <ChefHat className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] bg-clip-text text-transparent mb-3">
                NutriMatch
              </CardTitle>
              <CardDescription className="text-lg text-gray-700 font-medium">
                Seu nutricionista virtual que equilibra saúde e economia
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-[#8FD694]/10 rounded-lg">
                <Calculator className="w-6 h-6 text-[#8FD694] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Cálculo Inteligente</h3>
                  <p className="text-sm text-gray-600">IMC e TMB automáticos</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#FF9E4A]/10 rounded-lg">
                <Target className="w-6 h-6 text-[#FF9E4A] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Metas Personalizadas</h3>
                  <p className="text-sm text-gray-600">Seu objetivo, seu plano</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#8FD694]/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-[#8FD694] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">Análise de Custo</h3>
                  <p className="text-sm text-gray-600">Coma bem gastando menos</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-[#FF9E4A]/10 rounded-lg">
                <Bot className="w-6 h-6 text-[#FF9E4A] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800">IA Nutricional</h3>
                  <p className="text-sm text-gray-600">Assistente 24/7</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#8FD694]/20 to-[#FF9E4A]/20 p-6 rounded-lg border border-[#8FD694]/30">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF9E4A]" />
                O que torna o NutriMatch único?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FD694] flex-shrink-0 mt-0.5" />
                  <span>Planos alimentares adaptados ao seu bolso</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FD694] flex-shrink-0 mt-0.5" />
                  <span>Substituições inteligentes de alimentos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FD694] flex-shrink-0 mt-0.5" />
                  <span>Comparativo de preços por categoria</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#8FD694] flex-shrink-0 mt-0.5" />
                  <span>Acompanhamento de progresso visual</span>
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={() => setStep('onboarding')} 
              className="w-full bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] hover:opacity-90 text-white font-bold py-6 text-lg shadow-lg"
            >
              Começar Minha Jornada Gratuita
            </Button>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600 font-medium">
                ✨ Plano Gratuito: 1 dieta + 3 consultas IA/mês
              </p>
              <p className="text-xs text-gray-500">
                Upgrade para Premium: planos ilimitados por R$ 30/mês
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-[#8FD694]/10 p-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8FD694] to-[#FF9E4A] rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Vamos conhecer você!</h1>
            <p className="text-gray-600 text-lg">Essas informações me ajudam a criar o plano perfeito para seu estilo de vida</p>
          </div>

          <Card className="shadow-xl border-2 border-[#8FD694]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <User className="w-6 h-6 text-[#8FD694]" />
                Perfil Pessoal
              </CardTitle>
              <CardDescription>Preencha seus dados para uma análise precisa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name" className="text-base font-semibold">Nome</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    placeholder="Como você se chama?"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-base font-semibold">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile({...profile, age: e.target.value})}
                    placeholder="Quantos anos você tem?"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-base font-semibold">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={profile.weight}
                    onChange={(e) => setProfile({...profile, weight: e.target.value})}
                    placeholder="Ex: 70"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-base font-semibold">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.height}
                    onChange={(e) => setProfile({...profile, height: e.target.value})}
                    placeholder="Ex: 170"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Gênero</Label>
                <Select value={profile.gender} onValueChange={(value) => setProfile({...profile, gender: value})}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecione seu gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-semibold">Nível de Atividade Física</Label>
                <Select value={profile.activity} onValueChange={(value) => setProfile({...profile, activity: value})}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Como é sua rotina?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentário (trabalho sentado, pouco exercício)</SelectItem>
                    <SelectItem value="light">Levemente ativo (exercício 1-3x/semana)</SelectItem>
                    <SelectItem value="moderate">Moderadamente ativo (exercício 3-5x/semana)</SelectItem>
                    <SelectItem value="active">Muito ativo (exercício 6-7x/semana)</SelectItem>
                    <SelectItem value="very-active">Extremamente ativo (2x/dia ou trabalho físico)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-semibold">Objetivo Principal</Label>
                <Select value={profile.goal} onValueChange={(value) => setProfile({...profile, goal: value})}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="O que você quer alcançar?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">🔥 Emagrecimento</SelectItem>
                    <SelectItem value="maintain">⚖️ Manutenção do peso</SelectItem>
                    <SelectItem value="gain">💪 Ganho de massa muscular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-semibold">Orçamento Alimentar Diário</Label>
                <Select value={profile.budget} onValueChange={(value) => setProfile({...profile, budget: value})}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Quanto você pode investir por dia?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">💰 Econômico (R$ 15-25/dia)</SelectItem>
                    <SelectItem value="medium">💳 Intermediário (R$ 30-50/dia)</SelectItem>
                    <SelectItem value="high">💎 Premium (R$ 60+/dia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="restrictions" className="text-base font-semibold">Restrições Alimentares (opcional)</Label>
                <Textarea
                  id="restrictions"
                  value={profile.restrictions}
                  onChange={(e) => setProfile({...profile, restrictions: e.target.value})}
                  placeholder="Ex: vegetariano, intolerância à lactose, alergia a amendoim..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <Button 
                onClick={() => setStep('dashboard')} 
                className="w-full bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] hover:opacity-90 text-white font-bold py-6 text-lg"
                disabled={!profile.name || !profile.weight || !profile.height || !profile.goal || !profile.budget}
              >
                Criar Meu Plano Nutricional Agora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8FD694] to-[#FF9E4A] rounded-full flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] bg-clip-text text-transparent">
                  NutriMatch
                </h1>
                <p className="text-sm text-gray-600">Olá, {profile.name}! 👋</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isPremium ? (
                <Badge className="bg-gradient-to-r from-[#FF9E4A] to-[#8FD694] text-white border-none px-4 py-2">
                  <Crown className="w-4 h-4 mr-2" />
                  Premium Ativo
                </Badge>
              ) : (
                <Button
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-gradient-to-r from-[#FF9E4A] to-[#8FD694] hover:opacity-90 text-white font-semibold"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Seja Premium
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-14">
            <TabsTrigger value="dashboard" className="text-base">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="plan" className="text-base">
              <Apple className="w-4 h-4 mr-2" />
              Plano Alimentar
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-base">
              <Bot className="w-4 h-4 mr-2" />
              Consulta IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Banner Premium */}
            {!isPremium && (
              <Card className="bg-gradient-to-r from-[#8FD694]/20 via-white to-[#FF9E4A]/20 border-2 border-[#8FD694]/30 shadow-lg">
                <CardContent className="flex flex-col md:flex-row items-center justify-between p-8 gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF9E4A] to-[#8FD694] rounded-full flex items-center justify-center shadow-lg">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Desbloqueie Todo o Potencial</h3>
                      <p className="text-gray-700 font-medium">Planos ilimitados, consultas IA sem limites e muito mais por apenas <span className="text-[#FF9E4A] font-bold">R$ 30/mês</span></p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowPremiumModal(true)}
                    className="bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] hover:opacity-90 text-white font-bold px-8 py-6 text-lg whitespace-nowrap"
                  >
                    Ver Todos os Benefícios
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-2 border-[#8FD694]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">IMC Atual</CardTitle>
                  <Calculator className="h-5 w-5 text-[#8FD694]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-800">{calculateIMC().toFixed(1)}</div>
                  <p className="text-sm text-gray-600 mt-1 font-medium">
                    {calculateIMC() < 18.5 ? '⚠️ Abaixo do peso' : 
                     calculateIMC() < 25 ? '✅ Peso normal' : 
                     calculateIMC() < 30 ? '⚠️ Sobrepeso' : '🚨 Obesidade'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#FF9E4A]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">TMB Diária</CardTitle>
                  <TrendingUp className="h-5 w-5 text-[#FF9E4A]" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-800">{Math.round(calculateTMB())}</div>
                  <p className="text-sm text-gray-600 mt-1 font-medium">calorias/dia</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#8FD694]/20 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Meta Atual</CardTitle>
                  <Target className="h-5 w-5 text-[#8FD694]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-800">
                    {profile.goal === 'lose' ? '🔥 Emagrecimento' : 
                     profile.goal === 'gain' ? '💪 Ganho de Massa' : '⚖️ Manutenção'}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 font-medium">objetivo definido</p>
                </CardContent>
              </Card>
            </div>

            {/* Ação Principal */}
            <Card className="border-2 border-[#8FD694]/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Apple className="w-7 h-7 text-[#8FD694]" />
                  Gerar Plano Alimentar Personalizado
                </CardTitle>
                <CardDescription className="text-base">
                  Com base no seu perfil, vou criar um plano nutricional que se adapta ao seu orçamento e objetivos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isPremium && (
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
                    <p className="text-sm text-amber-900 font-medium flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Plano Gratuito: {plansGeneratedThisMonth}/1 plano gerado este mês
                    </p>
                  </div>
                )}
                {!mealPlan ? (
                  <Button 
                    onClick={generateMealPlan} 
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] hover:opacity-90 text-white font-bold py-6 text-lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Analisando seu perfil e criando plano ideal...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Gerar Meu Plano Nutricional Agora
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-center p-6 bg-green-50 border-2 border-green-300 rounded-lg">
                    <p className="text-green-700 font-bold text-lg mb-2">✅ Plano gerado com sucesso!</p>
                    <p className="text-green-600">Acesse a aba "Plano Alimentar" para ver todos os detalhes</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#8FD694]" />
                    Rotina Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Planeje suas refeições para a semana toda com base no seu orçamento</p>
                  {!isPremium && (
                    <Badge className="mt-3 bg-amber-100 text-amber-800 border-amber-300">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#FF9E4A]" />
                    Lista de Compras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Gere automaticamente sua lista de compras com preços estimados</p>
                  {!isPremium && (
                    <Badge className="mt-3 bg-amber-100 text-amber-800 border-amber-300">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-[#8FD694]" />
                    Substituições Inteligentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Encontre alternativas mais baratas ou saudáveis para qualquer alimento</p>
                  {!isPremium && (
                    <Badge className="mt-3 bg-amber-100 text-amber-800 border-amber-300">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#FF9E4A]" />
                    Lembretes Personalizados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Receba notificações para refeições e hidratação no horário certo</p>
                  {!isPremium && (
                    <Badge className="mt-3 bg-amber-100 text-amber-800 border-amber-300">
                      <Lock className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plan" className="space-y-8">
            {mealPlan ? (
              <>
                <Card className="border-2 border-[#8FD694]/30 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl">Seu Plano Nutricional Personalizado</CardTitle>
                        <CardDescription className="text-base mt-2">
                          {mealPlan.calories} kcal/dia • R$ {mealPlan.totalCost.toFixed(2)}/dia
                        </CardDescription>
                      </div>
                      <Badge className="bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] text-white px-4 py-2 text-base">
                        {mealPlan.budgetType === 'low' ? '💰 Econômico' : 
                         mealPlan.budgetType === 'medium' ? '💳 Intermediário' : '💎 Premium'}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mealPlan.meals.map((meal, index) => (
                    <Card key={index} className="border-2 border-gray-200 hover:border-[#8FD694]/50 transition-colors shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center justify-between">
                          <span>{meal.name}</span>
                          <DollarSign className="w-5 h-5 text-[#FF9E4A]" />
                        </CardTitle>
                        <CardDescription className="text-base font-medium">
                          {meal.calories} kcal • R$ {meal.cost.toFixed(2)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-3 text-gray-700">Alimentos:</h4>
                            <div className="flex flex-wrap gap-2">
                              {meal.foods.map((food, i) => (
                                <Badge key={i} variant="outline" className="text-sm px-3 py-1">
                                  {food}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3 text-gray-700">Macronutrientes:</h4>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <div className="text-xl font-bold text-blue-600">{meal.macros.protein}g</div>
                                <div className="text-xs text-gray-600 font-medium">Proteína</div>
                              </div>
                              <div className="text-center p-3 bg-green-50 rounded-lg">
                                <div className="text-xl font-bold text-green-600">{meal.macros.carbs}g</div>
                                <div className="text-xs text-gray-600 font-medium">Carboidrato</div>
                              </div>
                              <div className="text-center p-3 bg-orange-50 rounded-lg">
                                <div className="text-xl font-bold text-orange-600">{meal.macros.fat}g</div>
                                <div className="text-xs text-gray-600 font-medium">Gordura</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-gradient-to-r from-[#8FD694]/10 to-[#FF9E4A]/10 border-2 border-[#8FD694]/30">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FF9E4A]" />
                      Dicas do NutriMatch
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#8FD694] flex-shrink-0 mt-0.5" />
                        <span>Beba pelo menos 2L de água por dia para otimizar resultados</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#8FD694] flex-shrink-0 mt-0.5" />
                        <span>Faça as refeições em horários regulares para manter o metabolismo ativo</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#8FD694] flex-shrink-0 mt-0.5" />
                        <span>Consulte a IA para substituições de alimentos conforme sua preferência</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-2 border-gray-200">
                <CardContent className="text-center py-16">
                  <Apple className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-3">Nenhum plano gerado ainda</h3>
                  <p className="text-gray-500 mb-6 text-lg">Volte ao Dashboard para gerar seu primeiro plano alimentar personalizado</p>
                  <Button 
                    onClick={() => {
                      const dashboardTab = document.querySelector('[value="dashboard"]') as HTMLElement;
                      dashboardTab?.click();
                    }}
                    className="bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] hover:opacity-90 text-white font-semibold px-8 py-3"
                  >
                    Ir para Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="border-2 border-[#8FD694]/30 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Bot className="w-7 h-7 text-[#8FD694]" />
                  Consulta com NutriMatch AI
                </CardTitle>
                <CardDescription className="text-base">
                  Tire suas dúvidas sobre nutrição, substituições de alimentos e ajustes no seu plano
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {!isPremium && (
                    <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
                      <p className="text-sm text-amber-900 font-medium flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Plano Gratuito: {aiConsultationsThisMonth}/3 consultas usadas este mês
                      </p>
                    </div>
                  )}
                  <div className="h-96 border-2 border-gray-200 rounded-lg p-6 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-600 mt-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#8FD694] to-[#FF9E4A] rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bot className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-lg font-semibold mb-6">Olá! Sou sua nutricionista virtual. Como posso ajudar hoje?</p>
                        <div className="space-y-3 max-w-md mx-auto">
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-left hover:border-[#8FD694] transition-colors cursor-pointer">
                            <p className="text-sm font-medium">💡 "Como substituir o frango por uma opção mais barata?"</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-left hover:border-[#8FD694] transition-colors cursor-pointer">
                            <p className="text-sm font-medium">💡 "Posso trocar a aveia por outro cereal?"</p>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-left hover:border-[#8FD694] transition-colors cursor-pointer">
                            <p className="text-sm font-medium">💡 "Quantas calorias tem uma banana?"</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {chatMessages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-lg px-5 py-3 rounded-2xl shadow-md ${
                              msg.role === 'user' 
                                ? 'bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] text-white' 
                                : 'bg-white border-2 border-gray-200'
                            }`}>
                              <div className="flex items-start gap-3">
                                {msg.role === 'ai' && (
                                  <Bot className="w-5 h-5 text-[#8FD694] mt-0.5 flex-shrink-0" />
                                )}
                                <p className="text-sm leading-relaxed">{msg.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Digite sua pergunta sobre nutrição..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={!canUseAIChat()}
                      className="text-base"
                    />
                    <Button 
                      onClick={sendMessage} 
                      className="bg-gradient-to-r from-[#8FD694] to-[#FF9E4A] hover:opacity-90 text-white font-semibold px-8"
                      disabled={!canUseAIChat()}
                    >
                      Enviar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal Premium */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
