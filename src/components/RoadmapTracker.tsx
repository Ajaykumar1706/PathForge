import React, { useState } from "react";
import { useStore } from "../store";
import { Route, Plus, Trash2, Edit2, Calendar, Check, X, CheckSquare } from "lucide-react";

export default function RoadmapTracker() {
  const { roadmaps, addRoadmap, updateRoadmap, deleteRoadmap, toggleMilestone, gainXP } = useStore();

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isAddingRoadmap, setIsAddingRoadmap] = useState(false);

  // Edit Roadmap Modal
  const [editingRoadmapId, setEditingRoadmapId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Milestone quick add state
  const [targetRoadmapId, setTargetRoadmapId] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDate, setMilestoneDate] = useState("");

  // Milestone inline edit state
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editMilestoneTitle, setEditMilestoneTitle] = useState("");
  const [editMilestoneDate, setEditMilestoneDate] = useState("");

  const handleCreateRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addRoadmap({
      title: newTitle.trim(),
      description: newDesc.trim(),
      progress: 0,
      createdAt: new Date().toISOString(),
      milestones: [
        {
          id: "m_" + Math.random().toString(36).substr(2, 9),
          title: "Phase 1: Core foundation & fundamentals",
          isCompleted: false,
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0]
        }
      ]
    });

    gainXP(150);
    setNewTitle("");
    setNewDesc("");
    setIsAddingRoadmap(false);
  };

  const handleStartEditRoadmap = (track: { id: string; title: string; description?: string }) => {
    setEditingRoadmapId(track.id);
    setEditTitle(track.title);
    setEditDesc(track.description || "");
  };

  const handleSaveEditRoadmap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoadmapId || !editTitle.trim()) return;

    updateRoadmap(editingRoadmapId, {
      title: editTitle.trim(),
      description: editDesc.trim()
    });

    setEditingRoadmapId(null);
  };

  const handleAddMilestone = (e: React.FormEvent, trackId: string) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;

    const target = roadmaps.find((r) => r.id === trackId);
    if (target) {
      const updatedMilestones = [
        ...target.milestones,
        {
          id: "m_" + Math.random().toString(36).substr(2, 9),
          title: milestoneTitle.trim(),
          isCompleted: false,
          dueDate: milestoneDate || undefined
        }
      ];

      const comp = updatedMilestones.filter((m) => m.isCompleted).length;
      const progress = Math.round((comp / updatedMilestones.length) * 100) || 0;

      updateRoadmap(trackId, {
        milestones: updatedMilestones,
        progress
      });

      gainXP(50);
      setMilestoneTitle("");
      setMilestoneDate("");
    }
  };

  const handleDeleteMilestone = (trackId: string, milestoneId: string) => {
    const target = roadmaps.find((r) => r.id === trackId);
    if (target) {
      const updatedMilestones = target.milestones.filter((m) => m.id !== milestoneId);
      const comp = updatedMilestones.filter((m) => m.isCompleted).length;
      const progress = updatedMilestones.length > 0 ? Math.round((comp / updatedMilestones.length) * 100) : 0;

      updateRoadmap(trackId, {
        milestones: updatedMilestones,
        progress
      });
    }
  };

  const handleStartEditMilestone = (m: { id: string; title: string; dueDate?: string }) => {
    setEditingMilestoneId(m.id);
    setEditMilestoneTitle(m.title);
    setEditMilestoneDate(m.dueDate || "");
  };

  const handleSaveEditMilestone = (trackId: string, milestoneId: string) => {
    if (!editMilestoneTitle.trim()) return;
    const target = roadmaps.find((r) => r.id === trackId);
    if (target) {
      const updatedMilestones = target.milestones.map((m) =>
        m.id === milestoneId
          ? { ...m, title: editMilestoneTitle.trim(), dueDate: editMilestoneDate || undefined }
          : m
      );

      updateRoadmap(trackId, { milestones: updatedMilestones });
      setEditingMilestoneId(null);
    }
  };

  return (
    <div id="roadmap-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Career Roadmaps
          </h2>
          <p className="text-xs text-[#71717a] mt-1">
            Track long-term career goals, milestone checklists, and progress targets. Everything is fully editable.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAddingRoadmap(!isAddingRoadmap)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Career Roadmap</span>
          </button>
        </div>
      </div>

      {/* Add Roadmap Form */}
      {isAddingRoadmap && (
        <form
          onSubmit={handleCreateRoadmap}
          className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-xl space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
            <h3 className="font-sans font-bold text-sm text-[#fafafa]">Create Career Roadmap</h3>
            <button
              type="button"
              onClick={() => setIsAddingRoadmap(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Roadmap Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Master Cloud Architecture & Distributed Systems"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Description & Career Objective</label>
              <textarea
                placeholder="Key goals, scope, and target competencies..."
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1f1f23]">
            <button
              type="button"
              onClick={() => setIsAddingRoadmap(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#18181b] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
            >
              Create Roadmap
            </button>
          </div>
        </form>
      )}

      {/* Edit Roadmap Modal */}
      {editingRoadmapId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveEditRoadmap}
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-6 shadow-2xl w-full max-w-lg space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
              <h3 className="font-sans font-bold text-base text-[#fafafa] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Edit Career Roadmap</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingRoadmapId(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Roadmap Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1f1f23]">
              <button
                type="button"
                onClick={() => setEditingRoadmapId(null)}
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

      {/* Roadmaps Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roadmaps.map((track) => (
          <div
            key={track.id}
            className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-zinc-700 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xs transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Route className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#fafafa]">{track.title}</h4>
                    <p className="text-[11px] text-zinc-500">
                      Created {new Date(track.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEditRoadmap(track)}
                    className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-[#18181b] rounded transition-colors cursor-pointer"
                    title="Edit roadmap"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteRoadmap(track.id)}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                    title="Delete roadmap"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {track.description && (
                <p className="text-xs text-zinc-400 leading-relaxed bg-[#09090b] p-3 rounded-lg border border-[#1f1f23]">
                  {track.description}
                </p>
              )}

              {/* Progress Indicator */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Milestone Progress</span>
                  <span className="text-blue-400 font-mono font-bold">{track.progress}%</span>
                </div>
                <div className="w-full bg-[#18181b] h-2 rounded-full overflow-hidden border border-[#27272a]">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${track.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones Checklist */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Milestones ({track.milestones.length})
                </span>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {track.milestones.map((milestone) => {
                    const isEditingM = editingMilestoneId === milestone.id;

                    if (isEditingM) {
                      return (
                        <div
                          key={milestone.id}
                          className="p-2.5 rounded-lg bg-[#09090b] border border-blue-500/50 space-y-2"
                        >
                          <input
                            type="text"
                            value={editMilestoneTitle}
                            onChange={(e) => setEditMilestoneTitle(e.target.value)}
                            className="w-full bg-transparent text-xs text-white border-b border-zinc-700 py-1 focus:outline-none"
                            autoFocus
                          />
                          <div className="flex items-center justify-between">
                            <input
                              type="date"
                              value={editMilestoneDate}
                              onChange={(e) => setEditMilestoneDate(e.target.value)}
                              className="bg-[#18181b] border border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-300 font-mono"
                            />
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleSaveEditMilestone(track.id, milestone.id)}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingMilestoneId(null)}
                                className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-[11px]"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={milestone.id}
                        className="group flex items-start justify-between gap-2.5 p-2.5 rounded-lg bg-[#09090b] border border-[#1f1f23] hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={milestone.isCompleted}
                            onChange={() => toggleMilestone(track.id, milestone.id)}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-0 mt-0.5 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium ${
                                milestone.isCompleted ? "line-through text-zinc-500" : "text-zinc-200"
                              }`}
                            >
                              {milestone.title}
                            </p>
                            {milestone.dueDate && (
                              <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3 text-zinc-500" />
                                Deadline: {milestone.dueDate}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => handleStartEditMilestone(milestone)}
                            className="p-1 text-zinc-400 hover:text-blue-400 rounded cursor-pointer"
                            title="Edit milestone"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(track.id, milestone.id)}
                            className="p-1 text-zinc-400 hover:text-red-400 rounded cursor-pointer"
                            title="Delete milestone"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {track.milestones.length === 0 && (
                    <p className="text-xs text-zinc-500 py-2 text-center">No milestones yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Add Milestone */}
            <form
              onSubmit={(e) => handleAddMilestone(e, track.id)}
              className="border-t border-[#1f1f23] pt-3 mt-2 flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                required
                placeholder="Add new milestone..."
                value={targetRoadmapId === track.id ? milestoneTitle : ""}
                onFocus={() => setTargetRoadmapId(track.id)}
                onChange={(e) => {
                  setTargetRoadmapId(track.id);
                  setMilestoneTitle(e.target.value);
                }}
                className="flex-1 bg-[#09090b] border border-[#1f1f23] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
              />
              <input
                type="date"
                value={targetRoadmapId === track.id ? milestoneDate : ""}
                onFocus={() => setTargetRoadmapId(track.id)}
                onChange={(e) => {
                  setTargetRoadmapId(track.id);
                  setMilestoneDate(e.target.value);
                }}
                className="bg-[#09090b] border border-[#1f1f23] rounded-lg px-2 py-1.5 text-xs text-zinc-400 focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="bg-[#18181b] hover:bg-[#27272a] text-zinc-200 border border-[#27272a] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
              >
                Add
              </button>
            </form>
          </div>
        ))}

        {roadmaps.length === 0 && (
          <div className="lg:col-span-2 py-24 text-center text-zinc-500 text-xs border border-dashed border-[#1f1f23] rounded-xl">
            No active roadmaps. Click "New Career Roadmap" to create your first goal track!
          </div>
        )}
      </div>
    </div>
  );
}
