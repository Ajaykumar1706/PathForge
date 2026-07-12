import React, { useState } from "react";
import { useStore } from "../store";
import { Route, Plus, Trash2, CheckSquare, Sparkles, TrendingUp, Calendar, HelpCircle } from "lucide-react";

export default function RoadmapTracker() {
  const { roadmaps, addRoadmap, deleteRoadmap, toggleMilestone, gainXP } = useStore();

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isAddingRoadmap, setIsAddingRoadmap] = useState(false);

  // Milestone quick add state
  const [targetRoadmapId, setTargetRoadmapId] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("2026-07-30");

  const handleCreateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addRoadmap({
      title: newTitle,
      description: newDesc,
      progress: 0,
      createdAt: new Date().toISOString(),
      milestones: [
        { id: "m_" + Math.random().toString(36).substr(2, 9), title: "Milestone Phase 1: Foundational core setup", isCompleted: false, dueDate: "2026-07-31" }
      ]
    });

    gainXP(150); // reward 150 XP for planning their career roadmap!
    setNewTitle("");
    setNewDesc("");
    setIsAddingRoadmap(false);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRoadmapId || !milestoneTitle) return;

    const target = roadmaps.find((r) => r.id === targetRoadmapId);
    if (target) {
      const updatedMilestones = [
        ...target.milestones,
        {
          id: "m_" + Math.random().toString(36).substr(2, 9),
          title: milestoneTitle,
          isCompleted: false,
          dueDate: milestoneDate
        }
      ];
      // calculate new progress %
      const comp = updatedMilestones.filter((m) => m.isCompleted).length;
      const progress = Math.round((comp / updatedMilestones.length) * 100) || 0;

      // Update state
      useStore.getState().updateRoadmap(targetRoadmapId, {
        milestones: updatedMilestones,
        progress
      });

      gainXP(50); // reward XP for creating detailed career milestones
      setMilestoneTitle("");
    }
  };

  return (
    <div id="roadmap-view" className="flex-1 overflow-y-auto bg-slate-950 p-6 space-y-6 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-slate-100 flex items-center gap-2">
            Career Roadmaps
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Map out long-term software architect goals, milestones, deadlines, and tracking checks
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAddingRoadmap(!isAddingRoadmap)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Career Roadmap</span>
          </button>
        </div>
      </div>

      {/* Adding Form inline */}
      {isAddingRoadmap && (
        <form onSubmit={handleCreateRoadmap} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg max-w-lg space-y-4">
          <h3 className="font-sans font-bold text-sm text-slate-200 uppercase tracking-wider font-mono">
            New Career Track Builder
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">Roadmap Title (e.g. Become AI Engineer)</label>
              <input
                type="text"
                required
                placeholder="Become Senior Cloud Architect / Tech Lead"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-500 font-mono block mb-1">Track Objective / Description</label>
              <textarea
                placeholder="What is the professional goal and timeline?"
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddingRoadmap(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs"
            >
              Construct Roadmap
            </button>
          </div>
        </form>
      )}

      {/* Grid of Roadmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roadmaps.map((track) => (
          <div key={track.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                    <Route className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-100">{track.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">Created • {new Date(track.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => deleteRoadmap(track.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                  title="Delete roadmap"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {track.description && (
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                  {track.description}
                </p>
              )}

              {/* Progress Indicator */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Path Completion Progress</span>
                  <span className="text-emerald-400 font-mono font-bold">{track.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700/40">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${track.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold tracking-wider">
                  Checklist Milestones
                </span>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {track.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-850 hover:bg-slate-950 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={milestone.isCompleted}
                        onChange={() => toggleMilestone(track.id, milestone.id)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${milestone.isCompleted ? "line-through text-slate-500" : "text-slate-200"}`}>
                          {milestone.title}
                        </p>
                        {milestone.dueDate && (
                          <span className="text-[9px] font-mono text-slate-500 block mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-emerald-500/50" />
                            Target Deadline: {milestone.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form: Quick Add Milestone */}
            <form
              onSubmit={(e) => {
                setTargetRoadmapId(track.id);
                handleAddMilestone(e);
              }}
              className="border-t border-slate-800/80 pt-4 mt-2 flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                required
                placeholder="Add sub-milestone (e.g. Learn pgvector)"
                value={targetRoadmapId === track.id ? milestoneTitle : ""}
                onChange={(e) => {
                  setTargetRoadmapId(track.id);
                  setMilestoneTitle(e.target.value);
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
              />
              <input
                type="date"
                value={targetRoadmapId === track.id ? milestoneDate : "2026-07-30"}
                onChange={(e) => {
                  setTargetRoadmapId(track.id);
                  setMilestoneDate(e.target.value);
                }}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-400 focus:outline-none font-mono"
              />
              <button
                type="submit"
                onClick={() => setTargetRoadmapId(track.id)}
                className="bg-slate-800 hover:bg-slate-700 hover:text-slate-100 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                Add
              </button>
            </form>
          </div>
        ))}

        {roadmaps.length === 0 && (
          <div className="lg:col-span-2 py-24 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
            No active roadmaps. Set up your professional targets today!
          </div>
        )}
      </div>
    </div>
  );
}
