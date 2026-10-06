import { GoogleGenAI, Type } from '@google/genai'
import env from '#start/env'

const ai = new GoogleGenAI({ apiKey: env.get('GEMINI_API_KEY') })

const FALLBACK_MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash-lite']
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

async function generateWithRetry(model: string, params: object, retries = MAX_RETRIES): Promise<any> {
  try {
    return await (ai.models as any).generateContent({ model, ...params })
  } catch (err: any) {
    const isRetryable = err.message?.includes('503') || err.message?.includes('UNAVAILABLE') || err.message?.includes('high demand')
    if (isRetryable && retries > 0) {
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
      return generateWithRetry(model, params, retries - 1)
    }
    throw err
  }
}

export async function parseNaturalLanguageTaskCommand(prompt: string) {
  const currentDate = new Date().toISOString()
  const systemInstruction = `
  Kamu adalah asisten backend untuk task management.
  Tugasmu memetakan bahasa alami menjadi daftar aksi untuk tabel 'tasks'.

  INFO PENTING:
  - Hari ini adalah: ${currentDate}
  - Gunakan informasi ini untuk menghitung dueDate jika user menyebutkan "besok", "minggu depan", dll.

  ATURAN KEAMANAN & FORMAT:
  1. HANYA operasikan tabel 'tasks'. DILARANG KERAS mengubah atau menghapus data tabel 'users'.
  2. JIKA prompt terdeteksi meminta menghapus, mengubah, atau membuat data 'user/pengguna', set properti "rejected" menjadi true dan isi "rejectionReason". Kosongkan array "actions".
  3. Action yang valid hanya: 'CREATE', 'UPDATE', 'DELETE'.
  4. Format dueDate menggunakan standar ISO-8601 (contoh: "2026-10-07T12:00:00.000Z"). Jika tidak disebutkan, biarkan null.
  5. Jika tenggat waktunya dalam waktu dekat (misal besok atau hari ini), setel prioritas (priority) otomatis ke 'high' kecuali jika user meminta prioritas lain.
  `

  const requestParams = {
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rejected: { type: Type.BOOLEAN },
          rejectionReason: { type: Type.STRING, nullable: true },
          actions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                action: { type: Type.STRING, enum: ['CREATE', 'UPDATE', 'DELETE'] },
                taskId: { type: Type.INTEGER, nullable: true },
                projectId: { type: Type.INTEGER, nullable: true },
                title: { type: Type.STRING, nullable: true },
                description: { type: Type.STRING, nullable: true },
                status: { type: Type.STRING, enum: ['todo', 'in_progress', 'done'], nullable: true },
                priority: { type: Type.STRING, enum: ['low', 'medium', 'high'], nullable: true },
                assigneeId: { type: Type.INTEGER, nullable: true },
                dueDate: { type: Type.STRING, nullable: true }
              },
              required: ['action']
            }
          }
        },
        required: ['rejected', 'actions']
      }
    }
  }

  let lastError: any = null

  for (const model of FALLBACK_MODELS) {
    try {
      const response = await generateWithRetry(model, requestParams)
      return JSON.parse(response.text!)
    } catch (err: any) {
      lastError = err
      const is503 = err.message?.includes('503') || err.message?.includes('UNAVAILABLE') || err.message?.includes('high demand')
      const isNotFound = err.message?.includes('404') || err.message?.includes('NOT_FOUND')
      if (is503 || isNotFound) {
        // Coba model berikutnya
        continue
      }
      throw err
    }
  }

  throw lastError
}