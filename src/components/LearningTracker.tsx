import React, { useState } from "react";
import { useStore } from "../store";
import { BookOpen, Plus, Trash2, CheckCircle2, Bookmark, Award, Clock, ArrowUpRight, Calendar } from "lucide-react";

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

  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillHours, setNewSkillHours] = useState(10);
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  // Resources state
  const [targetSkillId, setTargetSkillId] = useState("");
  const [resTitle, setResTitle] = useState("");
  const [resType, setResType] = useState<"Book" | "Video" | "Article" | "Course" | "Practice">("Course");

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName) return;

    addSkill({
      name: newSkillName,
      progress: 0,
      hoursLearned: Number(newSkillHours) || 0,
      resources: [],
      notes: "Started track"
    });

    gainXP(100);
    setNewSkillName("");
    setNewSkillHours(10);
    setIsAddingSkill(false);
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSkillId || !resTitle) return;

    addResourceToSkill(targetSkillId, {
      title: resTitle,
      type: resType
    });

    gainXP(50);
    setResTitle("");
  };

  return (
    <div id="learning-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Learning Tracker
          </h2>
          <p className="text-xs text-[#71717a] font-mono mt-1">
            Build specialized skills, manage resource pipelines, and keep tabs on cumulative learning hours
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAddingSkill(!isAddingSkill)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Technology Skill</span>
          </button>
        </div>
      </div>

      {/* Adding Skill Form inline */}
      {isAddingSkill && (
        <form onSubmit={handleCreateSkill} className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-lg space-y-4">
          <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono">
            Create Skill Track
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Skill Name (e.g. Docker, PyTorch)</label>
              <input
                type="text"
                required
                placeholder="Kubernetes / React 19"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#71717a] font-mono block mb-1">Initial Logged Hours</label>
              <input
                type="number"
                value={newSkillHours}
                onChange={(e) => setNewSkillHours(Number(e.target.value))}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1f1f23]">
            <button
              type="button"
              onClick={() => setIsAddingSkill(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
            >
              Save Skill Track
            </button>
          </div>
        </form>
      )}

      {/* Skill list cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {learningSkills.map((skill) => (
          <div key={skill.id} className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              
              {/* Header block */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                    <BookOpen className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#fafafa]">{skill.name}</h4>
                    <span className="text-[10px] text-[#71717a] font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Logged: {skill.hoursLearned} hours
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Hours incremental logging */}
                  <button
                    onClick={() => {
                      updateSkill(skill.id, { hoursLearned: skill.hoursLearned + 2 });
                      gainXP(30); // reward 30 XP for studying!
                    }}
                    className="text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded cursor-pointer hover:bg-blue-500/20 transition-all"
                    title="Log 2 Hours"
                  >
                    +2h
                  </button>

                  <button
                    onClick={() => deleteSkill(skill.id)}
                    className="p-1 text-[#71717a] hover:text-red-400 rounded hover:bg-red-500/5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#71717a] uppercase tracking-wider font-semibold">Study Progress</span>
                  <span className="text-blue-400 font-bold">{skill.progress}%</span>
                </div>
                <div className="w-full bg-[#09090b] h-2 rounded-full overflow-hidden border border-[#1f1f23]">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>

              {/* Linked resources list */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono text-[#71717a] uppercase font-bold tracking-wider">
                  Reference Materials
                </span>

                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {skill.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-start gap-2.5 p-2 rounded-lg bg-[#09090b]/60 border border-[#1f1f23] hover:bg-[#09090b] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={resource.isCompleted}
                        onChange={() => {
                          toggleResourceCompleted(skill.id, resource.id);
                          gainXP(resource.isCompleted ? -100 : 100); // 100 XP for resource completion!
                        }}
                        className="w-4 h-4 rounded border-[#1f1f23] bg-[#09090b] text-blue-600 focus:ring-0 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${resource.isCompleted ? "line-through text-[#71717a]" : "text-slate-200"}`}>
                          {resource.title}
                        </p>
                        <span className="inline-block mt-0.5 text-[8px] font-mono bg-[#09090b] border border-[#1f1f23] px-1 rounded text-slate-400 uppercase font-bold">
                          {resource.type}
                        </span>
                      </div>
                    </div>
                  ))}

                  {skill.resources.length === 0 && (
                    <p className="text-[10px] text-[#71717a] font-mono py-4 text-center">
                      No study materials attached. Create one below!
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick add resource Form */}
            <form
              onSubmit={(e) => {
                setTargetSkillId(skill.id);
                handleAddResource(e);
              }}
              className="border-t border-[#1f1f23] pt-4 mt-2 flex gap-1.5 flex-col"
            >
              <div className="flex gap-1.5">
                <input
                  type="text"
                  required
                  placeholder="Material title (e.g. Advanced Tutorial)"
                  value={targetSkillId === skill.id ? resTitle : ""}
                  onChange={(e) => {
                    setTargetSkillId(skill.id);
                    setResTitle(e.target.value);
                  }}
                  className="flex-1 bg-[#09090b] border border-[#1f1f23] rounded-lg px-2 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                />
                <select
                  value={targetSkillId === skill.id ? resType : "Course"}
                  onChange={(e) => {
                    setTargetSkillId(skill.id);
                    setResType(e.target.value as any);
                  }}
                  className="bg-[#09090b] border border-[#1f1f23] rounded-lg px-1 text-xs text-slate-400 focus:outline-none"
                >
                  <option value="Course">Course</option>
                  <option value="Book">Book</option>
                  <option value="Video">Video</option>
                  <option value="Practice">Practice</option>
                </select>
              </div>
              <button
                type="submit"
                onClick={() => setTargetSkillId(skill.id)}
                className="w-full bg-[#18181b] hover:bg-[#27272a] hover:text-[#fafafa] text-[#71717a] border border-[#1f1f23] py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Add Material
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
