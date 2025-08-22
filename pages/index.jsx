// pages/index.jsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabaseBrowser } from '../lib/supabaseClient'

export default function Home() {
  const supabase = supabaseBrowser()
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.replace('/login')
      else setUser(data.user)
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  if (!user) return null

  return (
    <main style={{ maxWidth: 720, margin: '40px auto' }}>
      <h1>Välkommen</h1>
      <p>Inloggad som: {user.email}</p>
      <button onClick={logout} style={{ marginTop: 12 }}>Logga ut</button>
      <p style={{ marginTop: 20 }}>
        <Link href="/login">Byt konto</Link>
      </p>
    </main>
  )
}
