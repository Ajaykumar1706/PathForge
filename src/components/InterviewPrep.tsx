import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import { InterviewPrepQuestion } from "../types";
import { Award, Plus, Trash2, Clock, CheckCircle2, Award as Trophy, Zap, Play, Pause, RotateCcw } from "lucide-react";

export default function InterviewPrep() {
  const { interviewQuestions, addInterviewQuestion, updateInterviewQuestion, deleteInterviewQuestion, gainXP } = useStore();

  const [activeCategory, setActiveCategory] = useState<"All" | "DSA" | "System Design" | "Behavioral" | "SQL">("All");

  // Create question state
  const [isAdding, setIsAdding] = useState(false);
  const [company, setCompany] = useState("");
  const [round, setRound] = useState("Technical");
  const [category, setCategory] = useState<any>("DSA");
  const [questionText, setQuestionText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [starS, setStarS] = useState("");
  const [starT, setStarT] = useState("");
  const [starA, setStarA] = useState("");
  const [starR, setStarR] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  // Timer Stopwatch State
  const [timeRemaining, setTimeRemaining] = useState(2700); // default 45 mins in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const mStr = mins < 10 ? `0${mins}` : `${mins}`;
    const sStr = secs < 10 ? `0${secs}` : `${secs}`;
    return `${mStr}:${sStr}`;
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText) return;

    addInterviewQuestion({
      company,
      round,
      category,
      question: questionText,
      answer: answerText || undefined,
      starSituation: category === "Behavioral" ? starS : undefined,
      starTask: category === "Behavioral" ? starT : undefined,
      starAction: category === "Behavioral" ? starA : undefined,
      starResult: category === "Behavioral" ? starR : undefined,
      difficulty,
      isReviewed: false
    });

    gainXP(100);

    setQuestionText("");
    setAnswerText("");
    setCompany("");
    setStarS("");
    setStarT("");
    setStarA("");
    setStarR("");
    setIsAdding(false);
  };

  const filteredQuestions = interviewQuestions.filter((q) => activeCategory === "All" || q.category === activeCategory);

  return (
    <div id="prep-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header and Mock Timer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Interview Preparation
          </h2>
          <p className="text-xs text-[#71717a] font-mono mt-1">
            Build bulletproof behavioral STAR stories, study DSA code solutions, and practice mock boards
          </p>
        </div>

        {/* Stopwatch card */}
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-3 flex items-center gap-4 shadow-sm">
          <div className="text-center">
            <span className="text-[9px] font-mono text-[#71717a] uppercase font-bold tracking-wider block">Mock Interview Clock</span>
            <span className="text-xl font-mono font-bold text-blue-400">{formatTimer(timeRemaining)}</span>
          </div>
          <div className="flex gap-1 border-l border-[#1f1f23] pl-3">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1.5 bg-[#09090b] hover:bg-[#18181b] hover:text-[#fafafa] text-[#71717a] rounded-lg cursor-pointer"
              title={isTimerRunning ? "Pause" : "Start"}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-blue-400" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimeRemaining(2700);
              }}
              className="p-1.5 bg-[#09090b] hover:bg-[#18181b] text-[#71717a] rounded-lg cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Adding Form inline */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {["All", "DSA", "System Design", "Behavioral", "SQL"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-blue-500/10 border-blue-500/30 text-blue-400 font-bold"
                  : "bg-[#0c0c0e] border-[#1f1f23] text-[#71717a] hover:text-[#fafafa]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Practice Card</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreateQuestion} className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-xl space-y-4">
          <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono">
            New Prep Sheet Question
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Target Company (Optional)</label>
              <input
                type="text"
                placeholder="Google / Stripe"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Category Type</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none"
              >
                <option value="DSA">DSA</option>
                <option value="System Design">System Design</option>
                <option value="Behavioral">Behavioral</option>
                <option value="SQL">SQL</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Interview Round</label>
              <input
                type="text"
                placeholder="Technical / Manager"
                value={round}
                onChange={(e) => setRound(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div className="col-span-2">
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Interview Question Prompt</label>
              <textarea
                required
                placeholder="Design a rate limiter... / Tell me about a conflict..."
                rows={2}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            {category === "Behavioral" ? (
              <div className="col-span-2 space-y-2.5 bg-[#09090b]/40 p-3 rounded-lg border border-[#1f1f23]">
                <span className="text-[10px] font-mono text-blue-400 font-semibold uppercase">STAR Structure Checklist</span>
                <div>
                  <label className="text-[9px] text-[#71717a] font-mono block mb-1">Situation (Context)</label>
                  <textarea rows={1} value={starS} onChange={(e) => setStarS(e.target.value)} className="w-full bg-[#09090b] border border-[#1f1f23] rounded p-1.5 text-xs text-[#fafafa] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[9px] text-[#71717a] font-mono block mb-1">Task (Goal)</label>
                  <textarea rows={1} value={starT} onChange={(e) => setStarT(e.target.value)} className="w-full bg-[#09090b] border border-[#1f1f23] rounded p-1.5 text-xs text-[#fafafa] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[9px] text-[#71717a] font-mono block mb-1">Action (What you did)</label>
                  <textarea rows={1} value={starA} onChange={(e) => setStarA(e.target.value)} className="w-full bg-[#09090b] border border-[#1f1f23] rounded p-1.5 text-xs text-[#fafafa] focus:outline-none" />
                </div>
                <div>
                  <label className="text-[9px] text-[#71717a] font-mono block mb-1">Result (Outcome with numbers!)</label>
                  <textarea rows={1} value={starR} onChange={(e) => setStarR(e.target.value)} className="w-full bg-[#09090b] border border-[#1f1f23] rounded p-1.5 text-xs text-[#fafafa] focus:outline-none" />
                </div>
              </div>
            ) : (
              <div className="col-span-2">
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Your Prepared Solution / Code Answer</label>
                <textarea
                  placeholder="Draft your code patterns, complexities, or memory layouts..."
                  rows={3}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-mono"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1f1f23]">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
            >
              Save Prep Sheet
            </button>
          </div>
        </form>
      )}

      {/* Grid of interview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredQuestions.map((q) => (
          <div key={q.id} className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-3.5">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/15 px-1.5 py-0.5 rounded font-bold">
                    {q.category}
                  </span>
                  {q.company && (
                    <span className="text-[10px] font-semibold text-slate-300">
                      Target: {q.company} ({q.round})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                    q.difficulty === "Hard" ? "text-red-400 bg-red-500/5 border-red-500/15" : "text-yellow-400 bg-yellow-500/5 border-yellow-500/15"
                  }`}>
                    {q.difficulty}
                  </span>
                  <button
                    onClick={() => deleteInterviewQuestion(q.id)}
                    className="p-1.5 text-[#71717a] hover:text-red-400 rounded hover:bg-red-500/5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question */}
              <h4 className="font-sans font-bold text-[#fafafa] leading-snug">
                {q.question}
              </h4>

              {/* STAR details if behavioral */}
              {q.category === "Behavioral" && q.starSituation ? (
                <div className="space-y-2 bg-[#09090b]/60 p-3 rounded-lg border border-[#1f1f23] font-sans text-xs">
                  <p className="text-slate-400"><strong className="text-slate-500">S:</strong> {q.starSituation}</p>
                  <p className="text-slate-400"><strong className="text-slate-500">T:</strong> {q.starTask}</p>
                  <p className="text-slate-400"><strong className="text-slate-500">A:</strong> {q.starAction}</p>
                  <p className="text-slate-200"><strong className="text-blue-400">R:</strong> {q.starResult}</p>
                </div>
              ) : (
                q.answer && (
                  <div className="bg-[#09090b]/60 p-3 rounded-lg border border-[#1f1f23] font-mono text-[11px] text-[#fafafa] whitespace-pre-wrap leading-relaxed max-h-[140px] overflow-y-auto">
                    {q.answer}
                  </div>
                )
              )}
            </div>

            <div className="border-t border-[#1f1f23] pt-3 mt-1 flex justify-between items-center text-[10px] text-[#71717a] font-mono">
              <button
                onClick={() => {
                  updateInterviewQuestion(q.id, { isReviewed: !q.isReviewed });
                  gainXP(q.isReviewed ? -75 : 75);
                }}
                className={`flex items-center gap-1 cursor-pointer font-bold ${q.isReviewed ? "text-blue-400" : "text-[#71717a] hover:text-[#fafafa]"}`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{q.isReviewed ? "Reviewed (+75 XP)" : "Mark Reviewed"}</span>
              </button>
              <span className="flex items-center gap-0.5 text-blue-400">
                <Trophy className="w-3.5 h-3.5 text-yellow-500" /> STAR answers pass interviews
              </span>
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="lg:col-span-2 py-24 text-center text-[#71717a] text-xs font-mono border border-dashed border-[#1f1f23] rounded-xl bg-[#0c0c0e]/10">
            No questions listed in this category. Write a prep sheet!
          </div>
        )}
      </div>
    </div>
  );
}
