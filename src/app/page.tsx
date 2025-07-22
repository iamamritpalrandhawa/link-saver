/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"

import { supabase } from '@/lib/supabase'
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BookmarkList from "@/components/BookmarkList"
import { Loader2 } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function HomePage() {

  const router = useRouter()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const load = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push("/login")
        return
      }

      const userId = session?.user.id
      setUser(session?.user)

      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (!data || error) return
      setBookmarks(data)
    }

    load()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !user?.id) return

    setLoading(true)
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const access_token = session?.access_token
    if (!access_token) router.replace('/login')

    const res = await fetch("/api/bookmark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, access_token }),
    });


    const result = await res.json()

    if (result.success) {
      setUrl("")
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setBookmarks(data || [])
    }

    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6 pb-0">
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      {/* User info and logout */}
      {user && (
        <div className="flex justify-between items-center border-b pb-4">
          <p className="text-sm text-gray-600">
            Logged in as <strong>{user.email}</strong>
          </p>
          <Button variant="outline" className="cursor-pointer" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}

      <h1 className="text-3xl font-semibold tracking-tight">
        🔗 Link Saver + Summary
      </h1>

      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Input
          type="url"
          placeholder="Paste a link (https://...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>
      </form>

      <div className="space-y-4">
        <BookmarkList bookmarks={bookmarks} />
      </div>
    </main >
  )
}
