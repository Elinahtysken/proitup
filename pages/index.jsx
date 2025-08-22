'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabaseBrowser } from '../lib/supabaseClient'

export default function Home() {
  const supabase = supabaseBrowser()
  const router = useRouter()
  const [user, setUser] = useState(null)

  const [input, setInput] = useState('')
  const [reply, setReply] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 🔐 kolla om användaren är inloggad
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
      else setUser(data.user)
    })
  }, [])

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setError(null)
    setLoading(true)
    setReply(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Något gick fel')
      setReply(data.reply)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (!user) return null

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>Inloggad som: {user.email}</div>
        <button onClick={logout}>Logga ut</button>
      </header>

      <section style={{ marginTop: 32 }}>
        <h2>What have you eaten today?</h2>
        <p>
          Please describe it as careful as possible, for example:
          <br />
          <em>Two slices of white bread with a slice of cheese and some ham.</em>
        </p>
      </section>

      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your answer here..."
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>

      {loading && <p style={{ marginTop: 20 }}>AI is thinking…</p>}
      {error && <p style={{ marginTop: 20, color: 'crimson' }}>{error}</p>}
      {reply && (
        <div style={{
          marginTop: 20,
          padding: 16,
          border: '1px solid #eee',
          borderRadius: 8,
          background: '#fafafa'
        }}>
          <strong>AI:</strong>
          <div>{reply}</div>
        </div>
      )}
    </main>
  )
}
