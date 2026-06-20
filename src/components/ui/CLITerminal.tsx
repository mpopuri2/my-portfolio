"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Line {
  type: "input" | "output" | "error" | "system";
  text: string;
}

const COMMANDS: Record<string, () => string[]> = {
  help: () => [
    "Available commands:",
    "  whoami          - Who is Manjunath Popuri?",
    "  ls projects     - List ML projects",
    "  cat resume      - View resume highlights",
    "  ping manny      - Check if Manjunath Popuri is available",
    "  skills          - View tech stack",
    "  contact         - Get in touch",
    "  clear           - Clear terminal",
    "  exit            - Close terminal",
  ],
  whoami: () => [
    "Manjunath Popuri",
    "Role:    AI/ML Engineer @ Stripe",
    "Focus:   Multi-agent LangGraph orchestration, fraud detection",
    "Stack:   Python, PyTorch, LangChain, AWS, K8s",
    "Based:   New York, NY",
    'Status:  \x1b[32mopen to new opportunities\x1b[0m',
  ],
  "ls projects": () => [
    "drwxr-xr-x  fraud-detection-langraph/",
    "drwxr-xr-x  finbert-earnings-analysis/",
    "drwxr-xr-x  credit-default-xgboost-lstm/",
    "drwxr-xr-x  twitter-sentiment-97pct/",
    "",
    "4 projects. See #projects for details.",
  ],
  "cat resume": () => [
    "=== Manjunath Popuri - Resume Highlights ===",
    "",
    "EXPERIENCE",
    "  Stripe         AI/ML Engineer       Jul 2025 - Present",
    "  Binghamton U   Research Assistant   Aug 2024 - May 2025",
    "  Cognizant      Software Engineer    Jul 2021 - Jun 2023",
    "",
    "EDUCATION",
    "  MS CS (AI)  Binghamton University  GPA: 3.54/4.0",
    "  B.Tech      VVIT Guntur India      GPA: 8.28/10.0",
    "",
    "IMPACT @ STRIPE",
    "  - 70M+ daily transactions processed",
    "  - 22% false-positive rate reduction",
    "  - <150ms p95 latency",
    "  - 99.9% SLA compliance",
  ],
  "ping manny": () => [
    "PING manny @ stripe.com ...",
    "64 bytes: icmp_seq=1 ttl=64 time=0.42ms",
    "64 bytes: icmp_seq=2 ttl=64 time=0.38ms",
    "64 bytes: icmp_seq=3 ttl=64 time=0.41ms",
    "",
    "--- manny ping statistics ---",
    "3 packets transmitted, 3 received, 0% packet loss",
    "Manjunath Popuri is ONLINE and available for new roles.",
  ],
  skills: () => [
    "ML/AI:      PyTorch  TensorFlow  scikit-learn  XGBoost  FinBERT",
    "LLM/Agent:  LangChain  LangGraph  OpenAI  RAG  SHAP",
    "Cloud:      AWS  GCP  Azure  Docker  Kubernetes",
    "MLOps:      MLflow  Airflow  Spark  Kafka  Redis",
    "Languages:  Python  TypeScript  SQL  Go",
  ],
  contact: () => [
    "Email:    manjunathpopuri2@gmail.com",
    "LinkedIn: linkedin.com/in/manjunathpopuri",
    "GitHub:   github.com/mpopuri2",
    "",
    "Type 'hire' anywhere on the page for a surprise.",
  ],
  clear: () => ["__CLEAR__"],
  exit: () => ["__EXIT__"],
};

const BOOT_LINES: Line[] = [
  { type: "system", text: "Manjunath Popuri · AI/ML Engineer Terminal" },
  { type: "system", text: 'Type "help" for available commands.' },
  { type: "system", text: "" },
];

export default function CLITerminal() {
  const [open,    setOpen]    = useState(false);
  const [lines,   setLines]   = useState<Line[]>(BOOT_LINES);
  const [input,   setInput]   = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Toggle on ~ key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ESC always closes, even when input is focused
      if (e.key === "Escape") { setOpen(false); return; }
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setHistory((h) => [cmd, ...h.slice(0, 49)]);
    setHistIdx(-1);

    const newLines: Line[] = [{ type: "input", text: `$ ${raw.trim()}` }];

    const handler = COMMANDS[cmd];
    if (handler) {
      const output = handler();
      if (output[0] === "__CLEAR__") {
        setLines(BOOT_LINES);
        return;
      }
      if (output[0] === "__EXIT__") {
        setOpen(false);
        return;
      }
      output.forEach((t) => newLines.push({ type: "output", text: t }));
    } else {
      newLines.push({
        type: "error",
        text: `command not found: ${cmd}. Type "help" for commands.`,
      });
    }

    setLines((prev) => [...prev, ...newLines]);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHistIdx((i) => {
        const next = Math.min(i + 1, history.length - 1);
        setInput(history[next] ?? "");
        return next;
      });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHistIdx((i) => {
        const next = Math.max(i - 1, -1);
        setInput(next === -1 ? "" : history[next] ?? "");
        return next;
      });
    }
  };

  const lineColor = (type: Line["type"]) => {
    if (type === "input")  return "text-sky-400";
    if (type === "error")  return "text-red-400";
    if (type === "system") return "text-indigo-400";
    return "text-emerald-300";
  };

  return (
    <>
      {/* Hint badge */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{   opacity: 0 }}
            transition={{ delay: 3 }}
            onClick={() => setOpen(true)}
            className="fixed top-[72px] right-6 z-[9960]
                       px-3 py-1.5 rounded-lg font-mono text-[10px]
                       text-slate-500 border border-slate-800/60
                       hover:text-slate-300 hover:border-slate-600
                       transition-colors duration-200 cursor-none
                       bg-slate-900/50 backdrop-blur-sm"
            aria-label="Open terminal"
          >
            ~ terminal
          </motion.button>
        )}
      </AnimatePresence>

      {/* Terminal window */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, scale: 0.95, y: -12 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit={{   opacity: 0, scale: 0.95, y: -12  }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[9960]
                       w-[min(680px,92vw)] max-h-[420px]
                       flex flex-col rounded-2xl overflow-hidden
                       border border-slate-700/60
                       shadow-2xl shadow-black/70"
            style={{ background: "rgba(4,4,10,0.97)", backdropFilter: "blur(24px)" }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/60 shrink-0">
              <button onClick={() => setOpen(false)}
                className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-none transition-colors" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              <span className="flex-1 text-center font-mono text-[11px] text-slate-500">
                manny@stripe:~
              </span>
              <span className="font-mono text-[10px] text-slate-600">ESC to close</span>
            </div>

            {/* Output */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-0.5 min-h-0" data-lenis-prevent>
              {lines.map((line, i) => (
                <div key={i} className={`font-mono text-[12px] leading-5 whitespace-pre ${lineColor(line.type)}`}>
                  {line.text || " "}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-5 py-3 border-t border-slate-800/60 flex items-center gap-2 shrink-0">
              <span className="font-mono text-[12px] text-sky-400 shrink-0">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-transparent font-mono text-[12px] text-slate-200
                           outline-none caret-sky-400 placeholder-slate-700"
                placeholder="type a command..."
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
