import { useState, useRef, useEffect } from "react"
import { chatService, type ChatMessage } from "../service"

interface Message {
  id: string
  role: "user" | "model"
  content: string
  time: string
}

const QUICK_PROMPTS = [
  "🐘 Best wildlife safari?",
  "🐋 Whale watching season?",
  "⛰️ Ella hiking tips?",
  "🏄 Surfing for beginners?"
]

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "model",
      content:
        "Ayubowan! 🙏 I'm your LankaGuide AI assistant. Ask me anything about safaris, hiking, surfing, whale watching, or planning your trip across Sri Lanka!",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      inputRef.current?.focus()
    }
  }, [messages, isOpen])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Build history for backend
      const history: ChatMessage[] = messages
        .filter((m) => m.id !== "initial")
        .map((m) => ({
          role: m.role,
          content: m.content
        }))

      const response = await chatService.sendMessage(userMessage.content, history)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: response.reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content:
          "Sorry, I had trouble connecting. Please check your internet connection or make sure the backend server is running.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleResetChat = () => {
    setMessages([
      {
        id: "initial",
        role: "model",
        content:
          "Ayubowan! 🙏 I'm your LankaGuide AI assistant. How can I help you discover Sri Lanka today?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ])
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          aria-label="Open AI Travel Assistant"
        >
          <span className="text-xl">🌴</span>
          <span className="font-semibold text-sm">Ask LankaGuide AI</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner">
                🇱🇰
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide">LankaGuide AI</h3>
                <div className="flex items-center space-x-1.5 text-xs text-emerald-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Sri Lanka Travel Concierge</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleResetChat}
                title="Restart Chat"
                className="p-1.5 hover:bg-white/20 rounded-full transition text-xs cursor-pointer"
              >
                🔄
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:bg-white/20 rounded-full transition text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="bg-emerald-50/70 border-b border-emerald-100 px-3 py-2 flex items-center space-x-1.5 overflow-x-auto text-xs no-scrollbar">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="whitespace-nowrap bg-white hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer shadow-xs disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/50">
            {messages.map((msg) => {
              const isUser = msg.role === "user"
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                      isUser
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex items-start space-x-2">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-xs flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Yala, Ella, Mirissa, surfing..."
                disabled={isLoading}
                className="flex-1 text-sm bg-gray-100 rounded-xl px-3.5 py-2.5 border border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none transition disabled:opacity-60"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-3.5 py-2.5 rounded-xl font-medium text-sm transition flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                ➔
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Powered by LankaGuide AI • Discover Sri Lanka
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
