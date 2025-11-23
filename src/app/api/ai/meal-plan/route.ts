import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { profile } = await request.json();

    const prompt = `Você é um nutricionista especializado. Crie um plano alimentar semanal detalhado para:

Perfil:
- Nome: ${profile.name}
- Idade: ${profile.age} anos
- Peso: ${profile.weight}kg
- Altura: ${profile.height}cm
- Gênero: ${profile.gender}
- Nível de atividade: ${profile.activity_level}
- Objetivo: ${profile.goal}
- Orçamento: ${profile.budget}
- Restrições: ${profile.restrictions || 'Nenhuma'}

Crie um plano semanal (7 dias) com 4 refeições por dia (café da manhã, almoço, lanche, jantar).
Para cada refeição, inclua:
- Nome dos alimentos específicos
- Quantidades em gramas
- Calorias aproximadas
- Macronutrientes (proteína, carboidratos, gordura)
- Custo estimado em reais

Retorne APENAS um JSON válido no formato:
{
  "weeklyPlan": [
    {
      "day": "Segunda-feira",
      "meals": [
        {
          "name": "Café da Manhã",
          "foods": [{"name": "Aveia", "quantity": "50g", "calories": 190}],
          "totalCalories": 350,
          "macros": {"protein": 15, "carbs": 45, "fat": 8},
          "cost": 4.50
        }
      ],
      "totalDayCalories": 2000,
      "totalDayCost": 25.00
    }
  ],
  "totalWeekCost": 175.00,
  "nutritionalSummary": "Resumo nutricional da semana"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um nutricionista especializado em criar planos alimentares personalizados e econômicos. Sempre retorne respostas em JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Erro ao gerar plano semanal:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
