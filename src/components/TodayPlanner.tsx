import React, { useState } from "react";
import { useStore } from "../store";
import { Clock, Plus, Trash2, Sparkles, CheckCircle2, AlertCircle, Edit2, Check, X } from "lucide-react";

export default function TodayPlanner() {
  const {
    tasks,
    plannerSlots,
    setPlannerSlots,
    addPlannerSlot,
    deletePlannerSlot,
    gainXP,
    dailyPriorities,
    addDailyPriority,
    toggleDailyPriority,
    updateDailyPriority,
    deleteDailyPriority
  } = useStore();

  const [newTime, setNewTime] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [linkedTaskId, setLinkedTaskId] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  // Dynamic priorities states
  const [newPriorityText, setNewPriorityText] = useState("");
  const [editingPriorityId, setEditingPriorityId] = useState<string | null>(null);
  const [editingPriorityText, setEditingPriorityText] = useState("");

  const activeTasks = tasks.filter((t) => t.status !== "Completed");

  const handleAddPriority = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPriorityText.trim()) return;
    addDailyPriority(newPriorityText.trim());
    setNewPriorityText("");
  };

  const handleStartEditPriority = (id: string, currentText: string) => {
    setEditingPriorityId(id);
    setEditingPriorityText(currentText);
  };

  const handleSaveEditPriority = (id: string) => {
    if (!editingPriorityText.trim()) return;
    updateDailyPriority(id, editingPriorityText.trim());
    setEditingPriorityId(null);
  };

  const handleCancelEditPriority = () => {
    setEditingPriorityId(null);
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTime || !newLabel) return;

    addPlannerSlot({
      time: newTime,
      label: newLabel,
      taskId: linkedTaskId || undefined
    });

    setNewTime("");
    setNewLabel("");
    setLinkedTaskId("");
  };

  const handleAskAI = async () => {
    setIsAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/planner/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: activeTasks })
      });

      if (!response.ok) {
        throw new Error("Could not fetch recommendation from server.");
      }

      const data = await response.json();
      if (data.slots && data.slots.length > 0) {
        setPlannerSlots(data.slots);
        gainXP(200); // reward XP for planning their day with AI!
      } else {
        throw new Error("Invalid or empty response from AI model.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div id="planner-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Today's Planner
          </h2>
          <p className="text-xs text-[#71717a] font-mono mt-1">
            Harmonize daily activities with high-priority learning tracks & work shifts
          </p>
        </div>
        
        <div>
          <button
            onClick={handleAskAI}
            disabled={isAiLoading}
            className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl transition-all shadow-md text-sm ${
              isAiLoading ? "opacity-75 cursor-not-allowed animate-pulse" : "cursor-pointer"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAiLoading ? "AI Optimizing Schedule..." : "AI Recommendation Planner"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Top 3 Priorities & Quick Add Form */}
        <div className="space-y-6">
          
          {/* Dynamic Daily Priorities Card */}
          <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm text-[#a1a1aa] uppercase tracking-wider font-mono">
                Morning SDE Priorities
              </h3>
              <span className="text-[10px] text-zinc-500 font-mono">
                {dailyPriorities.filter(p => p.completed).length}/{dailyPriorities.length} Done
              </span>
            </div>
            
            <div className="space-y-3">
              {dailyPriorities.map((priority, index) => {
                const isEditing = editingPriorityId === priority.id;

                if (isEditing) {
                  return (
                    <div key={priority.id} className="flex items-center gap-2 p-3 rounded-lg bg-[#09090b]/80 border border-blue-500/30">
                      <input
                        type="text"
                        value={editingPriorityText}
                        onChange={(e) => setEditingPriorityText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEditPriority(priority.id);
                          if (e.key === "Escape") handleCancelEditPriority();
                        }}
                        className="flex-1 bg-transparent text-xs font-semibold text-[#fafafa] focus:outline-none py-1 border-b border-blue-500/40 px-1 font-sans"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditPriority(priority.id)}
                        className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors cursor-pointer"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditPriority}
                        className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div key={priority.id} className="flex items-center gap-2 group relative">
                    <label className="flex-1 flex items-center gap-3 p-3.5 rounded-lg bg-[#09090b]/60 border border-[#1f1f23] cursor-pointer hover:bg-[#09090b] transition-colors overflow-hidden">
                      <input
                        type="checkbox"
                        checked={priority.completed}
                        onChange={() => toggleDailyPriority(priority.id)}
                        className="w-4 h-4 rounded border-[#27272a] bg-[#18181b] text-blue-500 focus:ring-0 focus:ring-offset-0 shrink-0"
                      />
                      <span className={`text-xs font-semibold select-none pr-8 truncate ${priority.completed ? "line-through text-[#71717a]" : "text-[#fafafa]"}`}>
                        {priority.text}
                      </span>
                      <span className="ml-auto shrink-0 text-[9px] font-mono text-blue-400 font-semibold uppercase bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/10">
                        +{priority.xpValue} XP
                      </span>
                    </label>
                    
                    {/* Inline Hover Action Controls */}
                    <div className="absolute right-14 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0c0c0e] border border-[#1f1f23] p-1 rounded-lg shadow-lg z-10">
                      <button
                        type="button"
                        onClick={() => handleStartEditPriority(priority.id, priority.text)}
                        className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Text"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDailyPriority(priority.id)}
                        className="p-1 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Priority"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {dailyPriorities.length === 0 && (
                <div className="py-4 text-center text-[#71717a] text-xs font-mono">
                  No active priorities. Define a daily priority below!
                </div>
              )}
            </div>

            {/* Quick Add Priority Form */}
            <form onSubmit={handleAddPriority} className="flex gap-2 pt-3 border-t border-[#1f1f23]/50">
              <input
                type="text"
                placeholder="Add daily priority..."
                required
                value={newPriorityText}
                onChange={(e) => setNewPriorityText(e.target.value)}
                className="flex-1 bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg px-2.5 py-2 text-xs text-[#fafafa] focus:outline-none font-sans"
              />
              <button
                type="submit"
                className="bg-[#18181b] hover:bg-zinc-800 text-[#fafafa] px-3.5 py-2 rounded-lg border border-[#27272a] text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Quick Add Custom Slot Form */}
          <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4">
            <h3 className="font-sans font-bold text-sm text-[#a1a1aa] uppercase tracking-wider font-mono">
              Add Manual Slot
            </h3>
            
            <form onSubmit={handleAddSlot} className="space-y-3.5">
              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Time (e.g. 19:30)</label>
                <input
                  type="text"
                  placeholder="19:30"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2 text-xs font-mono text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Activity Label</label>
                <input
                  type="text"
                  placeholder="Leetcode Practice / Code Review"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Link to Active Task (Optional)</label>
                <select
                  value={linkedTaskId}
                  onChange={(e) => setLinkedTaskId(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2 text-xs text-[#a1a1aa] focus:outline-none"
                >
                  <option value="">No linked task</option>
                  {activeTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.category}] {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#18181b] hover:bg-zinc-800 text-[#fafafa] text-xs font-bold py-2.5 rounded-lg border border-[#27272a] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Time Slot</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Full Hourly Schedule Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>Daily Planner Schedule</span>
              </h3>
              <span className="text-[10px] font-mono text-[#71717a]">
                {plannerSlots.length} active slots
              </span>
            </div>

            {aiError && (
              <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {isAiLoading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-blue-400">Gemini LLM is configuring the perfect timetable...</span>
                <span className="text-[10px] text-[#71717a]">Aligning study hours with work shifts</span>
              </div>
            ) : (
              <div className="relative border-l border-[#1f1f23] ml-3.5 pl-5 space-y-5">
                {plannerSlots.map((slot, index) => {
                  const linkedTask = tasks.find((t) => t.id === slot.taskId);
                  return (
                    <div key={index} className="relative group">
                      {/* Timeline dot */}
                      <span className="absolute -left-[26px] top-1 w-3 h-3 rounded-full bg-[#0c0c0e] border-2 border-blue-500 group-hover:bg-blue-400 transition-colors z-10" />

                      <div className="flex flex-col md:flex-row md:items-center justify-between p-3.5 bg-[#09090b]/60 hover:bg-[#09090b] rounded-xl border border-[#1f1f23] hover:border-[#1f1f23] transition-all gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-bold">
                            {slot.time}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-[#fafafa]">{slot.label}</p>
                            {linkedTask && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/15 mt-1">
                                Linked Task: [{linkedTask.category}] {linkedTask.title}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                          <button
                            onClick={() => deletePlannerSlot(slot.time)}
                            className="p-1.5 text-[#71717a] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                            title="Delete time slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {plannerSlots.length === 0 && (
                  <div className="py-12 text-center text-[#71717a] text-xs font-mono">
                    No timeline slots. Use "AI Recommendation Planner" to automatically design your day!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
