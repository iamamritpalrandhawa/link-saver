'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useRedirectIfLoggedIn } from '@/hooks/useRedirectIfLoggedIn'

export default function ResetPasswordPage() {
    useRedirectIfLoggedIn()
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password })
        setLoading(false)

        if (error) {
            setError(error.message)
        } else {
            setError('')
            router.push('/login')
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Reset your password</CardTitle>
                    <CardDescription>Enter a new secure password</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleReset} className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password">New Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <CardFooter className="p-0 ">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </CardFooter>
                        {error && (
                            <p className="text-red-600 text-sm text-center mt-2">{error}</p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}
