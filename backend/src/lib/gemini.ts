import fs from 'fs/promises'
import path from 'path'
import 'dotenv/config'

const API_BASE = process.env.GEMINI_API_BASE || 'https://hiapi.online/v1'
const API_KEY = process.env.GEMINI_API_KEY!
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'

const SYSTEM_PROMPT = `You are a design terminology expert. Analyze the provided image and generate 5-10 precise, professional design terminology keywords that describe the visual design elements, styles, techniques, or concepts shown.

Focus on:
- Visual design principles (e.g., "negative space", "golden ratio", "rule of thirds")
- Color theory terms (e.g., "analogous palette", "complementary contrast", "chromatic aberration")
- Typography terms (e.g., "editorial grid", "typographic hierarchy", "variable fonts")
- Design styles (e.g., "brutalism", "swiss style", "wabi-sabi", "maximalism")
- UI/UX patterns (e.g., "card UI", "glassmorphism", "neumorphism", "skeuomorphism")
- Compositional techniques (e.g., "asymmetric balance", "focal point", "visual rhythm")
- Material/texture terms (e.g., "grain texture", "noise overlay", "halftone pattern")

Respond ONLY with a JSON array of strings, no explanation. Example:
["negative space", "typographic hierarchy", "swiss style", "complementary contrast"]`

export async function generateDesignTerms(imagePath: string): Promise<string[]> {
  const imageBuffer = await fs.readFile(imagePath)
  const base64Image = imageBuffer.toString('base64')
  const ext = path.extname(imagePath).toLowerCase()
  const mimeType =
    ext === '.png' ? 'image/png'
    : ext === '.gif' ? 'image/gif'
    : ext === '.webp' ? 'image/webp'
    : 'image/jpeg'

  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: SYSTEM_PROMPT },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` },
            },
          ],
        },
      ],
      max_tokens: 1024,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API error ${response.status}: ${err}`)
  }

  const data = await response.json() as { choices: { message: { content: string } }[] }
  const text = data.choices?.[0]?.message?.content?.trim() ?? ''

  const match = text.match(/\[[\s\S]*\]/)
  let raw = match ? match[0] : text

  // Repair truncated JSON array: remove trailing comma and close bracket
  raw = raw.trim()
  if (!raw.endsWith(']')) {
    raw = raw.replace(/,\s*$/, '') + ']'
  }

  let terms: string[]
  try {
    terms = JSON.parse(raw)
  } catch {
    // Fallback: extract quoted strings manually
    const found = raw.match(/"([^"]+)"/g)
    if (!found) throw new Error(`Invalid response: ${text}`)
    terms = found.map(s => s.replace(/"/g, ''))
  }

  return terms.slice(0, 10)
}
