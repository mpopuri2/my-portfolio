"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EDUCATION = [
  {
    school: "Binghamton University",
    subtitle: "State University of New York",
    degree: "M.S. Computer Science",
    specialization: "AI Specialization",
    period: "Aug 2023 - May 2025",
    gpa: "3.54 / 4.0",
    courses: [
      "Deep Learning",
      "Natural Language Processing",
      "Reinforcement Learning",
      "Advanced Algorithms",
      "Computer Vision",
      "Probabilistic ML",
    ],
    featured: true,
  },
  {
    school: "VVIT",
    subtitle: "Vasireddy Venkatadri Institute of Technology · Guntur, India",
    degree: "B.Tech Computer Science & Engineering",
    specialization: "CSE",
    period: "Aug 2019 - Jun 2023",
    gpa: "8.28 / 10.0",
    courses: [
      "Data Structures & Algorithms",
      "Artificial Intelligence",
      "Machine Learning",
      "Natural Language Processing",
      "Big Data Analytics",
      "Data Warehousing & Mining",
      "Database Management Systems",
      "Operating Systems",
      "Probability & Statistics",
      "Linear Algebra",
      "Mathematical Foundations of CS",
      "Python Programming",
      "Programming Languages",
      "Human-Computer Interaction",
    ],
    featured: false,
  },
];

const PUBLICATIONS = [
  {
    title: "Twitter Sentiment Analysis Using Machine Learning",
    venue: "IJFANS - International Journal of Food and Nutritional Sciences",
    date: "December 2022",
    metric: "97.4% Accuracy",
    description:
      "Comparative study of ML classifiers (SVM, Naive Bayes, LSTM) on Twitter data for multi-class sentiment classification. Achieved 97.4% accuracy using an ensemble approach with TF-IDF and word2vec features.",
    tags: ["NLP", "Sentiment Analysis", "SVM", "LSTM", "Python"],
  },
];

export default function EducationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section ref={ref} className="relative z-10 bg-[#04040a]/60 py-32 px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-4xl mx-auto">
        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="text-center mb-14"
        >
          <p className="font-mono text-xs text-indigo-400/70 tracking-[0.25em] uppercase mb-4">
            Education
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-100">
            Academic{" "}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              foundation
            </span>
          </h2>
        </motion.div>

        <div className="space-y-5 mb-24">
          {EDUCATION.map((edu, i) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.12 }}
              className={`rounded-2xl border ${edu.featured ? "border-indigo-500/30 bg-slate-900/20" : "border-slate-800/60 bg-slate-900/20"} p-6 md:p-8`}
            >
              {edu.featured && (
                <div className="h-px bg-gradient-to-r from-indigo-500 via-sky-500 to-violet-500 -mx-6 md:-mx-8 mb-6" style={{ marginTop: "-1.5rem", marginBottom: "1.5rem" }} />
              )}
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-display text-xl font-bold text-slate-100">{edu.school}</span>
                    {edu.specialization && (
                      <span className={`font-mono text-xs px-2 py-0.5 rounded-full border ${edu.featured ? "bg-sky-500/10 text-sky-400 border-sky-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                        {edu.specialization}
                      </span>
                    )}
                  </div>
                  <div className="text-slate-400 text-sm mb-1">{edu.subtitle}</div>
                  <div className="text-indigo-400 font-semibold">{edu.degree}</div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-slate-500 text-sm font-mono">{edu.period}</span>
                    {edu.gpa && (
                      <>
                        <span className="text-slate-700">·</span>
                        <span className="text-slate-400 text-sm">GPA {edu.gpa}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {edu.courses.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {edu.courses.map((c) => (
                    <span key={c} className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-500 border border-slate-700/40">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Publications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.3 }}
          className="text-center mb-14"
        >
          <p className="font-mono text-xs text-indigo-400/70 tracking-[0.25em] uppercase mb-4">
            Research
          </p>
          <h2 className="font-display text-4xl font-black text-slate-100">
            Publications
          </h2>
        </motion.div>

        {PUBLICATIONS.map((pub, i) => (
          <motion.div
            key={pub.title}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.4 + i * 0.1 }}
            className="rounded-2xl border border-slate-800/60 bg-slate-900/20 p-6 md:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
              <h3 className="font-display text-lg font-bold text-slate-100 flex-1">{pub.title}</h3>
              <span className="font-mono text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                {pub.metric}
              </span>
            </div>
            <div className="text-slate-500 text-sm font-mono mb-3">{pub.venue} · {pub.date}</div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">{pub.description}</p>
            <div className="flex flex-wrap gap-2">
              {pub.tags.map((t) => (
                <span key={t} className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-500 border border-slate-700/40">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
