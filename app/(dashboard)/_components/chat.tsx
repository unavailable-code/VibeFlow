"use client"
import { socket } from '@/lib/socket'
import { cn } from '@/lib/utils'
import { MessageCircle, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const Chat = ({ roomId, user }: any) => {
    const [messages, setMessages] = useState<any[]>([])
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const [input, setInput] = useState("")

    const formatTime = (time: number) => {
        const date = new Date(time)
        const hours = date.getHours()
        const mins = date.getMinutes()
        return `${hours}:${mins < 10 ? "0" : ""}${mins}`
    }

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        socket.emit("join-room", roomId)
    }, [roomId])

    useEffect(() => {
        socket.on("receive-message", (msg) => {
            setMessages((prev) => [...prev, msg])
        })
        return () => {
            socket.off("receive-message")
        }
    }, [])

    const sendMessages = () => {
        if (!input.trim()) return
        socket.emit("send-message", {
            roomId,
            message: input,
            user: user.username || "user",
            time: Date.now(),
        })
        setInput("")
    }

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 bg-black/20">
                <MessageCircle size={20} className="text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Room Chat</h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {messages.length === 0 ? (
                    <div className="m-auto text-white/30 text-sm text-center">
                        Say hi to start vibing!
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = msg.user === user.username
                        return (
                            <div 
                                key={i} 
                                className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}
                            >
                                <div className="flex items-center gap-2 text-xs px-1">
                                    <span className={cn("font-semibold", isMe ? "text-cyan-400" : "text-purple-400")}>{msg.user}</span>
                                    <span className="text-white/30">{formatTime(msg.time)}</span>
                                </div>
                                <div className={cn(
                                    "text-white px-3.5 py-2.5 text-sm max-w-[85%] break-words border",
                                    isMe 
                                        ? "bg-cyan-500/15 rounded-[14px_14px_0_14px] border-cyan-500/30" 
                                        : "bg-purple-500/15 rounded-[14px_14px_14px_0] border-purple-500/30"
                                )}>
                                    {msg.message}
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-black/20 flex gap-3 items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessages()}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-white text-sm outline-none transition duration-200 focus:border-purple-500/50"
                />
                <button
                    onClick={sendMessages}
                    className="bg-gradient-to-br from-purple-500 to-cyan-500 border-none w-10 h-10 rounded-full flex items-center justify-center text-white cursor-pointer shrink-0 transition duration-150 hover:scale-105"
                >
                    <Send size={16} className="ml-0.5" />
                </button>
            </div>
        </div>
    )
}

export default Chat
