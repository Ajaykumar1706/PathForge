import React, { useState } from "react";
import { useStore } from "../store";
import { Habit } from "../types";
import { Activity, Flame, Plus, Trash2, Check, Edit2, X } from "lucide-react";

export default function HabitTracker() {
  const { habits, addHabit, updateHabit, deleteHabit, toggleHabitDate, gainXP } = useStore();

  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitFreq, setNewHabitFreq] = useState<"daily" | "weekly">("daily");
  const [isAdding, setIsAdding] = useState(false);

  // Edit habit modal
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editFreq, setEditFreq] = useState<"daily" | "weekly">("daily");
  const [editStreak, setEditStreak] = useState(0);

  // Generate the last 7 days dynamically
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const isToday = i === 6;
    return { dateStr, dayName, dayNum: d.getDate(), isToday };
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    addHabit(newHabitName.trim(), newHabitFreq);
    gainXP(50);
    setNewHabitName("");
    setNewHabitFreq("daily");
    setIsAdding(false);
  };

  const handleStartEdit = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setEditName(habit.name);
    setEditFreq(habit.frequency);
    setEditStreak(habit.streak);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHabitId || !editName.trim()) return;

    updateHabit(editingHabitId, {
      name: editName.trim(),
      frequency: editFreq,
      streak: Math.max(0, Number(editStreak) || 0)
    });

    setEditingHabitId(null);
  };

  return (
    <div id="habit-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Habits Tracker
          </h2>
          <p className="text-xs text-[#71717a] mt-1">
            Build consistency with daily check-ins and streaks. Everything is fully editable.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Habit</span>
          </button>
        </div>
      </div>

      {/* Add Habit Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateHabit}
          className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-md space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
            <h3 className="font-sans font-bold text-sm text-[#fafafa]">Create Habit</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Habit Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Solve 2 LeetCode Problems"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Frequency</label>
              <select
                value={newHabitFreq}
                onChange={(e) => setNewHabitFreq(e.target.value as "daily" | "weekly")}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-300 focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
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
              Save Habit
            </button>
          </div>
        </form>
      )}

      {/* Edit Habit Modal */}
      {editingHabitId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveEdit}
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-6 shadow-2xl w-full max-w-md space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
              <h3 className="font-sans font-bold text-base text-[#fafafa] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Edit Habit</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingHabitId(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Frequency</label>
                  <select
                    value={editFreq}
                    onChange={(e) => setEditFreq(e.target.value as "daily" | "weekly")}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-zinc-300"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Current Streak (Days)</label>
                  <input
                    type="number"
                    min={0}
                    value={editStreak}
                    onChange={(e) => setEditStreak(Number(e.target.value))}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1f1f23]">
              <button
                type="button"
                onClick={() => setEditingHabitId(null)}
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

      {/* Habits List */}
      <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Weekly Consistency Tracker
          </span>
          <span className="text-xs font-mono text-zinc-400">{habits.length} Active Habits</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1f1f23] text-zinc-400 text-[11px]">
                <th className="pb-3 font-semibold">Habit Name</th>
                <th className="pb-3 font-semibold text-center w-24">Streak</th>
                {past7Days.map((d) => (
                  <th key={d.dateStr} className="pb-3 text-center w-14 font-mono font-medium">
                    <span className={d.isToday ? "text-blue-400 font-bold" : "text-zinc-500"}>
                      {d.dayName}
                    </span>
                    <span className="block text-[10px] text-zinc-600">{d.dayNum}</span>
                  </th>
                ))}
                <th className="pb-3 text-right w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f23]">
              {habits.map((habit) => (
                <tr key={habit.id} className="hover:bg-[#09090b]/50 group transition-colors">
                  <td className="py-3 font-medium text-zinc-200">
                    <div className="flex items-center gap-2">
                      <span>{habit.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono capitalize">
                        ({habit.frequency})
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                      <Flame className="w-3 h-3 fill-current" />
                      {habit.streak}d
                    </span>
                  </td>
                  {past7Days.map((d) => {
                    const isChecked = !!habit.history[d.dateStr];
                    return (
                      <td key={d.dateStr} className="py-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleHabitDate(habit.id, d.dateStr)}
                          className={`w-7 h-7 rounded-lg mx-auto flex items-center justify-center transition-all cursor-pointer ${
                            isChecked
                              ? "bg-blue-600 text-white shadow-xs"
                              : "border border-zinc-700 bg-zinc-900/50 hover:border-blue-400 text-transparent hover:text-zinc-600"
                          }`}
                          title={`Toggle ${d.dateStr}`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    );
                  })}
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleStartEdit(habit)}
                        className="p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-[#18181b] rounded transition-colors cursor-pointer"
                        title="Edit habit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                        title="Delete habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {habits.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-zinc-500 text-xs">
                    No habits created yet. Click "Create New Habit" above to start tracking.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
