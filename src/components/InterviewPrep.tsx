import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import { InterviewPrepQuestion } from "../types";
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  Clock,
  CheckCircle2,
  Trophy,
  Play,
  Pause,
  RotateCcw,
  X
} from "lucide-react";

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

  // Edit question state
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRound, setEditRound] = useState("");
  const [editCategory, setEditCategory] = useState<any>("DSA");
  const [editQuestionText, setEditQuestionText] = useState("");
  const [editAnswerText, setEditAnswerText] = useState("");
  const [editStarS, setEditStarS] = useState("");
  const [editStarT, setEditStarT] = useState("");
  const [editStarA, setEditStarA] = useState("");
  const [editStarR, setEditStarR] = useState("");
  const [editDifficulty, setEditDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");

  // Timer Stopwatch State
  const [timeRemaining, setTimeRemaining] = useState(2700); // 45 mins in seconds
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
    if (!questionText.trim()) return;

    addInterviewQuestion({
      company: company.trim() || undefined,
      round: round.trim() || "Technical",
      category,
      question: questionText.trim(),
      answer: answerText.trim() || undefined,
      starSituation: category === "Behavioral" ? starS.trim() : undefined,
      starTask: category === "Behavioral" ? starT.trim() : undefined,
      starAction: category === "Behavioral" ? starA.trim() : undefined,
      starResult: category === "Behavioral" ? starR.trim() : undefined,
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

  const handleStartEdit = (q: InterviewPrepQuestion) => {
    setEditingQId(q.id);
    setEditCompany(q.company || "");
    setEditRound(q.round || "Technical");
    setEditCategory(q.category);
    setEditQuestionText(q.question);
    setEditAnswerText(q.answer || "");
    setEditStarS(q.starSituation || "");
    setEditStarT(q.starTask || "");
    setEditStarA(q.starAction || "");
    setEditStarR(q.starResult || "");
    setEditDifficulty(q.difficulty);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQId || !editQuestionText.trim()) return;

    updateInterviewQuestion(editingQId, {
      company: editCompany.trim() || undefined,
      round: editRound.trim() || "Technical",
      category: editCategory,
      question: editQuestionText.trim(),
      answer: editAnswerText.trim() || undefined,
      starSituation: editCategory === "Behavioral" ? editStarS.trim() : undefined,
      starTask: editCategory === "Behavioral" ? editStarT.trim() : undefined,
      starAction: editCategory === "Behavioral" ? editStarA.trim() : undefined,
      starResult: editCategory === "Behavioral" ? editStarR.trim() : undefined,
      difficulty: editDifficulty
    });

    setEditingQId(null);
  };

  const filteredQuestions = interviewQuestions.filter(
    (q) => activeCategory === "All" || q.category === activeCategory
  );

  return (
    <div id="prep-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      {/* Header and Mock Timer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Interview Prep & Question Bank
          </h2>
          <p className="text-xs text-[#71717a] mt-1">
            Build behavioral STAR stories, technical solutions, and practice mock timed interviews. Everything is editable.
          </p>
        </div>

        {/* Stopwatch timer */}
        <div className="flex items-center gap-3 bg-[#0c0c0e] border border-[#1f1f23] px-3.5 py-1.5 rounded-xl">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-base font-bold text-white tracking-widest">
              {formatTimer(timeRemaining)}
            </span>
          </div>
          <div className="flex items-center gap-1 border-l border-[#1f1f23] pl-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="p-1 text-zinc-400 hover:text-white rounded cursor-pointer"
              title={isTimerRunning ? "Pause" : "Start"}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimeRemaining(2700);
              }}
              className="p-1 text-zinc-400 hover:text-white rounded cursor-pointer"
              title="Reset 45m"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-wrap gap-1.5 bg-[#0c0c0e] p-1 rounded-xl border border-[#1f1f23]">
          {(["All", "DSA", "System Design", "Behavioral", "SQL"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Add Question Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateQuestion}
          className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-2xl space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
            <h3 className="font-sans font-bold text-sm text-[#fafafa]">Add Interview Question</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Target Company (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Amazon, Google, Uber"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Round / Stage</label>
              <input
                type="text"
                placeholder="e.g. Technical Round 1, Bar Raiser"
                value={round}
                onChange={(e) => setRound(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="DSA">DSA / Algorithms</option>
                <option value="System Design">System Design</option>
                <option value="Behavioral">Behavioral (STAR)</option>
                <option value="SQL">SQL & Databases</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-xs text-zinc-400 block mb-1">Question Prompt</label>
              <textarea
                required
                placeholder="Design a distributed cache... / Tell me about a time you handled conflict..."
                rows={2}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            {category === "Behavioral" ? (
              <div className="col-span-2 space-y-2 bg-[#09090b] p-3 rounded-lg border border-[#1f1f23]">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                  STAR Framework
                </span>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Situation (Context)</label>
                  <input
                    type="text"
                    value={starS}
                    onChange={(e) => setStarS(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Task (Objective)</label>
                  <input
                    type="text"
                    value={starT}
                    onChange={(e) => setStarT(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Action (What you executed)</label>
                  <input
                    type="text"
                    value={starA}
                    onChange={(e) => setStarA(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Result (Measurable impact)</label>
                  <input
                    type="text"
                    value={starR}
                    onChange={(e) => setStarR(e.target.value)}
                    className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded p-2 text-xs text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="col-span-2">
                <label className="text-xs text-zinc-400 block mb-1">Prepared Solution / Code Answer</label>
                <textarea
                  placeholder="Code patterns, time/space complexities, key trade-offs..."
                  rows={4}
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
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#18181b] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
            >
              Save Question
            </button>
          </div>
        </form>
      )}

      {/* Edit Modal */}
      {editingQId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveEdit}
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-6 shadow-2xl w-full max-w-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
              <h3 className="font-sans font-bold text-base text-[#fafafa] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Edit Interview Question</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingQId(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Company</label>
                <input
                  type="text"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Round</label>
                <input
                  type="text"
                  value={editRound}
                  onChange={(e) => setEditRound(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-zinc-200"
                >
                  <option value="DSA">DSA / Algorithms</option>
                  <option value="System Design">System Design</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="SQL">SQL</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Difficulty</label>
                <select
                  value={editDifficulty}
                  onChange={(e) => setEditDifficulty(e.target.value as any)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-zinc-200"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-xs text-zinc-400 block mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  value={editQuestionText}
                  onChange={(e) => setEditQuestionText(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa]"
                />
              </div>

              {editCategory === "Behavioral" ? (
                <div className="col-span-2 space-y-2 bg-[#09090b] p-3 rounded-lg border border-[#1f1f23]">
                  <span className="text-xs font-bold text-blue-400 uppercase">STAR Framework</span>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Situation</label>
                    <input
                      type="text"
                      value={editStarS}
                      onChange={(e) => setEditStarS(e.target.value)}
                      className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Task</label>
                    <input
                      type="text"
                      value={editStarT}
                      onChange={(e) => setEditStarT(e.target.value)}
                      className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Action</label>
                    <input
                      type="text"
                      value={editStarA}
                      onChange={(e) => setEditStarA(e.target.value)}
                      className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Result</label>
                    <input
                      type="text"
                      value={editStarR}
                      onChange={(e) => setEditStarR(e.target.value)}
                      className="w-full bg-[#0c0c0e] border border-[#1f1f23] rounded p-2 text-xs text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="col-span-2">
                  <label className="text-xs text-zinc-400 block mb-1">Prepared Solution / Code</label>
                  <textarea
                    rows={4}
                    value={editAnswerText}
                    onChange={(e) => setEditAnswerText(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] font-mono"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1f1f23]">
              <button
                type="button"
                onClick={() => setEditingQId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#18181b] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of interview cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredQuestions.map((q) => (
          <div
            key={q.id}
            className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-zinc-700 rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-xs transition-all"
          >
            <div className="space-y-3.5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-bold">
                    {q.category}
                  </span>
                  {q.company && (
                    <span className="text-xs font-semibold text-zinc-300">
                      {q.company} ({q.round})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      q.difficulty === "Hard"
                        ? "text-red-400 bg-red-500/10 border-red-500/20"
                        : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    }`}
                  >
                    {q.difficulty}
                  </span>
                  <button
                    onClick={() => handleStartEdit(q)}
                    className="p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-[#18181b] rounded transition-colors cursor-pointer"
                    title="Edit question"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteInterviewQuestion(q.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                    title="Delete question"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question */}
              <h4 className="font-bold text-sm text-[#fafafa] leading-snug">
                {q.question}
              </h4>

              {/* STAR details if behavioral */}
              {q.category === "Behavioral" && q.starSituation ? (
                <div className="space-y-1.5 bg-[#09090b] p-3 rounded-lg border border-[#1f1f23] text-xs">
                  <p className="text-zinc-400"><strong className="text-zinc-500">S:</strong> {q.starSituation}</p>
                  <p className="text-zinc-400"><strong className="text-zinc-500">T:</strong> {q.starTask}</p>
                  <p className="text-zinc-400"><strong className="text-zinc-500">A:</strong> {q.starAction}</p>
                  <p className="text-zinc-200"><strong className="text-blue-400">R:</strong> {q.starResult}</p>
                </div>
              ) : (
                q.answer && (
                  <div className="bg-[#09090b] p-3 rounded-lg border border-[#1f1f23] font-mono text-[11px] text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-[140px] overflow-y-auto">
                    {q.answer}
                  </div>
                )
              )}
            </div>

            <div className="border-t border-[#1f1f23] pt-3 mt-1 flex justify-between items-center text-xs text-zinc-400">
              <button
                onClick={() => {
                  updateInterviewQuestion(q.id, { isReviewed: !q.isReviewed });
                  gainXP(q.isReviewed ? -50 : 50);
                }}
                className={`flex items-center gap-1.5 cursor-pointer font-medium ${
                  q.isReviewed ? "text-blue-400" : "text-zinc-400 hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{q.isReviewed ? "Reviewed" : "Mark as Reviewed"}</span>
              </button>
              <span className="text-[11px] text-zinc-500">
                {q.isReviewed ? "+50 XP earned" : "Ready for practice"}
              </span>
            </div>
          </div>
        ))}

        {filteredQuestions.length === 0 && (
          <div className="lg:col-span-2 py-24 text-center text-zinc-500 text-xs border border-dashed border-[#1f1f23] rounded-xl">
            No questions in this category. Click "Add Question" to draft your interview answers!
          </div>
        )}
      </div>
    </div>
  );
}
