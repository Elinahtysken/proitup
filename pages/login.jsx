// pages/login.jsx
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabaseBrowser } from '../lib/supabaseClient'

export default function LoginPage() {
  const supabase = supabaseBrowser()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/')
      else setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) router.replace('/')
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!ready) return null

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1>Logga in eller skapa konto</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}     // lägg t.ex. ['google'] senare om du vill ha OAuth
        magicLink          // aktiverar “magic link” via mail (valfritt)
        redirectTo={typeof window !== 'undefined' ? window.location.origin : undefined}
      />
    </div>
  )
}
