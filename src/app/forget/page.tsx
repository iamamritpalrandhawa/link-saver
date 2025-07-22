'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
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

export default function ForgetPasswordPage() {
    useRedirectIfLoggedIn()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset`,
        })

        setLoading(false)

        if (error) {
            setErrorMessage(error.message)
            setShowDialog(true)
        } else {
            setErrorMessage('')
            setShowDialog(true)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Forgot your password?</CardTitle>
                    <CardDescription>We&apos;ll send you a reset link</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleReset} className="flex flex-col gap-6">
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
                        </div>
                        <CardFooter className="p-0 mt-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Sending...' : 'Send reset link'}
                            </Button>
                        </CardFooter>
                        <div className="text-sm mt-4 text-center">
                            Remember password?{' '}
                            <span
                                onClick={() => router.push('/login')}
                                className="underline underline-offset-4 cursor-pointer"
                            >
                                Login
                            </span>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Dialog for feedback */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>
                            {errorMessage ? 'Reset Failed' : 'Email Sent!'}
                        </DialogTitle>
                        <DialogDescription>
                            {errorMessage
                                ? errorMessage
                                : `A reset email has been sent to ${email}. Check your inbox.`}
                        </DialogDescription>
                    </DialogHeader>
                    <Button className="w-full mt-4" onClick={() => {
                        setShowDialog(false)
                        router.push('/login')
                    }}>
                        OK
                    </Button>
                </DialogContent>
            </Dialog>
        </main>
    )
}
