import React, { useState } from "react";
import { useStore } from "../store";
import { FolderGit2, Plus, Trash2, CheckCircle2, Globe, Github, Sparkles, FolderOpen, RefreshCw } from "lucide-react";

export default function ProjectManager() {
  const {
    projects,
    addProject,
    deleteProject,
    toggleProjectMilestone,
    gainXP
  } = useStore();

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [gitHubUrl, setGitHubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Milestone quick add
  const [targetProjectId, setTargetProjectId] = useState("");
  const [milestoneTitle, setMilestoneTitle] = useState("");

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    addProject({
      name: newName,
      description: newDesc,
      techStack: ["React 19", "Vite", "Tailwind CSS"],
      gitHubUrl: gitHubUrl || undefined,
      liveUrl: liveUrl || undefined,
      progress: 0,
      deploymentStatus: "success",
      milestones: [
        { id: "p_m_" + Math.random().toString(36).substr(2, 9), title: "Define software design document", isCompleted: true },
        { id: "p_m_" + Math.random().toString(36).substr(2, 9), title: "Establish local database structures", isCompleted: false }
      ]
    });

    gainXP(200); // 200 XP for launching a brand new project target!
    setNewName("");
    setNewDesc("");
    setGitHubUrl("");
    setLiveUrl("");
    setIsAddingProject(false);
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProjectId || !milestoneTitle) return;

    const target = projects.find((p) => p.id === targetProjectId);
    if (target) {
      const updatedMilestones = [
        ...target.milestones,
        {
          id: "p_m_" + Math.random().toString(36).substr(2, 9),
          title: milestoneTitle,
          isCompleted: false
        }
      ];
      const comp = updatedMilestones.filter((m) => m.isCompleted).length;
      const progress = Math.round((comp / updatedMilestones.length) * 100) || 0;

      useStore.getState().updateProject(targetProjectId, {
        milestones: updatedMilestones,
        progress
      });

      gainXP(50);
      setMilestoneTitle("");
    }
  };

  return (
    <div id="project-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Portfolio Project Builder
          </h2>
          <p className="text-xs text-[#71717a] font-mono mt-1">
            Build production-ready, showcaseable software. Link repos & keep deployment trackers checked
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAddingProject(!isAddingProject)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Showcase New Project</span>
          </button>
        </div>
      </div>

      {/* Adding Form inline */}
      {isAddingProject && (
        <form onSubmit={handleCreateProject} className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-lg space-y-4">
          <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono">
            New Project Specs
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Project Name</label>
              <input
                type="text"
                required
                placeholder="PathForge Portal"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Description / Goals</label>
              <textarea
                placeholder="Describe your design architecture, tech choices, and accomplishments..."
                rows={2}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={gitHubUrl}
                  onChange={(e) => setGitHubUrl(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Live URL</label>
                <input
                  type="url"
                  placeholder="https://preview.vercel.app"
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
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
            >
              Save Project Specs
            </button>
          </div>
        </form>
      )}

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-3.5">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#fafafa]">{proj.name}</h4>
                    <span className="text-[10px] text-[#71717a] font-mono uppercase bg-[#09090b] px-2 py-0.5 rounded border border-[#1f1f23]">
                      Deployment: <strong className="text-blue-400">Online</strong>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => deleteProject(proj.id)}
                  className="p-1.5 text-[#71717a] hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-[#a1a1aa] leading-relaxed bg-[#09090b]/40 p-3 rounded-lg border border-[#1f1f23]">
                {proj.description}
              </p>

              {/* Tech stack badge list */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.techStack.map((tech, i) => (
                  <span key={i} className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded">
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
                    className="flex items-center gap-1.5 text-[#71717a] hover:text-[#fafafa] transition-colors"
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
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#71717a] uppercase tracking-wider font-semibold">Dev Progress</span>
                  <span className="text-blue-400 font-bold">{proj.progress}%</span>
                </div>
                <div className="w-full bg-[#09090b] h-2.5 rounded-full overflow-hidden border border-[#1f1f23]">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono text-[#71717a] uppercase font-bold tracking-wider">
                  Development Milestones
                </span>

                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {proj.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-[#09090b]/60 border border-[#1f1f23] hover:bg-[#09090b] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={milestone.isCompleted}
                        onChange={() => {
                          toggleProjectMilestone(proj.id, milestone.id);
                          gainXP(milestone.isCompleted ? -100 : 100);
                        }}
                        className="w-4 h-4 rounded border-[#1f1f23] bg-[#09090b] text-blue-600 focus:ring-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${milestone.isCompleted ? "line-through text-[#71717a]" : "text-slate-200"}`}>
                          {milestone.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form: Add Project Milestone */}
            <form
              onSubmit={(e) => {
                setTargetProjectId(proj.id);
                handleAddMilestone(e);
              }}
              className="border-t border-[#1f1f23] pt-4 mt-2 flex gap-1.5"
            >
              <input
                type="text"
                required
                placeholder="Define next feature deliverable"
                value={targetProjectId === proj.id ? milestoneTitle : ""}
                onChange={(e) => {
                  setTargetProjectId(proj.id);
                  setMilestoneTitle(e.target.value);
                }}
                className="flex-1 bg-[#09090b] border border-[#1f1f23] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                onClick={() => setTargetProjectId(proj.id)}
                className="bg-[#18181b] hover:bg-[#27272a] hover:text-[#fafafa] text-[#71717a] border border-[#1f1f23] px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                Add
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
