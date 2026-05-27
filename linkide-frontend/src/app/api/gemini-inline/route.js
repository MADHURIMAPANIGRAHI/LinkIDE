// app/api/gemini-inline/route.js
import { GoogleGenAI } from '@google/genai';

// Initialize the SDK with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req) {
  try {
    const { codeBefore, instruction, language } = await req.json();

    const systemInstruction = `
      You are an elite AI code completion assistant embedded inside a collaborative IDE called DevSync.
      The user is actively writing code in the programming language: ${language}.
      
      Here is the existing code context immediately preceding the user's cursor position:
      """
      ${codeBefore}
      """

      User's explicit instruction at the cursor: "${instruction}"
      
      CRITICAL INSTRUCTIONS:
      1. Provide ONLY the raw, functional source code that fulfills the instruction.
      2. Do NOT wrap the code in markdown blocks (do not use \`\`\`).
      3. Do NOT provide explanations, commentary, or descriptions. 
      4. Ensure proper indentation matching the provided context.
      5. Output nothing but the clean text string to be appended directly at the cursor.
    `;

    // Generate a stream from Gemini
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: systemInstruction,
    });

    // Convert the Gemini stream into a standard Web ReadableStream for the frontend
    const encoder = new TextEncoder();
    const customReadableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          if (chunk.text) {
            controller.enqueue(encoder.encode(chunk.text));
          }
        }
        controller.close();
      },
    });

    return new Response(customReadableStream, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
    });
  } catch (error) {
    console.error("Gemini Route Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
