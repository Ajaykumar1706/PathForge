import React, { useState } from "react";
import { useStore } from "../store";
import { ResumeVersion } from "../types";
import {
  FileText,
  Plus,
  Trash2,
  Star,
  Edit2,
  Check,
  Copy,
  Briefcase,
  X
} from "lucide-react";

export default function ResumeManager() {
  const { resumeVersions, addResumeVersion, updateResumeVersion, deleteResumeVersion, gainXP } = useStore();

  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(
    resumeVersions[0]?.id || null
  );

  // New version modal/form state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTargetRole, setNewTargetRole] = useState("");
  const [newSkillsStr, setNewSkillsStr] = useState("");
  const [newNotes, setNewNotes] = useState("");

  // Edit version modal/state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editTargetRole, setEditTargetRole] = useState("");
  const [editSkillsStr, setEditSkillsStr] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedResume = resumeVersions.find((r) => r.id === selectedResumeId) || resumeVersions[0];

  const handleCreateResume = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const skills = newSkillsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    addResumeVersion(newTitle.trim(), newNotes.trim());
    
    // If targetRole or skills specified, update the latest
    gainXP(100);

    setNewTitle("");
    setNewTargetRole("");
    setNewSkillsStr("");
    setNewNotes("");
    setIsAdding(false);
  };

  const handleStartEdit = () => {
    if (!selectedResume) return;
    setEditTitle(selectedResume.title);
    setEditTargetRole(selectedResume.targetRole || "");
    setEditSkillsStr(selectedResume.skills?.join(", ") || "");
    setEditNotes(selectedResume.notes || "");
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResume || !editTitle.trim()) return;

    const skills = editSkillsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    updateResumeVersion(selectedResume.id, {
      title: editTitle.trim(),
      targetRole: editTargetRole.trim(),
      skills,
      notes: editNotes.trim(),
      lastUpdated: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    });

    setIsEditing(false);
  };

  const handleCopyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleToggleFavorite = (id: string, current: boolean) => {
    updateResumeVersion(id, { isFavorite: !current });
  };

  return (
    <div id="resume-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Resume Manager
          </h2>
          <p className="text-xs text-[#71717a] mt-1">
            Maintain tailored resume versions, target role notes, and skill highlights. Everything is fully editable.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resume Version</span>
          </button>
        </div>
      </div>

      {/* Add New Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateResume}
          className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-xl space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
            <h3 className="font-sans font-bold text-sm text-[#fafafa]">Create New Resume Record</h3>
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
              <label className="text-xs text-zinc-400 block mb-1">Resume Version Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer - React & TypeScript"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Target Role (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Staff Full Stack Engineer"
                value={newTargetRole}
                onChange={(e) => setNewTargetRole(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Key Skills (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, TypeScript, Next.js, PostgreSQL"
                value={newSkillsStr}
                onChange={(e) => setNewSkillsStr(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Resume Content / Highlights / Notes</label>
              <textarea
                placeholder="Paste key bullet points, career summary, achievements, or tailoring notes..."
                rows={5}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-sans"
              />
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
              Create Resume
            </button>
          </div>
        </form>
      )}

      {/* Edit Form Modal */}
      {isEditing && selectedResume && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveEdit}
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-6 shadow-2xl w-full max-w-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
              <h3 className="font-sans font-bold text-base text-[#fafafa] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Edit Resume Record</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Resume Version Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Target Role</label>
                <input
                  type="text"
                  value={editTargetRole}
                  onChange={(e) => setEditTargetRole(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Key Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={editSkillsStr}
                  onChange={(e) => setEditSkillsStr(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Resume Content / Highlights / Notes</label>
                <textarea
                  rows={6}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1f1f23]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: versions list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Saved Versions ({resumeVersions.length})
            </span>
          </div>

          <div className="space-y-2">
            {resumeVersions.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedResumeId(item.id)}
                className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all group cursor-pointer ${
                  (selectedResume?.id === item.id)
                    ? "bg-[#0c0c0e] border-blue-500/50 shadow-sm"
                    : "bg-[#0c0c0e]/50 hover:bg-[#0c0c0e] border-[#1f1f23] hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#fafafa] truncate">{item.title}</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Updated {item.lastUpdated}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item.id, !!item.isFavorite);
                    }}
                    className={`p-1 rounded transition-colors cursor-pointer ${
                      item.isFavorite ? "text-amber-400" : "text-zinc-600 hover:text-zinc-400"
                    }`}
                    title={item.isFavorite ? "Favorited" : "Favorite"}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteResumeVersion(item.id);
                      if (selectedResumeId === item.id) setSelectedResumeId(null);
                    }}
                    className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                    title="Delete version"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {resumeVersions.length === 0 && (
              <div className="py-12 text-center text-zinc-500 text-xs border border-dashed border-[#1f1f23] rounded-xl">
                No resume versions yet. Click "+ Add Resume Version" above to start.
              </div>
            )}
          </div>
        </div>

        {/* Right column: Selected Resume details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedResume ? (
            <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#1f1f23] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-sans font-bold text-lg text-[#fafafa]">
                      {selectedResume.title}
                    </h3>
                    {selectedResume.isFavorite && (
                      <span className="text-xs text-amber-400 flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500">Last updated on {selectedResume.lastUpdated}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartEdit}
                    className="flex items-center gap-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 border border-[#27272a] px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Version</span>
                  </button>
                  {selectedResume.notes && (
                    <button
                      onClick={() => handleCopyContent(selectedResume.notes || "", selectedResume.id)}
                      className="flex items-center gap-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 border border-[#27272a] px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      title="Copy content to clipboard"
                    >
                      {copiedId === selectedResume.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Target Role & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-[#09090b] rounded-lg border border-[#1f1f23]">
                  <span className="text-[11px] text-zinc-500 font-semibold block mb-1">
                    Target Role
                  </span>
                  <p className="text-xs text-zinc-200 font-medium flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                    {selectedResume.targetRole || "Not specified (click Edit to set)"}
                  </p>
                </div>

                <div className="p-3 bg-[#09090b] rounded-lg border border-[#1f1f23]">
                  <span className="text-[11px] text-zinc-500 font-semibold block mb-1">
                    Key Highlighted Skills
                  </span>
                  {selectedResume.skills && selectedResume.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedResume.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">None listed (click Edit to add)</p>
                  )}
                </div>
              </div>

              {/* Resume Text / Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Resume Content & Notes
                  </span>
                </div>
                <div className="bg-[#09090b] p-4 rounded-xl border border-[#1f1f23] text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed min-h-[140px]">
                  {selectedResume.notes || (
                    <span className="text-zinc-600 italic">
                      No notes or resume content entered yet. Click "Edit Version" to add your resume details.
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-zinc-500 text-xs border border-dashed border-[#1f1f23] rounded-xl bg-[#0c0c0e]/30">
              Select or create a resume version to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
