import React, { useState } from "react";
import { useStore } from "../store";
import { CareerProject } from "../types";
import {
  FolderOpen,
  Plus,
  Trash2,
  Edit2,
  Globe,
  Github,
  Check,
  X,
  CheckSquare
} from "lucide-react";

export default function ProjectManager() {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectMilestone,
    gainXP
  } = useStore();

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTechStack, setNewTechStack] = useState("React, TypeScript, Tailwind CSS");
  const [gitHubUrl, setGitHubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Edit Project Modal
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editTechStack, setEditTechStack] = useState("");
  const [editGitHubUrl, setEditGitHubUrl] = useState("");
  const [editLiveUrl, setEditLiveUrl] = useState("");
  const [editStatus, setEditStatus] = useState<"success" | "pending" | "failed" | "none">("success");

  // Milestone quick add
  const [targetProjectId, setTargetProjectId] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");

  // Milestone inline edit
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editMilestoneTitle, setEditMilestoneTitle] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const techStack = newTechStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addProject({
      name: newName.trim(),
      description: newDesc.trim(),
      techStack: techStack.length > 0 ? techStack : ["React", "TypeScript"],
      gitHubUrl: gitHubUrl.trim() || undefined,
      liveUrl: liveUrl.trim() || undefined,
      progress: 0,
      deploymentStatus: "success",
      milestones: [
        {
          id: "p_m_" + Math.random().toString(36).substr(2, 9),
          title: "System architecture & component specifications",
          isCompleted: false
        },
        {
          id: "p_m_" + Math.random().toString(36).substr(2, 9),
          title: "Core functional prototype implementation",
          isCompleted: false
        }
      ]
    });

    gainXP(200);
    setNewName("");
    setNewDesc("");
    setNewTechStack("React, TypeScript, Tailwind CSS");
    setGitHubUrl("");
    setLiveUrl("");
    setIsAddingProject(false);
  };

  const handleStartEditProject = (proj: CareerProject) => {
    setEditingProjectId(proj.id);
    setEditName(proj.name);
    setEditDesc(proj.description || "");
    setEditTechStack(proj.techStack.join(", "));
    setEditGitHubUrl(proj.gitHubUrl || "");
    setEditLiveUrl(proj.liveUrl || "");
    setEditStatus(proj.deploymentStatus || "success");
  };

  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProjectId || !editName.trim()) return;

    const techStack = editTechStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    updateProject(editingProjectId, {
      name: editName.trim(),
      description: editDesc.trim(),
      techStack,
      gitHubUrl: editGitHubUrl.trim() || undefined,
      liveUrl: editLiveUrl.trim() || undefined,
      deploymentStatus: editStatus
    });

    setEditingProjectId(null);
  };

  const handleAddMilestone = (e: React.FormEvent, projId: string) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;

    const target = projects.find((p) => p.id === projId);
    if (target) {
      const updatedMilestones = [
        ...target.milestones,
        {
          id: "p_m_" + Math.random().toString(36).substr(2, 9),
          title: milestoneTitle.trim(),
          isCompleted: false
        }
      ];
      const comp = updatedMilestones.filter((m) => m.isCompleted).length;
      const progress = Math.round((comp / updatedMilestones.length) * 100) || 0;

      updateProject(projId, {
        milestones: updatedMilestones,
        progress
      });

      gainXP(50);
      setMilestoneTitle("");
    }
  };

  const handleDeleteMilestone = (projId: string, milestoneId: string) => {
    const target = projects.find((p) => p.id === projId);
    if (target) {
      const updatedMilestones = target.milestones.filter((m) => m.id !== milestoneId);
      const comp = updatedMilestones.filter((m) => m.isCompleted).length;
      const progress = updatedMilestones.length > 0 ? Math.round((comp / updatedMilestones.length) * 100) : 0;

      updateProject(projId, {
        milestones: updatedMilestones,
        progress
      });
    }
  };

  const handleSaveEditMilestone = (projId: string, milestoneId: string) => {
    if (!editMilestoneTitle.trim()) return;
    const target = projects.find((p) => p.id === projId);
    if (target) {
      const updatedMilestones = target.milestones.map((m) =>
        m.id === milestoneId ? { ...m, title: editMilestoneTitle.trim() } : m
      );
      updateProject(projId, { milestones: updatedMilestones });
      setEditingMilestoneId(null);
    }
  };

  return (
    <div id="project-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Project Manager
          </h2>
          <p className="text-xs text-[#71717a] mt-1">
            Build and manage your portfolio projects, deliverables, milestones, and repo links. Everything is editable.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAddingProject(!isAddingProject)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Add Project Form */}
      {isAddingProject && (
        <form
          onSubmit={handleCreateProject}
          className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-xl space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
            <h3 className="font-sans font-bold text-sm text-[#fafafa]">Create Project Specification</h3>
            <button
              type="button"
              onClick={() => setIsAddingProject(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Project Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Distributed Key-Value Store"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Description & Architecture Notes</label>
              <textarea
                placeholder="High-level architecture, key features, challenges solved..."
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Tech Stack (comma separated)</label>
              <input
                type="text"
                placeholder="React, TypeScript, Go, Docker"
                value={newTechStack}
                onChange={(e) => setNewTechStack(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">GitHub Repo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={gitHubUrl}
                  onChange={(e) => setGitHubUrl(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Live Demo URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://myproject.app"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1f1f23]">
            <button
              type="button"
              onClick={() => setIsAddingProject(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#18181b] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* Edit Project Modal */}
      {editingProjectId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveEditProject}
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-6 shadow-2xl w-full max-w-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
              <h3 className="font-sans font-bold text-base text-[#fafafa] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Edit Project</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingProjectId(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
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

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={editTechStack}
                  onChange={(e) => setEditTechStack(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Deployment Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-zinc-200"
                  >
                    <option value="success">Online / Production</option>
                    <option value="pending">In Progress</option>
                    <option value="none">Local Only</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={editGitHubUrl}
                    onChange={(e) => setEditGitHubUrl(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Live URL</label>
                  <input
                    type="url"
                    value={editLiveUrl}
                    onChange={(e) => setEditLiveUrl(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1f1f23]">
              <button
                type="button"
                onClick={() => setEditingProjectId(null)}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-zinc-700 rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-xs transition-all"
          >
            <div className="space-y-3.5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#fafafa]">{proj.name}</h4>
                    <span className="text-[10px] text-zinc-400 uppercase bg-[#09090b] px-2 py-0.5 rounded border border-[#1f1f23] font-mono">
                      Status:{" "}
                      <strong
                        className={
                          proj.deploymentStatus === "success"
                            ? "text-emerald-400"
                            : proj.deploymentStatus === "pending"
                            ? "text-amber-400"
                            : "text-zinc-400"
                        }
                      >
                        {proj.deploymentStatus || "Active"}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleStartEditProject(proj)}
                    className="p-1.5 text-zinc-400 hover:text-blue-400 hover:bg-[#18181b] rounded transition-colors cursor-pointer"
                    title="Edit project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              {proj.description && (
                <p className="text-xs text-zinc-300 leading-relaxed bg-[#09090b] p-3 rounded-lg border border-[#1f1f23]">
                  {proj.description}
                </p>
              )}

              {/* Tech stack badge list */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono text-zinc-300 bg-zinc-800/80 border border-zinc-700 px-2 py-0.5 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Code links */}
              <div className="flex gap-4 text-xs font-mono py-1">
                {proj.gitHubUrl && (
                  <a
                    href={proj.gitHubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Code</span>
                  </a>
                )}
                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Live Preview</span>
                  </a>
                )}
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Project Completion</span>
                  <span className="text-blue-400 font-mono font-bold">{proj.progress}%</span>
                </div>
                <div className="w-full bg-[#18181b] h-2 rounded-full overflow-hidden border border-[#27272a]">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              {/* Project Deliverables / Milestones */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Deliverables & Milestones ({proj.milestones.length})
                </span>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {proj.milestones.map((milestone) => {
                    const isEditingM = editingMilestoneId === milestone.id;

                    if (isEditingM) {
                      return (
                        <div
                          key={milestone.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-[#09090b] border border-blue-500/50"
                        >
                          <input
                            type="text"
                            value={editMilestoneTitle}
                            onChange={(e) => setEditMilestoneTitle(e.target.value)}
                            className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEditMilestone(proj.id, milestone.id)}
                            className="p-1 text-emerald-400 rounded cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingMilestoneId(null)}
                            className="p-1 text-zinc-400 rounded cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={milestone.id}
                        className="group flex items-center justify-between gap-2 p-2 rounded-lg bg-[#09090b] border border-[#1f1f23] hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={milestone.isCompleted}
                            onChange={() => toggleProjectMilestone(proj.id, milestone.id)}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-0 cursor-pointer"
                          />
                          <span
                            className={`text-xs font-medium truncate ${
                              milestone.isCompleted ? "line-through text-zinc-500" : "text-zinc-200"
                            }`}
                          >
                            {milestone.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => {
                              setEditingMilestoneId(milestone.id);
                              setEditMilestoneTitle(milestone.title);
                            }}
                            className="p-1 text-zinc-400 hover:text-blue-400 rounded cursor-pointer"
                            title="Edit milestone"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteMilestone(proj.id, milestone.id)}
                            className="p-1 text-zinc-400 hover:text-red-400 rounded cursor-pointer"
                            title="Delete milestone"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {proj.milestones.length === 0 && (
                    <p className="text-xs text-zinc-500 py-2 text-center">No milestones added yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Add Milestone */}
            <form
              onSubmit={(e) => handleAddMilestone(e, proj.id)}
              className="border-t border-[#1f1f23] pt-3 mt-2 flex gap-2"
            >
              <input
                type="text"
                required
                placeholder="Add milestone..."
                value={targetProjectId === proj.id ? milestoneTitle : ""}
                onFocus={() => setTargetProjectId(proj.id)}
                onChange={(e) => {
                  setTargetProjectId(proj.id);
                  setMilestoneTitle(e.target.value);
                }}
                className="flex-1 bg-[#09090b] border border-[#1f1f23] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none"
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

        {projects.length === 0 && (
          <div className="lg:col-span-2 py-24 text-center text-zinc-500 text-xs border border-dashed border-[#1f1f23] rounded-xl">
            No active portfolio projects. Click "New Project" to showcase your work!
          </div>
        )}
      </div>
    </div>
  );
}
