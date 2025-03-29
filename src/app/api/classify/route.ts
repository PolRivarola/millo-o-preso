import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { idea } = await req.json();

  if (!idea) {
    return NextResponse.json({ error: "Falta la idea" }, { status: 400 });
  }

  try {

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://millo-o-pira.vercel.app",
        "X-Title": "Millo o Pira AI",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: `Te presentaré una idea para una nueva empresa o emprendimiento. Tu tarea es evaluarla y decidir si se trata de una idea que me hará millonario o, por el contrario, una estafa piramidal disfrazada de oportunidad.
                        Siempre iniciá tu respuesta con una sola palabra clave, escrita en mayúsculas: MILLONARIA o PIRAMIDAL
                        Después, agregá una breve explicación con humor o sarcasmo, justificando de forma ligera y creativa tu veredicto.
                        No seas técnico ni sobreanalices: la respuesta debe sentirse como una opinión rápida, irónica y con tono de stand-up.
                        No uses ningún formato adicional, solo la palabra clave + explicación.resentaré una idea para una nueva empresa o emprendimiento, debes analizarla y decidir si se trata de una idea que me hara millonario o simplemente una estafa piramidal. Siempre respondé comenzando con una de estas dos palabras claves en mayúsculas: "MILLONARIA" o "PIRAMIDAL". Luego, escribí una breve explicación graciosa o sarcástica sobre por qué la idea merece ese veredicto, no lo sobreanalizes, simplemente de manera humoristica explica por que decidiste el veredicto`,
          },
          {
            role: "user",
            content: `Mi idea es: ${idea}`,
          },
        ],
      }),
    });

    const data = await res.json();

    const content = data.choices?.[0]?.message?.content || "";

    const isMillo = content.toUpperCase().includes("MILLONARIA");
    const isPira = content.toUpperCase().includes("PIRAMIDAL");

    const verdict = isMillo
      ? "FUTURO MILLONARIO!"
      : isPira
      ? "LA POLICÍA ESTÁ EN CAMINO"
      : "LA POLICÍA ESTÁ EN CAMINO";

    const explanation = content
      .replace(/MILLONARIA|PIRAMIDAL/gi, "")
      .trim();

    return NextResponse.json({
      verdict,
      explanation: explanation || "No fuiste muy claro, pero por si acaso estas rechazado 😅",
    });
  } catch (err) {
    console.error("Error con OpenRouter:", err);
    return NextResponse.json(
      {
        verdict: "LA POLICÍA ESTÁ EN CAMINO",
        explanation: "En este momento la IA esta descansando, vuelva mas tarde",
      },
      { status: 200 }
    );
  }
}
