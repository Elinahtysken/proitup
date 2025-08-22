// pages/api/chat.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { message } = req.body ?? {}
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing message' })
    }

    // Skicka vidare till Cloudflare Worker
    const response = await fetch(process.env.NEXT_PUBLIC_CLOUDFLARE_AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(text || 'Cloudflare AI request failed')
    }

    const data = await response.json()
    res.status(200).json(data) // skicka svaret vidare till klienten
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
