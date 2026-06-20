"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VIDEO_ID = "Z6ih1aKeETk"; // Tycho - Dive (Full Album) 37M views

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars: Record<string, number | string>;
          events: {
            onReady: (e: { target: { playVideo(): void; pauseVideo(): void; setVolume(v: number): void; seekTo(s: number, allow: boolean): void } }) => void;
            onStateChange: (e: { data: number }) => void;
          };
        }
      ) => void;
      PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const TRACKS = [
  "A Walk", "Hours", "Daydream", "Dive",
  "Coastal Brake", "Ascension", "Melanine", "Adrift", "Epigram", "Elegy",
];

// Rough track start times (seconds)
const TRACK_TIMES = [0, 317, 665, 995, 1495, 1832, 2094, 2268, 2631, 2780];

export default function AmbientAudio() {
  const [playing,    setPlaying]    = useState(false);
  const [expanded,   setExpanded]   = useState(false);
  const [trackIdx,   setTrackIdx]   = useState(2); // Daydream
  const [apiReady,   setApiReady]   = useState(false);
  const playerRef    = useRef<{ playVideo(): void; pauseVideo(): void; setVolume(v: number): void; seekTo(s: number, allow: boolean): void } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (document.getElementById("yt-api-script")) {
      if (window.YT?.Player) setApiReady(true);
      return;
    }
    window.onYouTubeIframeAPIReady = () => setApiReady(true);
    const script = document.createElement("script");
    script.id  = "yt-api-script";
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  }, []);

  // Create player once API is ready
  useEffect(() => {
    if (!apiReady || !containerRef.current) return;
    new window.YT.Player(containerRef.current, {
      videoId: VIDEO_ID,
      playerVars: {
        autoplay:       0,
        controls:       0,
        disablekb:      1,
        modestbranding: 1,
        rel:            0,
        iv_load_policy: 3,
      },
      events: {
        onReady: (e) => {
          playerRef.current = e.target;
          e.target.setVolume(55);
          e.target.seekTo(665, true); // start at Daydream
        },
        onStateChange: (e) => {
          setPlaying(e.data === window.YT.PlayerState.PLAYING);
        },
      },
    });
  }, [apiReady]);

  // Detect current track from elapsed time (rough)
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      // We can't get currentTime easily without polling, use a timer approach
      setTrackIdx((prev) => prev); // placeholder; track changes on manual skip
    }, 5000);
    return () => clearInterval(id);
  }, [playing]);

  const toggle = useCallback(() => {
    if (!playerRef.current) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
      setExpanded(true);
    }
  }, [playing]);

  const trackName = TRACKS[trackIdx] ?? "A Walk";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3, duration: 0.5 }}
      className="fixed top-[72px] left-6 z-[9960]"
      onMouseEnter={() => playing && setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Hidden YouTube iframe container */}
      <div
        ref={containerRef}
        className="absolute opacity-0 pointer-events-none"
        style={{ width: 1, height: 1, overflow: "hidden" }}
      />

      {/* Player UI */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-2 px-4 py-3 rounded-xl bg-slate-900/90
                       border border-slate-700/50 backdrop-blur-md
                       shadow-xl shadow-black/40 flex items-center gap-3 cursor-none"
            style={{ minWidth: 210 }}
          >
            {/* Album art placeholder */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-sky-500
                            flex items-center justify-center text-white text-xs font-bold shrink-0">
              T
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-mono text-[10px] text-slate-500 truncate">Tycho · Dive</p>
              <p className="font-mono text-[11px] text-slate-200 font-medium truncate">
                {trackName}
              </p>
            </div>

            {/* Track prev/next */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const next = Math.max(0, trackIdx - 1);
                  setTrackIdx(next);
                  playerRef.current?.seekTo(TRACK_TIMES[next], true);
                }}
                className="w-6 h-6 flex items-center justify-center text-slate-500
                           hover:text-slate-200 transition-colors cursor-none text-xs"
              >
                ◀
              </button>
              <button
                onClick={() => {
                  const next = Math.min(TRACKS.length - 1, trackIdx + 1);
                  setTrackIdx(next);
                  playerRef.current?.seekTo(TRACK_TIMES[next], true);
                }}
                className="w-6 h-6 flex items-center justify-center text-slate-500
                           hover:text-slate-200 transition-colors cursor-none text-xs"
              >
                ▶
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Play/pause button */}
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-[10px]
                   border backdrop-blur-sm transition-colors duration-300 cursor-none
                   bg-slate-900/60"
        style={{
          borderColor: playing ? "rgba(129,140,248,0.45)" : "rgba(51,65,85,0.6)",
          color:       playing ? "#818cf8" : "#64748b",
        }}
        aria-label={playing ? "Pause music" : "Play Tycho - Dive"}
      >
        {/* Animated waveform bars */}
        <div className="flex items-center gap-[2px] h-3">
          {[0.5, 1, 0.7, 0.9, 0.55, 0.75, 0.4].map((h, i) => (
            <motion.div
              key={i}
              className="w-[2px] rounded-full"
              style={{ background: playing ? "#818cf8" : "#475569", height: 12, transformOrigin: "center" }}
              animate={playing
                ? { scaleY: [h, h * 0.3, h * 1.4, h * 0.5, h] }
                : { scaleY: 0.25 }
              }
              transition={playing
                ? { duration: 0.7 + i * 0.13, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }
                : { duration: 0.3 }
              }
            />
          ))}
        </div>

        <span>{playing ? "Tycho · Dive" : "lo-fi"}</span>

        <AnimatePresence>
          {playing && (
            <motion.span
              key="dot"
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              style={{ boxShadow: "0 0 6px #818cf8" }}
            />
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
