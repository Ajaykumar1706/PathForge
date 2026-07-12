import React, { useState } from "react";
import { useStore } from "../store";
import { Activity, Flame, Plus, Trash2, Check, Zap } from "lucide-react";

export default function HabitTracker() {
  const { habits, addHabit, deleteHabit, toggleHabitDate, gainXP } = useStore();

  const [newHabitName, setNewHabitName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Focus dates for heatmap (last 7 days representing July 6th to July 12th, 2026)
  const focusDates = [
    "2026-07-06",
    "2026-07-07",
    "2026-07-08",
    "2026-07-09",
    "2026-07-10",
    "2026-07-11",
    "2026-07-12"
  ];

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName) return;

    addHabit(newHabitName);
    gainXP(50);
    setNewHabitName("");
    setIsAdding(false);
  };

  return (
    <div id="habit-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Habits Tracking System
          </h2>
          <p className="text-xs text-[#71717a] font-mono mt-1">
            Build discipline with consistency check-ins. Completed logs grant +50 XP!
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Habit</span>
          </button>
        </div>
      </div>

      {/* Inline Create Form */}
      {isAdding && (
        <form onSubmit={handleCreateHabit} className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-sm space-y-4">
          <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono">
            New Habit Definition
          </h3>
          <div>
            <label className="text-[10px] text-[#71717a] font-mono block mb-1">Habit Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Solve 2 DSA Questions"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
            />
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
              Save Habit
            </button>
          </div>
        </form>
      )}

      {/* Grid listing habits with heatmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {habits.map((habit) => {
          // Calculate historical completions counts
          const completedCount = Object.values(habit.history).filter(Boolean).length;
          
          return (
            <div key={habit.id} className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
              
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg">
                      <Activity className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[#fafafa]">{habit.name}</h4>
                      <span className="text-[10px] text-[#71717a] font-mono">Completed: {completedCount} total times</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/15 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      {habit.streak} day streak
                    </span>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 text-[#71717a] hover:text-red-400 rounded hover:bg-red-500/5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Day grid loggers (interactive Heatmap) */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-[#71717a] uppercase font-bold tracking-wider block">
                    Completions Heatmap (Last 7 Days)
                  </span>

                  <div className="grid grid-cols-7 gap-2 text-center">
                    {focusDates.map((dateStr) => {
                      const isDone = !!habit.history[dateStr];
                      const displayDay = dateStr.split("-")[2]; // extract day num

                      return (
                        <button
                          key={dateStr}
                          onClick={() => toggleHabitDate(habit.id, dateStr)}
                          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                            isDone
                              ? "bg-blue-500/10 border-blue-500/40 text-blue-400 font-bold"
                              : "bg-[#09090b]/40 hover:bg-[#18181b] border-[#1f1f23] text-[#71717a]"
                          }`}
                          title={`Toggle ${dateStr}`}
                        >
                          <span className="text-[10px] font-mono">{displayDay}</span>
                          <div className={`w-2.5 h-2.5 rounded-full flex items-center justify-center ${isDone ? "bg-blue-400" : "bg-[#27272a]"}`}>
                            {isDone && <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-between px-1 text-[9px] font-mono text-[#71717a] pt-1">
                    <span>Mon (Jul 06)</span>
                    <span>Today (Jul 12)</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#1f1f23] pt-3 mt-1 flex justify-between items-center text-[10px] text-[#71717a] font-mono">
                <span>Earn +50 XP per day log</span>
                <span className="text-blue-400 flex items-center gap-0.5">
                  <Zap className="w-3 h-3" /> Habits increase CareerScore
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
