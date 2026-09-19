import React, { useState } from "react";
import { useStore, getTodayStr } from "../store";
import { Clock, Plus, Trash2, CheckCircle2, Edit2, Check, X, Calendar, Sparkles, CalendarRange } from "lucide-react";

export default function TodayPlanner() {
  const {
    tasks,
    plannerSlots,
    addPlannerSlot,
    updatePlannerSlot,
    deletePlannerSlot,
    dailyPriorities,
    addDailyPriority,
    toggleDailyPriority,
    updateDailyPriority,
    deleteDailyPriority,
    setActiveTab
  } = useStore();

  const todayStr = getTodayStr();
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  // Add slot form
  const [newTime, setNewTime] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [linkedTaskId, setLinkedTaskId] = useState("");

  // Edit slot state
  const [editingSlotTime, setEditingSlotTime] = useState<string | null>(null);
  const [editSlotTimeVal, setEditSlotTimeVal] = useState("");
  const [editSlotLabelVal, setEditSlotLabelVal] = useState("");
  const [editSlotLinkedTaskId, setEditSlotLinkedTaskId] = useState("");

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
    if (!newTime.trim() || !newLabel.trim()) return;

    addPlannerSlot({
      time: newTime.trim(),
      label: newLabel.trim(),
      taskId: linkedTaskId || undefined
    });

    setNewTime("");
    setNewLabel("");
    setLinkedTaskId("");
  };

  const handleStartEditSlot = (slot: { time: string; label: string; taskId?: string }) => {
    setEditingSlotTime(slot.time);
    setEditSlotTimeVal(slot.time);
    setEditSlotLabelVal(slot.label);
    setEditSlotLinkedTaskId(slot.taskId || "");
  };

  const handleSaveEditSlot = (oldTime: string) => {
    if (!editSlotTimeVal.trim() || !editSlotLabelVal.trim()) return;
    updatePlannerSlot(oldTime, {
      time: editSlotTimeVal.trim(),
      label: editSlotLabelVal.trim(),
      taskId: editSlotLinkedTaskId || undefined
    });
    setEditingSlotTime(null);
  };

  const handleCancelEditSlot = () => {
    setEditingSlotTime(null);
  };

  return (
    <div id="planner-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa]">
              Today's Schedule & Priorities
            </h2>
            <span className="text-[11px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
              {todayFormatted}
            </span>
          </div>
          <p className="text-xs text-[#71717a] mt-1">
            Organize your day with flexible time blocks and key daily goals. Everything syncs live with Calendar and Dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("calendar")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#121215] border border-[#27272a] hover:border-blue-500/40 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Open Calendar View"
          >
            <CalendarRange className="w-3.5 h-3.5 text-blue-400" />
            <span>Workspace Calendar</span>
          </button>
          <span className="text-xs font-mono text-zinc-400 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-lg">
            {plannerSlots.length} Scheduled Blocks
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Daily Priorities & Add Slot Form */}
        <div className="space-y-6">
          {/* Dynamic Daily Priorities Card */}
          <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-sm text-[#fafafa] tracking-tight">
                  Top Daily Priorities
                </h3>
                <p className="text-[11px] text-zinc-500">Click checkmark to toggle, or edit directly</p>
              </div>
              <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded font-mono font-semibold">
                {dailyPriorities.filter((p) => p.completed).length}/{dailyPriorities.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {dailyPriorities.map((priority) => {
                const isEditing = editingPriorityId === priority.id;

                if (isEditing) {
                  return (
                    <div
                      key={priority.id}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-[#09090b] border border-blue-500/50"
                    >
                      <input
                        type="text"
                        value={editingPriorityText}
                        onChange={(e) => setEditingPriorityText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEditPriority(priority.id);
                          if (e.key === "Escape") handleCancelEditPriority();
                        }}
                        className="flex-1 bg-transparent text-xs font-medium text-[#fafafa] focus:outline-none"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEditPriority(priority.id)}
                        className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded cursor-pointer"
                        title="Save edit"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleCancelEditPriority}
                        className="p-1 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={priority.id}
                    className={`group flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      priority.completed
                        ? "bg-[#09090b]/50 border-[#1f1f23] text-zinc-500 line-through"
                        : "bg-[#09090b] border-[#1f1f23] hover:border-zinc-700 text-zinc-200"
                    }`}
                  >
                    <div
                      onClick={() => toggleDailyPriority(priority.id)}
                      className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer select-none"
                    >
                      <button
                        type="button"
                        className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                          priority.completed
                            ? "bg-blue-600 text-white"
                            : "border border-zinc-600 group-hover:border-blue-400"
                        }`}
                      >
                        {priority.completed && <Check className="w-3 h-3" />}
                      </button>
                      <span className="text-xs truncate">{priority.text}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                      <button
                        onClick={() => handleStartEditPriority(priority.id, priority.text)}
                        className="p-1 text-zinc-400 hover:text-blue-400 hover:bg-[#18181b] rounded cursor-pointer"
                        title="Edit priority text"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteDailyPriority(priority.id)}
                        className="p-1 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded cursor-pointer"
                        title="Delete priority"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {dailyPriorities.length === 0 && (
                <p className="text-xs text-zinc-500 py-3 text-center">No priorities added yet.</p>
              )}
            </div>

            {/* Add new priority form */}
            <form onSubmit={handleAddPriority} className="flex gap-2 pt-2 border-t border-[#1f1f23]">
              <input
                type="text"
                value={newPriorityText}
                onChange={(e) => setNewPriorityText(e.target.value)}
                placeholder="Add a new daily priority..."
                className="flex-1 bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg px-3 py-1.5 text-xs text-[#fafafa] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] px-3 py-1.5 rounded-lg border border-[#27272a] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* Add Time Slot Form */}
          <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="font-sans font-bold text-sm text-[#fafafa] tracking-tight">
              Add Schedule Time Block
            </h3>

            <form onSubmit={handleAddSlot} className="space-y-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Time (e.g. 09:00, 14:30)</label>
                <input
                  type="text"
                  placeholder="09:00"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg px-3 py-2 text-xs font-mono text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Activity / Focus Name</label>
                <input
                  type="text"
                  placeholder="Deep Work / System Design / Code Review"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Link to Task (Optional)</label>
                <select
                  value={linkedTaskId}
                  onChange={(e) => setLinkedTaskId(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg px-3 py-2 text-xs text-zinc-300 focus:outline-none"
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
                className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Time Block</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Full Schedule Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-base text-[#fafafa] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Daily Schedule Timeline</span>
                </h3>
                <p className="text-xs text-zinc-500">All blocks can be edited or deleted</p>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {plannerSlots.length} blocks
              </span>
            </div>

            <div className="relative border-l border-[#1f1f23] ml-3.5 pl-5 space-y-4">
              {plannerSlots.map((slot, index) => {
                const linkedTask = tasks.find((t) => t.id === slot.taskId);
                const isEditing = editingSlotTime === slot.time;

                if (isEditing) {
                  return (
                    <div key={index} className="relative group">
                      <span className="absolute -left-[26px] top-3 w-3 h-3 rounded-full bg-blue-500 z-10" />
                      <div className="p-4 bg-[#09090b] rounded-xl border border-blue-500/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-400">Edit Time Block</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSaveEditSlot(slot.time)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={handleCancelEditSlot}
                              className="px-2.5 py-1 bg-[#18181b] hover:bg-zinc-800 text-zinc-300 rounded text-xs cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-zinc-400 block mb-1">Time</label>
                            <input
                              type="text"
                              value={editSlotTimeVal}
                              onChange={(e) => setEditSlotTimeVal(e.target.value)}
                              className="w-full bg-[#18181b] border border-[#27272a] rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-zinc-400 block mb-1">Activity Label</label>
                            <input
                              type="text"
                              value={editSlotLabelVal}
                              onChange={(e) => setEditSlotLabelVal(e.target.value)}
                              className="w-full bg-[#18181b] border border-[#27272a] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">Linked Task</label>
                          <select
                            value={editSlotLinkedTaskId}
                            onChange={(e) => setEditSlotLinkedTaskId(e.target.value)}
                            className="w-full bg-[#18181b] border border-[#27272a] rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
                          >
                            <option value="">No linked task</option>
                            {tasks.map((t) => (
                              <option key={t.id} value={t.id}>
                                [{t.category}] {t.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={index} className="relative group">
                    {/* Timeline dot */}
                    <span className="absolute -left-[26px] top-3.5 w-3 h-3 rounded-full bg-[#0c0c0e] border-2 border-blue-500 group-hover:bg-blue-400 transition-colors z-10" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#09090b]/70 hover:bg-[#09090b] rounded-xl border border-[#1f1f23] hover:border-zinc-700 transition-all gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded font-bold shrink-0">
                          {slot.time}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-[#fafafa]">{slot.label}</p>
                          {linkedTask && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-700 mt-1">
                              Task: {linkedTask.title}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => handleStartEditSlot(slot)}
                          className="p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-[#18181b] rounded transition-colors cursor-pointer"
                          title="Edit this time block"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deletePlannerSlot(slot.time)}
                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                          title="Delete this time block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {plannerSlots.length === 0 && (
                <div className="py-12 text-center text-zinc-500 text-xs font-mono">
                  No time blocks scheduled for today yet. Use the form on the left to add one!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
