import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, profile, chatHistory } = await request.json();

    const systemPrompt = `Você é o NutriMatch AI, um nutricionista virtual especializado em:
- Criar planos alimentares personalizados
- Sugerir substituições de alimentos
- Calcular calorias e macronutrientes
- Dar dicas de economia em compras
- Motivar usuários a alcançar seus objetivos

Perfil do usuário:
- Nome: ${profile.name}
- Idade: ${profile.age} anos
- Peso: ${profile.weight}kg
- Altura: ${profile.height}cm
- Objetivo: ${profile.goal}
- Orçamento: ${profile.budget}
- Restrições: ${profile.restrictions || 'Nenhuma'}

Seja amigável, motivacional e sempre forneça informações práticas e baseadas em ciência.
Use emojis quando apropriado para tornar a conversa mais leve.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...chatHistory.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.message,
      })),
      { role: 'user' as const, content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.8,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    return NextResponse.json({ success: true, message: aiResponse });
  } catch (error: any) {
    console.error('Erro no chat:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
