import { GoogleGenAI, Type } from '@google/genai'

// Modelo configurable por env; por defecto un "flash lite" (rápido y barato,
// suficiente para leer un comprobante). 'gemini-flash-lite-latest' sigue
// siempre la última versión estable del flash-lite.
const MODEL = process.env.GEMINI_MODEL ?? 'gemini-flash-lite-latest'

export type ExtractedReceipt = {
  isReceipt: boolean // ¿la imagen parece un comprobante SINPE legible?
  amount: number | null // monto en colones (entero)
  reference: string | null // referencia / número de comprobante SINPE
  sender: string | null // nombre de quien envió
  date: string | null // fecha del pago (YYYY-MM-DD)
}

const PROMPT = `Eres un asistente que lee comprobantes de SINPE Móvil de Costa Rica.
Analiza la imagen y extrae los datos del pago. Reglas:
- amount: el monto en colones como número entero, sin símbolo ₡, sin separadores de miles ni decimales (ej: 20000).
- reference: el número de referencia o comprobante de la transacción, tal cual aparece.
- sender: el nombre de la persona que realizó/envió el pago.
- date: la fecha del pago en formato YYYY-MM-DD.
- isReceipt: true solo si la imagen es realmente un comprobante de pago SINPE legible; false si es otra cosa o no se puede leer.
Si algún dato no es legible o no aparece, devuélvelo como null (no lo inventes).`

// Llama a Gemini (visión) para extraer los datos del comprobante.
// Devuelve null si la llamada falla por completo (error de red/API).
export async function extractReceiptData(
  base64: string,
  mimeType: string
): Promise<ExtractedReceipt | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          role: 'user',
          parts: [{ text: PROMPT }, { inlineData: { mimeType, data: base64 } }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isReceipt: { type: Type.BOOLEAN },
            amount: { type: Type.INTEGER, nullable: true },
            reference: { type: Type.STRING, nullable: true },
            sender: { type: Type.STRING, nullable: true },
            date: { type: Type.STRING, nullable: true },
          },
          required: ['isReceipt'],
        },
      },
    })

    const text = response.text
    if (!text) return null

    const raw = JSON.parse(text) as Partial<ExtractedReceipt>
    return {
      isReceipt: Boolean(raw.isReceipt),
      amount: typeof raw.amount === 'number' ? Math.round(raw.amount) : null,
      reference: raw.reference ? String(raw.reference).trim() : null,
      sender: raw.sender ? String(raw.sender).trim() : null,
      date: normalizeDate(raw.date),
    }
  } catch (e) {
    console.error('extractReceiptData falló:', (e as Error).message)
    return null
  }
}

// Normaliza la fecha a YYYY-MM-DD; acepta también DD/MM/YYYY.
function normalizeDate(value: unknown): string | null {
  if (!value || typeof value !== 'string') return null
  const s = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const dmy = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (dmy) {
    const [, d, m, y] = dmy
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return null
}
