"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What does Manny do at Stripe?",
  "What ML frameworks does he know?",
  "Tell me about his LangGraph work",
  "Is he open to new roles?",
];

export default function AskManju() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [noKey,    setNoKey]    = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "content-type": "application/json" },
        body:    JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role, content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (data.error?.includes("API key")) {
        setNoKey(true);
        setMessages((prev) => [...prev, {
          role:    "assistant",
          content: "The GEMINI_API_KEY is not set yet. Add GEMINI_API_KEY to .env.local to activate me!",
        }]);
      } else if (data.text) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: `Error: ${data.error}`,
        }]);
        setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: "assistant", content: "Network error - please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Floating photo button ─────────────────────────── */}
      <div className="fixed bottom-8 right-8 z-[9980] flex flex-col items-center gap-2 ask-manny-zone">


        {/* "Ask Manny" label — floats above the photo */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1  }}
              exit={{   opacity: 0, y: 6, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         bg-slate-900/90 border border-indigo-500/30
                         backdrop-blur-sm shadow-lg shadow-black/40"
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              />
              <span className="font-mono text-[11px] text-indigo-300 whitespace-nowrap">
                Ask Manny
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photo avatar button — floats up and down */}
        <motion.button
          onClick={() => setOpen((v) => !v)}
          animate={open ? { y: 0 } : { y: [0, -8, 0] }}
          transition={open ? {} : {
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          whileTap={{ scale: 0.94 }}
          className="relative cursor-none"
          aria-label={open ? "Close chat" : "Ask Manny"}
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={open ? { opacity: 0 } : {
              boxShadow: [
                "0 0 0 0 rgba(99,102,241,0.5)",
                "0 0 0 12px rgba(99,102,241,0)",
              ],
            }}
            transition={open ? {} : {
              boxShadow: { duration: 2.2, repeat: Infinity, ease: "easeOut" },
            }}
          />

          {/* Gradient border frame */}
          <div
            className="w-16 h-16 rounded-full p-[2px] shadow-2xl shadow-indigo-900/60"
            style={{
              background: open
                ? "linear-gradient(135deg,#334155,#475569)"
                : "linear-gradient(135deg,#6366f1,#38bdf8,#a78bfa)",
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">
              {open ? (
                /* Close icon when open */
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <motion.span
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    className="text-slate-300 text-lg"
                  >
                    ✕
                  </motion.span>
                </div>
              ) : (
                <Image
                  src="/my_image.jpeg"
                  alt="Manny - Ask me anything"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              )}
            </div>
          </div>
        </motion.button>
      </div>

      {/* ── Chat panel ───────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 24, scale: 0.96  }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            className="fixed bottom-32 right-8 z-[9979] ask-manny-zone w-[360px] max-h-[520px]
                       flex flex-col rounded-2xl overflow-hidden
                       border border-slate-700/60
                       shadow-2xl shadow-black/60"
            style={{ background: "rgba(4,4,10,0.95)", backdropFilter: "blur(20px)" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800/60 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-indigo-500/40 shrink-0">
                <Image
                  src="/my_image.jpeg"
                  alt="Manny"
                  width={36}
                  height={36}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <p className="font-display font-semibold text-sm text-slate-100">Ask Manny</p>
                <p className="font-mono text-[10px] text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AI/ML Engineer · Stripe
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0" data-lenis-prevent>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Hey! I&apos;m Manny. Ask me anything about my experience, projects, or skills.
                  </p>
                  <div className="space-y-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-400
                                   border border-slate-800/60 hover:border-indigo-500/40
                                   hover:text-slate-200 hover:bg-indigo-500/5
                                   transition-all duration-200 cursor-none"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Manny avatar on assistant messages */}
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 ring-1 ring-indigo-500/30">
                      <Image
                        src="/my_image.jpeg"
                        alt="Manny"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-slate-800/80 text-slate-200 rounded-bl-sm border border-slate-700/40"
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 ring-1 ring-indigo-500/30">
                    <Image src="/my_image.jpeg" alt="Manny" width={24} height={24} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/40 rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-slate-800/60 shrink-0">
              {noKey && (
                <p className="font-mono text-[10px] text-amber-400/80 mb-2 text-center">
                  Add GEMINI_API_KEY to .env.local to enable
                </p>
              )}
              <form
                onSubmit={(e) => { e.preventDefault(); send(input); }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Manny anything..."
                  disabled={loading}
                  className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-xl
                             px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600
                             focus:outline-none focus:border-indigo-500/50
                             disabled:opacity-50 transition-colors duration-200 cursor-none"
                />
                <motion.button
                  type="submit"
                  disabled={loading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500
                             disabled:opacity-40 flex items-center justify-center
                             text-white transition-colors duration-200 shrink-0 cursor-none"
                >
                  ↑
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
