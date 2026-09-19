import React, { useState } from "react";
import { useStore } from "../store";
import { LearningSkill, LearningResource } from "../types";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Check,
  X,
  ExternalLink,
  Link2
} from "lucide-react";

export default function LearningTracker() {
  const {
    learningSkills,
    addSkill,
    updateSkill,
    deleteSkill,
    addResourceToSkill,
    toggleResourceCompleted,
    gainXP
  } = useStore();

  // New skill form
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillHours, setNewSkillHours] = useState(10);
  const [newSkillNotes, setNewSkillNotes] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Edit skill modal
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editHours, setEditHours] = useState(0);
  const [editProgress, setEditProgress] = useState(0);
  const [editNotes, setEditNotes] = useState("");

  // Resource add state
  const [targetSkillId, setTargetSkillId] = useState("");
  const [resTitle, setResTitle] = useState("");
  const [resType, setResType] = useState<"Book" | "Video" | "Article" | "Course" | "Practice">("Course");
  const [resUrl, setResUrl] = useState("");

  // Resource edit state
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [editResTitle, setEditResTitle] = useState("");
  const [editResType, setEditResType] = useState<"Book" | "Video" | "Article" | "Course" | "Practice">("Course");
  const [editResUrl, setEditResUrl] = useState("");

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    addSkill({
      name: newSkillName.trim(),
      progress: 0,
      hoursLearned: Number(newSkillHours) || 0,
      resources: [],
      notes: newSkillNotes.trim() || "Active learning track"
    });

    gainXP(100);
    setNewSkillName("");
    setNewSkillHours(10);
    setNewSkillNotes("");
    setIsAddingSkill(false);
  };

  const handleStartEditSkill = (skill: LearningSkill) => {
    setEditingSkillId(skill.id);
    setEditName(skill.name);
    setEditHours(skill.hoursLearned);
    setEditProgress(skill.progress);
    setEditNotes(skill.notes || "");
  };

  const handleSaveEditSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkillId || !editName.trim()) return;

    updateSkill(editingSkillId, {
      name: editName.trim(),
      hoursLearned: Math.max(0, Number(editHours) || 0),
      progress: Math.min(100, Math.max(0, Number(editProgress) || 0)),
      notes: editNotes.trim()
    });

    setEditingSkillId(null);
  };

  const handleAddResource = (e: React.FormEvent, skillId: string) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    addResourceToSkill(skillId, {
      title: resTitle.trim(),
      type: resType,
      url: resUrl.trim() || undefined
    });

    gainXP(50);
    setResTitle("");
    setResUrl("");
  };

  const handleDeleteResource = (skillId: string, resourceId: string) => {
    const target = learningSkills.find((s) => s.id === skillId);
    if (target) {
      const updated = target.resources.filter((r) => r.id !== resourceId);
      updateSkill(skillId, { resources: updated });
    }
  };

  const handleStartEditResource = (res: LearningResource) => {
    setEditingResourceId(res.id);
    setEditResTitle(res.title);
    setEditResType(res.type);
    setEditResUrl(res.url || "");
  };

  const handleSaveEditResource = (skillId: string, resourceId: string) => {
    if (!editResTitle.trim()) return;
    const target = learningSkills.find((s) => s.id === skillId);
    if (target) {
      const updated = target.resources.map((r) =>
        r.id === resourceId
          ? {
              ...r,
              title: editResTitle.trim(),
              type: editResType,
              url: editResUrl.trim() || undefined
            }
          : r
      );
      updateSkill(skillId, { resources: updated });
      setEditingResourceId(null);
    }
  };

  return (
    <div id="learning-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Learning & Tech Tracker
          </h2>
          <p className="text-xs text-[#71717a] mt-1">
            Build specialized technical skills, track study hours, and manage reference materials. Everything is editable.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAddingSkill(!isAddingSkill)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill Track</span>
          </button>
        </div>
      </div>

      {/* Add Skill Form */}
      {isAddingSkill && (
        <form
          onSubmit={handleCreateSkill}
          className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-xl space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
            <h3 className="font-sans font-bold text-sm text-[#fafafa]">Create Learning Track</h3>
            <button
              type="button"
              onClick={() => setIsAddingSkill(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Skill Name (e.g. Docker, TypeScript, System Design)</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Systems"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Initial Hours Logged</label>
              <input
                type="number"
                min={0}
                placeholder="10"
                value={newSkillHours}
                onChange={(e) => setNewSkillHours(Number(e.target.value))}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Notes / Scope (Optional)</label>
              <textarea
                rows={2}
                placeholder="Learning goals, prerequisites, or topics covered..."
                value={newSkillNotes}
                onChange={(e) => setNewSkillNotes(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-sans"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1f1f23]">
            <button
              type="button"
              onClick={() => setIsAddingSkill(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#18181b] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
            >
              Save Skill Track
            </button>
          </div>
        </form>
      )}

      {/* Edit Skill Modal */}
      {editingSkillId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveEditSkill}
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-6 shadow-2xl w-full max-w-md space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
              <h3 className="font-sans font-bold text-base text-[#fafafa] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Edit Skill Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingSkillId(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Hours Studied</label>
                  <input
                    type="number"
                    min={0}
                    value={editHours}
                    onChange={(e) => setEditHours(Number(e.target.value))}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Progress % (0-100)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editProgress}
                    onChange={(e) => setEditProgress(Number(e.target.value))}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1f1f23]">
              <button
                type="button"
                onClick={() => setEditingSkillId(null)}
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

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-zinc-700 rounded-xl p-5 space-y-4 shadow-xs flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              {/* Header block */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#fafafa]">{skill.name}</h4>
                    <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {skill.hoursLearned} hrs logged
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      updateSkill(skill.id, { hoursLearned: skill.hoursLearned + 1 });
                      gainXP(20);
                    }}
                    className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded cursor-pointer hover:bg-blue-500/20 transition-colors"
                    title="Log 1 study hour"
                  >
                    +1h
                  </button>
                  <button
                    onClick={() => handleStartEditSkill(skill)}
                    className="p-1 text-zinc-400 hover:text-blue-400 hover:bg-[#18181b] rounded transition-colors cursor-pointer"
                    title="Edit skill details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-1 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                    title="Delete skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {skill.notes && (
                <p className="text-xs text-zinc-400 bg-[#09090b] p-2.5 rounded-lg border border-[#1f1f23]">
                  {skill.notes}
                </p>
              )}

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Mastery Progress</span>
                  <span className="text-blue-400 font-mono font-bold">{skill.progress}%</span>
                </div>
                <div className="w-full bg-[#18181b] h-2 rounded-full overflow-hidden border border-[#27272a]">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>

              {/* Linked resources list */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Reference Materials ({skill.resources.length})
                </span>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {skill.resources.map((resource) => {
                    const isEditingR = editingResourceId === resource.id;

                    if (isEditingR) {
                      return (
                        <div
                          key={resource.id}
                          className="p-2.5 rounded-lg bg-[#09090b] border border-blue-500/50 space-y-2"
                        >
                          <input
                            type="text"
                            value={editResTitle}
                            onChange={(e) => setEditResTitle(e.target.value)}
                            className="w-full bg-transparent text-xs text-white border-b border-zinc-700 py-1 focus:outline-none"
                            autoFocus
                          />
                          <div className="flex items-center justify-between gap-2">
                            <select
                              value={editResType}
                              onChange={(e) => setEditResType(e.target.value as any)}
                              className="bg-[#18181b] border border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-300"
                            >
                              <option value="Course">Course</option>
                              <option value="Book">Book</option>
                              <option value="Video">Video</option>
                              <option value="Article">Article</option>
                              <option value="Practice">Practice</option>
                            </select>
                            <input
                              type="url"
                              placeholder="URL (optional)"
                              value={editResUrl}
                              onChange={(e) => setEditResUrl(e.target.value)}
                              className="bg-[#18181b] border border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-300 flex-1"
                            />
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleSaveEditResource(skill.id, resource.id)}
                                className="px-2 py-1 bg-blue-600 text-white rounded text-[11px] font-semibold"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingResourceId(null)}
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
                        key={resource.id}
                        className="group flex items-center justify-between gap-2 p-2 rounded-lg bg-[#09090b] border border-[#1f1f23] hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={resource.isCompleted}
                            onChange={() => {
                              toggleResourceCompleted(skill.id, resource.id);
                              gainXP(resource.isCompleted ? -50 : 50);
                            }}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-medium truncate ${
                                resource.isCompleted ? "line-through text-zinc-500" : "text-zinc-200"
                              }`}
                            >
                              {resource.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[9px] bg-zinc-800 border border-zinc-700 px-1.5 py-0.2 rounded text-zinc-400 font-mono">
                                {resource.type}
                              </span>
                              {resource.url && (
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  Link
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => handleStartEditResource(resource)}
                            className="p-1 text-zinc-400 hover:text-blue-400 rounded cursor-pointer"
                            title="Edit resource"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteResource(skill.id, resource.id)}
                            className="p-1 text-zinc-400 hover:text-red-400 rounded cursor-pointer"
                            title="Delete resource"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {skill.resources.length === 0 && (
                    <p className="text-xs text-zinc-500 py-2 text-center">
                      No study resources added yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Add Resource */}
            <form
              onSubmit={(e) => handleAddResource(e, skill.id)}
              className="border-t border-[#1f1f23] pt-3 mt-2 flex flex-col gap-2"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Add resource title..."
                  value={targetSkillId === skill.id ? resTitle : ""}
                  onFocus={() => setTargetSkillId(skill.id)}
                  onChange={(e) => {
                    setTargetSkillId(skill.id);
                    setResTitle(e.target.value);
                  }}
                  className="flex-1 bg-[#09090b] border border-[#1f1f23] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
                />
                <select
                  value={targetSkillId === skill.id ? resType : "Course"}
                  onFocus={() => setTargetSkillId(skill.id)}
                  onChange={(e) => {
                    setTargetSkillId(skill.id);
                    setResType(e.target.value as any);
                  }}
                  className="bg-[#09090b] border border-[#1f1f23] rounded-lg px-2 py-1.5 text-xs text-zinc-300 focus:outline-none"
                >
                  <option value="Course">Course</option>
                  <option value="Book">Book</option>
                  <option value="Video">Video</option>
                  <option value="Article">Article</option>
                  <option value="Practice">Practice</option>
                </select>
                <button
                  type="submit"
                  className="bg-[#18181b] hover:bg-[#27272a] text-zinc-200 border border-[#27272a] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        ))}

        {learningSkills.length === 0 && (
          <div className="lg:col-span-3 py-24 text-center text-zinc-500 text-xs border border-dashed border-[#1f1f23] rounded-xl">
            No active skill tracks. Click "Add Skill Track" to begin logging your learning progress!
          </div>
        )}
      </div>
    </div>
  );
}
