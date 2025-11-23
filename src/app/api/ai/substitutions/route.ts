import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { food, reason, profile } = await request.json();

    const prompt = `Sugira substituições inteligentes para este alimento:

Alimento: ${food}
Motivo da substituição: ${reason}
Perfil do usuário:
- Objetivo: ${profile.goal}
- Orçamento: ${profile.budget}
- Restrições: ${profile.restrictions || 'Nenhuma'}

Forneça 3-5 alternativas considerando:
1. Valor nutricional similar
2. Custo (mais barato ou similar)
3. Disponibilidade
4. Sabor e preparo

Retorne APENAS um JSON válido no formato:
{
  "original": {
    "name": "Salmão",
    "calories": 200,
    "protein": 25,
    "cost": 45.00,
    "benefits": ["Rico em ômega-3", "Alta proteína"]
  },
  "alternatives": [
    {
      "name": "Sardinha em lata",
      "calories": 180,
      "protein": 24,
      "cost": 8.00,
      "savings": "82% mais barato",
      "nutritionalComparison": "Similar em ômega-3 e proteína",
      "howToPrepare": "Pode ser consumida direto da lata ou grelhada",
      "availability": "Fácil de encontrar em qualquer supermercado"
    }
  ],
  "recommendation": "Melhor alternativa considerando custo-benefício"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um nutricionista especializado em substituições alimentares inteligentes. Sempre retorne respostas em JSON válido.',
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
    console.error('Erro ao gerar substituições:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
