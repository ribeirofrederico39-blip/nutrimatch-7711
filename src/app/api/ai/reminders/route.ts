import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { profile, mealPlan } = await request.json();

    const prompt = `Crie lembretes personalizados para este usuário:

Perfil:
- Nome: ${profile.name}
- Objetivo: ${profile.goal}
- Nível de atividade: ${profile.activity_level}

Plano alimentar:
${JSON.stringify(mealPlan, null, 2)}

Crie lembretes para:
1. Horários de refeições (baseado no plano)
2. Hidratação (baseado no nível de atividade)
3. Exercícios (se aplicável)
4. Dicas motivacionais
5. Preparação de refeições

Retorne APENAS um JSON válido no formato:
{
  "reminders": [
    {
      "type": "meal",
      "title": "Café da Manhã",
      "message": "Hora do café da manhã! Hoje: Aveia com banana 🍌",
      "time": "07:00",
      "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      "icon": "☕"
    },
    {
      "type": "hydration",
      "title": "Hidratação",
      "message": "Beba um copo de água! Meta: 2L por dia 💧",
      "time": "10:00",
      "daysOfWeek": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      "icon": "💧"
    }
  ],
  "motivationalTips": [
    "Você está no caminho certo! Continue assim 💪",
    "Cada refeição saudável é um passo em direção ao seu objetivo 🎯"
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um coach de saúde especializado em criar lembretes motivacionais e personalizados. Sempre retorne respostas em JSON válido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Erro ao gerar lembretes:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
