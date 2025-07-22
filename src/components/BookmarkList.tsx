import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

import { supabase } from '@/lib/supabase'
import { ExternalLink, Eye, Calendar, Globe } from "lucide-react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import ReactMarkdown from "react-markdown"

interface Bookmark {
    id: string
    title?: string
    url: string
    summary?: string
    favicon?: string
    createdAt?: string
}

interface BookmarkListProps {
    bookmarks: Bookmark[]
}

export default function BookmarkList({ bookmarks: initialBookmarks = [] }: BookmarkListProps) {
    // Local state for bookmarks so we can update after delete
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
    const [confirmOpen, setConfirmOpen] = useState(false)

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return null
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(dateString))
    }

    // Extract domain from url
    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '')
        } catch {
            return url
        }
    }

    // Handle delete with confirmation dialog
    const handleDelete = async () => {
        if (!selectedBookmark) return

        const { error } = await supabase.from("bookmarks").delete().eq("id", selectedBookmark.id)
        if (error) {
            console.error("Delete failed:", error.message)
            return
        }
        // Update local bookmarks state to remove deleted bookmark
        setBookmarks((prev) => prev.filter((b) => b.id !== selectedBookmark.id))
        setSelectedBookmark(null)
        setConfirmOpen(false)
    }

    const handleCardClick = (bookmark: Bookmark) => {
        setSelectedBookmark(bookmark)
    }

    if (bookmarks.length === 0) {
        return (
            <div className="h-[600px] flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <Globe className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">No bookmarks yet</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                        Start adding bookmarks to see them appear here. Your saved content will be organized and easily searchable.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <ScrollArea className="h-[600px] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookmarks.map((bookmark) => (
                        <Dialog
                            key={bookmark.id}
                            open={selectedBookmark?.id === bookmark.id}
                            onOpenChange={(open) => {
                                if (!open) setSelectedBookmark(null)
                            }}
                        >
                            <DialogTrigger asChild>
                                <Card
                                    className="group cursor-pointer bg-card hover:bg-accent/50 border border-border hover:border-border/80 transition-all duration-200 hover:shadow-lg "
                                    onClick={() => handleCardClick(bookmark)}
                                >
                                    <CardContent className=" space-y-4">
                                        {/* Header with favicon and domain */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                                                    {bookmark.favicon ? (
                                                        <img
                                                            src={bookmark.favicon}
                                                            alt="Site favicon"
                                                            className="w-5 h-5 rounded"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none'
                                                            }}
                                                        />
                                                    ) : (
                                                        <Globe className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <Badge variant="secondary" className="text-xs font-medium">
                                                    {getDomain(bookmark.url)}
                                                </Badge>
                                            </div>
                                            <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        {/* Title */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                {bookmark.title || bookmark.url}
                                            </h3>
                                        </div>

                                        {/* Summary */}
                                        <div className="space-y-3">
                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                                                {bookmark.summary || "No summary available for this bookmark."}
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-2">
                                            {bookmark.createdAt && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(bookmark.createdAt)}
                                                </div>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                asChild
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <a
                                                    href={bookmark.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1"
                                                >
                                                    Visit
                                                    <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>

                            <DialogContent className=" w-[95vw] max-h-[90vh] p-0 ">
                                {selectedBookmark && (
                                    <div className="flex flex-col max-h-[90vh] overflow-hidden">
                                        <DialogHeader className="px-6 py-4 border-b">
                                            <div className="space-y-3">
                                                <DialogTitle className="text-xl font-semibold leading-tight pr-8">
                                                    {selectedBookmark.title || selectedBookmark.url}
                                                </DialogTitle>
                                                <DialogDescription asChild>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            {selectedBookmark.favicon && (
                                                                <img
                                                                    src={selectedBookmark.favicon}
                                                                    alt="Site favicon"
                                                                    className="w-4 h-4 rounded"
                                                                    onError={(e) => {
                                                                        e.currentTarget.style.display = 'none'
                                                                    }}
                                                                />
                                                            )}
                                                            <span className="font-medium">
                                                                {getDomain(selectedBookmark.url)}
                                                            </span>
                                                        </div>
                                                        <Separator orientation="vertical" className="h-4" />
                                                        <a
                                                            href={selectedBookmark.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline flex items-center gap-1 truncate max-w-md"
                                                        >
                                                            {selectedBookmark.url}
                                                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                        </a>
                                                    </div>
                                                </DialogDescription>
                                            </div>
                                        </DialogHeader>

                                        <div className="flex-1 overflow-hidden">
                                            <ScrollArea className="h-full max-h-[calc(90vh-200px)]">
                                                <div className="px-6 py-6">
                                                    {selectedBookmark.summary ? (
                                                        <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic">
                                                            <ReactMarkdown>{selectedBookmark.summary}</ReactMarkdown>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-12">
                                                            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                                                                <Eye className="w-8 h-8 text-muted-foreground" />
                                                            </div>
                                                            <h3 className="font-medium text-lg mb-2">No summary available</h3>
                                                            <p className="text-sm text-muted-foreground mb-4">
                                                                This bookmark doesn't have a summary yet. Visit the original site to view the content.
                                                            </p>
                                                            <Button asChild size="sm">
                                                                <a
                                                                    href={selectedBookmark.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    Visit Original Site
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </div>

                                        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
                                            <div className="flex items-center justify-between w-full">
                                                {selectedBookmark.createdAt && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Calendar className="w-3 h-3" />
                                                        Saved on {formatDate(selectedBookmark.createdAt)}
                                                    </div>
                                                )}
                                                <Button asChild>
                                                    <a
                                                        href={selectedBookmark.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Open Original
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="cursor-pointer"
                                                    onClick={() => setConfirmOpen(true)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </DialogFooter>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            </ScrollArea>

            {/* Confirmation dialog */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this bookmark? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" className="cursor-pointer" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button variant="destructive" className="cursor-pointer" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
