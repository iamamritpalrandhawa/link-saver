'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import { Button } from '@/components/ui/button'
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

import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Label } from '@/components/ui/label'
import { useRedirectIfLoggedIn } from '@/hooks/useRedirectIfLoggedIn'

export default function LoginPage() {
    useRedirectIfLoggedIn()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showErrorDialog, setShowErrorDialog] = useState(false)


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)
        console.log("🚀 ~ handleLogin ~ data:", data)
        if (error) {
            setErrorMessage(error.message)
            setShowErrorDialog(true)
            return
        }

        router.push('/')
    }

    return (

        <main className="min-h-screen flex items-center justify-center px-4">
            <div className='absolute top-4 right-4'>
                <ThemeToggle />
            </div>
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <span
                                        onClick={() => router.push('/forget')}
                                        className="text-sm  hover:underline cursor-pointer"
                                    >
                                        Forgot password?
                                    </span>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <CardFooter className="flex-col gap-2 mt-6 p-0 ">
                            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                                Login
                            </Button>
                        </CardFooter>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <span
                                onClick={() => router.push('/signup')} className="underline underline-offset-4 cursor-pointer">
                                Sign up
                            </span>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Login Failed</DialogTitle>
                        <DialogDescription>{errorMessage}</DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => setShowErrorDialog(false)} className="w-full mt-4">
                        Try Again
                    </Button>
                </DialogContent>
            </Dialog>

        </main>
    )
}
