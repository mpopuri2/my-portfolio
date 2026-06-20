"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const USERNAME = "mpopuri2";

interface Repo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
}

interface GitHubData {
  repos: Repo[];
  totalStars: number;
  languages: Record<string, number>;
  publicRepos: number;
  followers: number;
}

const LANG_COLORS: Record<string, string> = {
  Python:     "#3b82f6",
  TypeScript: "#818cf8",
  JavaScript: "#fbbf24",
  Jupyter:    "#f97316",
  Shell:      "#34d399",
  HTML:       "#f87171",
  CSS:        "#a78bfa",
  Other:      "#475569",
};

function langColor(lang: string) {
  return LANG_COLORS[lang] ?? LANG_COLORS.Other;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function GitHubSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  const [data,    setData]    = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`),
          fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=20`),
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error("API error");

        const user  = await userRes.json();
        const repos: Repo[] = await reposRes.json();

        // Tally languages
        const languages: Record<string, number> = {};
        repos.forEach((r) => {
          if (r.language) {
            languages[r.language] = (languages[r.language] ?? 0) + 1;
          }
        });

        setData({
          repos:       repos.slice(0, 6),
          totalStars:  repos.reduce((s, r) => s + r.stargazers_count, 0),
          languages,
          publicRepos: user.public_repos,
          followers:   user.followers,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const topLangs = data
    ? Object.entries(data.languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    : [];

  const totalLangCount = topLangs.reduce((s, [, n]) => s + n, 0);

  return (
    <section
      id="github"
      ref={ref}
      className="relative z-10 bg-[#04040a]/60 py-32 px-6"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs text-emerald-400/70 tracking-[0.25em] uppercase mb-4">
            Open Source
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-100">
            Active on{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
              GitHub
            </span>
          </h2>
          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 font-mono text-xs text-slate-500 hover:text-emerald-400 transition-colors duration-200"
          >
            github.com/{USERNAME} ↗
          </a>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400"
            />
          </div>
        )}

        {error && (
          <p className="text-center text-slate-500 font-mono text-sm py-16">
            Could not load GitHub data — visit{" "}
            <a href={`https://github.com/${USERNAME}`} target="_blank" className="text-emerald-400 underline">
              github.com/{USERNAME}
            </a>
          </p>
        )}

        {data && !loading && (
          <>
            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
            >
              {[
                { value: data.publicRepos, label: "Public repos",   color: "from-emerald-400 to-teal-400"  },
                { value: data.totalStars,  label: "Total stars",    color: "from-amber-400 to-yellow-400"  },
                { value: data.followers,   label: "Followers",      color: "from-sky-400 to-indigo-400"    },
                { value: topLangs.length,  label: "Languages used", color: "from-violet-400 to-fuchsia-400"},
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-5 text-center"
                >
                  <div className={`font-display text-3xl font-black bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                    {s.value}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mt-1">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Language bar */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.25 }}
                className="rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6"
              >
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-5">
                  // Languages
                </p>

                {/* Stacked bar */}
                <div className="flex h-2 rounded-full overflow-hidden mb-6 gap-px">
                  {topLangs.map(([lang, count]) => (
                    <motion.div
                      key={lang}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${(count / totalLangCount) * 100}%` } : {}}
                      transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
                      style={{ background: langColor(lang) }}
                    />
                  ))}
                </div>

                <div className="space-y-3">
                  {topLangs.map(([lang, count], i) => (
                    <motion.div
                      key={lang}
                      initial={{ opacity: 0, x: -12 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.35 + i * 0.07 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: langColor(lang) }}
                        />
                        <span className="font-mono text-xs text-slate-300">{lang}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-1 rounded-full bg-slate-800 w-20">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: langColor(lang) }}
                            initial={{ width: 0 }}
                            animate={inView ? { width: `${(count / totalLangCount) * 100}%` } : {}}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 + i * 0.07 }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-500 w-4 text-right">{count}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Recent repos */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2 rounded-2xl border border-slate-800/60 bg-slate-900/30 p-6"
              >
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-5">
                  // Recent repositories
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.repos.map((repo, i) => (
                    <motion.a
                      key={repo.name}
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 12 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.35 + i * 0.06 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group rounded-xl border border-slate-800/50 bg-slate-900/40 p-4
                                 hover:border-emerald-500/30 hover:bg-slate-800/40 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-mono text-sm text-slate-200 group-hover:text-emerald-400 transition-colors duration-200 truncate">
                          {repo.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-600 shrink-0">
                          {timeAgo(repo.updated_at)}
                        </span>
                      </div>
                      {repo.description && (
                        <p className="text-slate-500 text-xs leading-relaxed mb-3 line-clamp-2">
                          {repo.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3">
                        {repo.language && (
                          <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: langColor(repo.language) }}
                            />
                            {repo.language}
                          </span>
                        )}
                        {repo.stargazers_count > 0 && (
                          <span className="font-mono text-[10px] text-slate-500">
                            ★ {repo.stargazers_count}
                          </span>
                        )}
                        {repo.forks_count > 0 && (
                          <span className="font-mono text-[10px] text-slate-500">
                            ⑂ {repo.forks_count}
                          </span>
                        )}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
