import React, { useState } from "react";
import { useStore } from "../store";
import { ResumeVersion } from "../types";
import { FileText, Plus, Trash2, Sparkles, Star, ClipboardCheck, AlertCircle } from "lucide-react";

export default function ResumeManager() {
  const { resumeVersions, addResumeVersion, updateResumeVersion, deleteResumeVersion, gainXP } = useStore();

  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // AI Reviewing State
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(resumeVersions[0]?.id || null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const selectedResume = resumeVersions.find((r) => r.id === selectedResumeId);

  const handleCreateResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addResumeVersion(newTitle, newNotes);
    gainXP(100);

    setNewTitle("");
    setNewNotes("");
    setIsAdding(false);
  };

  const handleAskAiReview = async () => {
    if (!selectedResumeId || !selectedResume) return;

    setIsAiLoading(true);
    setAiError("");

    try {
      const response = await fetch("/api/resume/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedResume.title,
          notes: selectedResume.notes || ""
        })
      });

      if (!response.ok) {
        throw new Error("Could not connect to AI Resume review system.");
      }

      const reviewData = await response.json();
      if (reviewData && typeof reviewData.score === "number") {
        updateResumeVersion(selectedResumeId, {
          aiReviewScore: reviewData.score,
          aiReviewFeedback: reviewData.feedback
        });
        gainXP(250); // reward huge XP for submitting resume to AI analysis!
      } else {
        throw new Error("Invalid response format from AI model.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to parse critique results.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div id="resume-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Resume Manager
          </h2>
          <p className="text-xs text-[#71717a] font-mono mt-1">
            Maintain resume versions, track background logs, and trigger real-time AI recruitment audits
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resume Version</span>
          </button>
        </div>
      </div>

      {/* Adding Form inline */}
      {isAdding && (
        <form onSubmit={handleCreateResume} className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-lg space-y-4">
          <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono">
            New Resume Record
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Resume File Name / Version Title</label>
              <input
                type="text"
                required
                placeholder="Ajay_Resume_SDE2_Cloud.pdf"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Background Notes / Resume Text content</label>
              <textarea
                placeholder="Paste summary paragraphs or highlights from this version..."
                rows={4}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-mono"
              />
            </div>
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
              Add Resume
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: versions list */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-mono text-[#71717a] uppercase font-bold tracking-wider">
            Resume Registry
          </span>

          {resumeVersions.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedResumeId(item.id)}
              className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all group cursor-pointer ${
                selectedResumeId === item.id
                  ? "bg-[#0c0c0e] border-blue-500/40 text-[#fafafa] shadow"
                  : "bg-[#0c0c0e]/40 hover:bg-[#0c0c0e] border-[#1f1f23] hover:border-[#27272a] text-[#71717a]"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className={`w-5 h-5 ${selectedResumeId === item.id ? "text-blue-400" : "text-[#71717a]"}`} />
                <div>
                  <h4 className="text-xs font-bold text-[#fafafa] truncate max-w-[150px]">{item.title}</h4>
                  <p className="text-[10px] text-[#71717a] font-mono mt-0.5">Updated: {item.lastUpdated}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {item.aiReviewScore && (
                  <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/15">
                    {item.aiReviewScore}%
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteResumeVersion(item.id);
                    if (selectedResumeId === item.id) setSelectedResumeId(null);
                  }}
                  className="p-1 text-[#71717a] hover:text-red-400 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </button>
          ))}

          {resumeVersions.length === 0 && (
            <div className="py-12 text-center text-[#71717a] text-xs font-mono border border-dashed border-[#1f1f23] rounded-xl">
              No files saved yet.
            </div>
          )}
        </div>

        {/* Right column: Selected Resume details + AI reviewer */}
        <div className="lg:col-span-2 space-y-4">
          {selectedResume ? (
            <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-5 shadow-sm">
              
              <div className="flex items-start justify-between gap-3 border-b border-[#1f1f23] pb-4">
                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-base text-[#fafafa] flex items-center gap-2">
                    {selectedResume.title}
                  </h3>
                  <p className="text-xs text-[#71717a] font-mono">Last updated on {selectedResume.lastUpdated}</p>
                </div>

                <button
                  onClick={handleAskAiReview}
                  disabled={isAiLoading}
                  className={`flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs shadow ${
                    isAiLoading ? "opacity-70 animate-pulse cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? "AI Evaluating..." : "Trigger AI Resume Review"}</span>
                </button>
              </div>

              {/* Bio and text preview */}
              {selectedResume.notes && (
                <div className="bg-[#09090b]/60 p-3.5 rounded-lg border border-[#1f1f23] space-y-2">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase font-bold tracking-wider">
                    Text / Content Preview
                  </span>
                  <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-[160px] overflow-y-auto pr-1">
                    {selectedResume.notes}
                  </p>
                </div>
              )}

              {/* AI review outputs */}
              <div className="border-t border-[#1f1f23] pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Gemini AI Audit Report</span>
                  </h4>

                  {selectedResume.aiReviewScore ? (
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                      Evaluation score: {selectedResume.aiReviewScore} / 100
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#71717a]">
                      Critique pending. Click "Trigger AI Resume Review".
                    </span>
                  )}
                </div>

                {aiError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-xs flex items-center gap-2 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                )}

                {isAiLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2.5 text-[#71717a] text-xs font-mono">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-400">Gemini SDE audit engine evaluating metrics and action verbs...</span>
                  </div>
                ) : (
                  selectedResume.aiReviewFeedback && (
                    <div className="p-4 bg-[#09090b]/40 border border-[#1f1f23] rounded-xl space-y-2 max-h-[250px] overflow-y-auto pr-1">
                      <div className="text-xs text-slate-300 leading-relaxed font-sans prose-invert">
                        {/* Simply parsing markdown segments into rows */}
                        {selectedResume.aiReviewFeedback.split("\n").map((line, idx) => {
                          if (line.startsWith("-") || line.startsWith("*")) {
                            return (
                              <li key={idx} className="list-disc ml-4 py-0.5 text-slate-300">
                                {line.substring(1).trim()}
                              </li>
                            );
                          }
                          return <p key={idx} className="py-1 text-slate-300 font-medium">{line}</p>;
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>

            </div>
          ) : (
            <div className="py-24 text-center text-[#71717a] text-xs font-mono border border-dashed border-[#1f1f23] rounded-xl bg-[#0c0c0e]/20">
              Select or create a resume record to view.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
