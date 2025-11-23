import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { weeklyPlan, budget } = await request.json();

    const prompt = `Com base neste plano alimentar semanal, crie uma lista de compras otimizada:

${JSON.stringify(weeklyPlan, null, 2)}

Orçamento: ${budget}

Agrupe os ingredientes por categoria (Proteínas, Carboidratos, Vegetais, Frutas, Laticínios, Outros).
Para cada item, inclua:
- Nome do produto
- Quantidade total necessária para a semana
- Preço estimado unitário
- Preço total
- Sugestões de onde comprar mais barato (supermercado, feira, atacado)

Retorne APENAS um JSON válido no formato:
{
  "categories": [
    {
      "name": "Proteínas",
      "items": [
        {
          "product": "Peito de frango",
          "quantity": "2kg",
          "unitPrice": 15.90,
          "totalPrice": 31.80,
          "whereToBuy": "Atacado ou açougue"
        }
      ],
      "categoryTotal": 80.00
    }
  ],
  "totalCost": 175.00,
  "savingTips": ["Dica 1", "Dica 2"],
  "alternatives": [
    {
      "original": "Salmão",
      "cheaper": "Sardinha ou atum em lata",
      "savings": "Economia de até 60%"
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em compras inteligentes e economia doméstica. Sempre retorne respostas em JSON válido.',
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
    console.error('Erro ao gerar lista de compras:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
