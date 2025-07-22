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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useRedirectIfLoggedIn } from '@/hooks/useRedirectIfLoggedIn'

export default function SignupPage() {
    useRedirectIfLoggedIn()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [supabaseError, setSupabaseError] = useState('')

    const validateEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const validatePassword = (password: string) =>
        password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password)

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setEmailError('')
        setPasswordError('')
        setSupabaseError('')

        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address.')
            return
        }

        if (!validatePassword(password)) {
            setPasswordError(
                'Password must be at least 8 characters and include a number and uppercase letter.'
            )
            return
        }

        setLoading(true)
        const { error } = await supabase.auth.signUp({ email, password })
        setLoading(false)

        if (error) {
            if (error.message.includes('already registered')) {
                setSupabaseError('This email is already registered.')
            } else {
                setSupabaseError(error.message)
            }
            return
        }

        setShowDialog(true)
    }

    const handleGoToLogin = () => {
        setShowDialog(false)
        router.push('/login')
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>Sign up with email & password</CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSignUp} className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {emailError && (
                                <p className="text-sm text-red-600">{emailError}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {passwordError && (
                                <p className="text-sm text-red-600">{passwordError}</p>
                            )}
                        </div>

                        {supabaseError && (
                            <p className="text-sm text-red-600 text-center">{supabaseError}</p>
                        )}

                        <CardFooter className="p-0">
                            <Button
                                type="submit"
                                className="w-full cursor-pointer"
                                disabled={loading}
                            >
                                Sign Up
                            </Button>
                        </CardFooter>

                        <div className="text-center text-sm cursor-pointer">
                            Already have an account?{' '}
                            <span
                                onClick={() => router.push('/login')}
                                className="underline underline-offset-4"
                            >
                                Login
                            </span>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Almost done!</DialogTitle>
                        <DialogDescription>
                            A confirmation email has been sent to <strong>{email}</strong>.
                            Please verify your account before logging in.
                        </DialogDescription>
                    </DialogHeader>
                    <Button className="w-full mt-4" onClick={handleGoToLogin}>
                        Go to Login
                    </Button>
                </DialogContent>
            </Dialog>
        </main>
    )
}
