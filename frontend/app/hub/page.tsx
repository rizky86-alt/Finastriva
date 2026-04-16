"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BrainCircuit, 
  Send, 
  Sparkles, 
  User as UserIcon, 
  Bot,
  Loader2,
  Trash2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIHubPage() {
  const { token, username } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper untuk mendapatkan URL API
  const getApiUrl = (endpoint: string) => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const cleanBase = base.replace(/\/+$/, "");
    const cleanEndpoint = `/${endpoint.replace(/^\/+/, "")}`;
    return `${cleanBase}${cleanEndpoint}`;
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(getApiUrl("/api/ai/ask"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ question: input }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Respon server tidak valid (Bukan JSON)");
      }

      const data = await res.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Maaf, saya sedang mengalami kendala teknis.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      console.error("AI Hub Error:", err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Error: Gagal terhubung ke Finastriva Oracle. Pastikan backend jalan dan API Key Gemini sudah terpasang.",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Hapus seluruh percakapan?")) {
      setMessages([]);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-black text-white font-sans antialiased overflow-hidden">
      {/* Header */}
      <header className="p-6 border-b border-gray-900 flex justify-between items-center bg-black/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none flex items-center gap-2">
              Finastriva Oracle <Sparkles size={16} className="text-blue-500" />
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">AI Financial Consultant</p>
          </div>
        </div>
        
        <button 
          onClick={clearChat}
          className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/5 via-black to-black">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-[2rem] flex items-center justify-center mb-8"
            >
              <Bot size={40} className="text-blue-500 opacity-50" />
            </motion.div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Halo, {username}!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Saya adalah Finastriva Oracle. Tanyakan apapun tentang pengeluaranmu, rencana investasi, atau minta analisis finansial berdasarkan datamu di The Vault.
            </p>
            <div className="grid grid-cols-1 gap-3 w-full">
              {[
                "Analisis pengeluaranku bulan ini",
                "Berikan 3 tips hemat untuk mahasiswa",
                "Apakah saldo amanku untuk beli gadget baru?"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => { setInput(suggestion); }}
                  className="p-4 bg-gray-900/40 border border-gray-800 rounded-2xl text-xs text-gray-400 hover:text-white hover:border-blue-500/30 transition-all text-left group"
                >
                  <span className="group-hover:translate-x-1 inline-block transition-transform">"{suggestion}"</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto w-full space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-4 max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-blue-500 border border-gray-700"
                    }`}>
                      {msg.sender === "user" ? <UserIcon size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-xl ${
                      msg.sender === "user" 
                        ? "bg-blue-600 text-white rounded-tr-none font-medium" 
                        : "bg-gray-900/80 border border-gray-800 text-gray-200 rounded-tl-none backdrop-blur-sm"
                    }`}>
                      {msg.text}
                      <p className={`text-[9px] mt-2 opacity-50 font-bold uppercase tracking-widest ${
                        msg.sender === "user" ? "text-right" : "text-left"
                      }`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex justify-start"
              >
                <div className="flex gap-4 max-w-[80%]">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 text-blue-500 border border-gray-700 flex items-center justify-center animate-pulse">
                    <Bot size={16} />
                  </div>
                  <div className="bg-gray-900/80 border border-gray-800 p-4 rounded-[1.5rem] rounded-tl-none flex items-center gap-3">
                    <Loader2 size={16} className="text-blue-500 animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Oracle is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-900 bg-black/50 backdrop-blur-md">
        <form 
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto relative group"
        >
          <input 
            type="text" 
            placeholder="Tanyakan sesuatu ke Finastriva Oracle..."
            className="w-full bg-gray-900/60 border border-gray-800 p-5 pr-16 rounded-[1.5rem] outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm placeholder:text-gray-600"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all disabled:bg-gray-800 disabled:text-gray-600 active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-[9px] text-gray-700 mt-4 uppercase font-bold tracking-[0.3em]">
          Powered by Google Gemini AI • Chapter 11
        </p>
      </div>
    </main>
  );
}
