import React, { useState } from "react";
import { useStore } from "../store";
import { Task, TaskStatus, TaskPriority, TaskDifficulty } from "../types";
import {
  List,
  Grid,
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  Trash2,
  Copy,
  Archive,
  Edit3,
  Calendar,
  AlertTriangle,
  Zap,
  ArrowRight,
  Bookmark
} from "lucide-react";

export default function TaskManager() {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    gainXP
  } = useStore();

  const [viewMode, setViewMode] = useState<"list" | "kanban">("kanban");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");

  // Create Task Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [difficulty, setDifficulty] = useState<TaskDifficulty>(TaskDifficulty.MEDIUM);
  const [category, setCategory] = useState("SQL");
  const [estimatedTime, setEstimatedTime] = useState(60);
  const [actualTime, setActualTime] = useState(0);
  const [dueDate, setDueDate] = useState("2026-07-12");
  const [tagsInput, setTagsInput] = useState("");
  const [notes, setNotes] = useState("");

  const handleCreateOrUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const tags = tagsInput.split(",").map((t) => t.trim()).filter((t) => t.length > 0);

    const taskData = {
      title,
      description,
      priority,
      difficulty,
      category,
      estimatedTime: Number(estimatedTime) || 0,
      actualTime: Number(actualTime) || 0,
      dueDate,
      tags,
      notes,
      status: TaskStatus.NOT_STARTED,
    };

    if (editingTaskId) {
      updateTask(editingTaskId, taskData);
      setEditingTaskId(null);
    } else {
      addTask(taskData);
      gainXP(50); // reward 50 XP for planning a task!
    }

    // Reset Form
    setIsAdding(false);
    setTitle("");
    setDescription("");
    setPriority(TaskPriority.MEDIUM);
    setDifficulty(TaskDifficulty.MEDIUM);
    setCategory("Learning");
    setEstimatedTime(60);
    setActualTime(0);
    setDueDate("2026-07-12");
    setTagsInput("");
    setNotes("");
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDifficulty(task.difficulty);
    setCategory(task.category);
    setEstimatedTime(task.estimatedTime);
    setActualTime(task.actualTime);
    setDueDate(task.dueDate);
    setTagsInput(task.tags.join(", "));
    setNotes(task.notes || "");
    setIsAdding(true);
  };

  const handleDuplicateTask = (task: Task) => {
    addTask({
      title: `${task.title} (Copy)`,
      description: task.description,
      priority: task.priority,
      difficulty: task.difficulty,
      category: task.category,
      estimatedTime: task.estimatedTime,
      actualTime: 0,
      dueDate: task.dueDate,
      tags: task.tags,
      notes: task.notes,
      status: TaskStatus.NOT_STARTED
    });
    gainXP(25);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || task.category === selectedCategory;
    const matchesPriority = selectedPriority === "All" || task.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const categories = ["All", ...Array.from(new Set(tasks.map((t) => t.category)))];

  // Helper colors for priorites
  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case TaskPriority.CRITICAL:
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case TaskPriority.HIGH:
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      case TaskPriority.MEDIUM:
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-[#71717a] bg-[#18181b] border-[#27272a]";
    }
  };

  return (
    <div id="tasks-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header and top control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa]">Task Manager</h2>
          <p className="text-xs text-[#71717a] font-mono mt-1">
            Build your skills by completing challenges. Reward: +150 XP on completion!
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Toggle view buttons */}
          <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-0.5 flex">
            <button
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                viewMode === "kanban" ? "bg-[#18181b] text-blue-400" : "text-[#71717a] hover:text-[#fafafa]"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                viewMode === "list" ? "bg-[#18181b] text-blue-400" : "text-[#71717a] hover:text-[#fafafa]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setEditingTaskId(null);
              setIsAdding(!isAdding);
            }}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? "Close Form" : "Create Task"}</span>
          </button>
        </div>
      </div>

      {/* Adding / Editing Modal form overlay inline */}
      {isAdding && (
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-2xl">
          <h3 className="font-sans font-bold text-sm text-[#fafafa] mb-4 uppercase tracking-wider font-mono">
            {editingTaskId ? "Edit Workspace Task" : "Create New Task Pathway"}
          </h3>
          <form onSubmit={handleCreateOrUpdateTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Optimize Postgres index"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Description</label>
                <textarea
                  placeholder="What is the objective or deliverable?"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#71717a] font-mono block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none"
                  >
                    <option value={TaskPriority.LOW}>Low</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.HIGH}>High</option>
                    <option value={TaskPriority.CRITICAL}>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-[#71717a] font-mono block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as TaskDifficulty)}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none"
                  >
                    <option value={TaskDifficulty.EASY}>Easy</option>
                    <option value={TaskDifficulty.MEDIUM}>Medium</option>
                    <option value={TaskDifficulty.HARD}>Hard</option>
                    <option value={TaskDifficulty.EXPERT}>Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. SQL, Azure, LeetCode"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#71717a] font-mono block mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    placeholder="60"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(Number(e.target.value))}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#71717a] font-mono block mb-1">Actual Minutes</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={actualTime}
                    onChange={(e) => setActualTime(Number(e.target.value))}
                    className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="Database, SQL, Admin"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Developer Notes</label>
                <textarea
                  placeholder="Any hints or solution references..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2 border-t border-[#1f1f23] pt-3.5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-lg text-xs cursor-pointer"
              >
                {editingTaskId ? "Apply Changes" : "Save Pathway Task"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Searching and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-[#71717a]" />
          <input
            type="text"
            placeholder="Search through title, descriptions, and tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl pl-10 pr-4 py-2 w-full text-xs text-[#fafafa] focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl px-3 py-2 text-xs text-[#fafafa] focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.filter((c) => c !== "All").map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl px-3 py-2 text-xs text-[#fafafa] focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Task views rendering */}
      {viewMode === "list" ? (
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-sans">
              <thead>
                <tr className="border-b border-[#1f1f23] bg-[#0c0c0e]/40 text-[10px] text-[#71717a] uppercase font-mono">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Title & Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4 text-center">Due Date</th>
                  <th className="py-3 px-4 text-center">Time</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f23] text-xs">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-zinc-900/30 transition-colors group">
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="text-zinc-500 hover:text-blue-500 transition-colors cursor-pointer"
                      >
                        <CheckCircle2
                          className={`w-5 h-5 ${
                            task.status === TaskStatus.COMPLETED ? "text-blue-500" : "text-zinc-700"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-[#fafafa] text-xs truncate">{task.title}</div>
                      <div className="text-[11px] text-[#71717a] line-clamp-1 mt-0.5">{task.description}</div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-indigo-400 font-medium">
                      {task.category}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={task.priority}
                        onChange={(e) => updateTask(task.id, { priority: e.target.value as TaskPriority })}
                        className={`inline-block px-1.5 py-0.5 rounded border text-[10px] font-mono font-medium ${getPriorityColor(task.priority)} bg-[#0c0c0e] hover:border-zinc-500 cursor-pointer focus:outline-none`}
                      >
                        <option value={TaskPriority.LOW}>Low</option>
                        <option value={TaskPriority.MEDIUM}>Medium</option>
                        <option value={TaskPriority.HIGH}>High</option>
                        <option value={TaskPriority.CRITICAL}>Critical</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#a1a1aa]">{task.difficulty}</td>
                    <td className="py-3.5 px-4 text-center text-[11px] font-mono text-[#71717a]">
                      {task.dueDate}
                    </td>
                    <td className="py-3.5 px-4 text-center text-[11px] font-mono text-[#a1a1aa]">
                      {task.actualTime} / {task.estimatedTime}m
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(task)}
                          className="p-1 text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
                          title="Edit Task"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateTask(task)}
                          className="p-1 text-[#71717a] hover:text-[#fafafa] transition-colors cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-[#71717a] hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban Board rendering */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columns */}
          {["Not Started", "In Progress", "Completed"].map((colStatus) => {
            const columnTasks = filteredTasks.filter((t) => {
              if (colStatus === "Not Started") {
                return t.status === TaskStatus.NOT_STARTED || t.status === TaskStatus.BLOCKED;
              }
              if (colStatus === "In Progress") return t.status === TaskStatus.IN_PROGRESS;
              return t.status === TaskStatus.COMPLETED;
            });

            return (
              <div key={colStatus} className="bg-[#0c0c0e]/50 border border-[#1f1f23] rounded-xl p-4 flex flex-col min-h-[450px]">
                {/* Column header */}
                <div className="flex items-center justify-between border-b border-[#1f1f23] pb-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      colStatus === "Not Started" ? "bg-zinc-500" : colStatus === "In Progress" ? "bg-blue-500 animate-pulse" : "bg-indigo-500"
                    }`} />
                    <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#fafafa]">
                      {colStatus}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-[#71717a] bg-[#09090b] px-2 py-0.5 rounded-full border border-[#1f1f23]">
                    {columnTasks.length} Tasks
                  </span>
                </div>

                {/* Column tasks items */}
                <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[500px] scrollbar-thin">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-[#09090b] hover:bg-[#0c0c0e] p-4 rounded-xl border border-[#1f1f23] hover:border-zinc-700 transition-all group shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/10">
                            {task.category}
                          </span>
                          <span className="text-[9px] font-mono text-[#71717a] flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" />
                            {task.dueDate}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[#fafafa] transition-colors">
                          {task.title}
                        </h4>
                        <p className="text-[11px] text-[#71717a] line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </div>

                      {/* Footer item details */}
                      <div className="border-t border-[#1f1f23] mt-3 pt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <select
                            value={task.priority}
                            onChange={(e) => updateTask(task.id, { priority: e.target.value as TaskPriority })}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono ${getPriorityColor(task.priority)} bg-[#09090b] hover:border-zinc-500 cursor-pointer focus:outline-none`}
                          >
                            <option value={TaskPriority.LOW}>Low</option>
                            <option value={TaskPriority.MEDIUM}>Medium</option>
                            <option value={TaskPriority.HIGH}>High</option>
                            <option value={TaskPriority.CRITICAL}>Critical</option>
                          </select>
                          <span className="text-[10px] text-[#71717a] font-mono">
                            {task.actualTime || 0}/{task.estimatedTime}m
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* Toggle task completion */}
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className="p-1 text-[#71717a] hover:text-blue-500 cursor-pointer"
                            title={task.status === TaskStatus.COMPLETED ? "Set Uncompleted" : "Complete Task"}
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 ${task.status === TaskStatus.COMPLETED ? "text-blue-500" : ""}`} />
                          </button>
                          {colStatus !== "Completed" && (
                            <button
                              onClick={() => {
                                // Simple quick-advance in status
                                const nextStat = task.status === TaskStatus.NOT_STARTED ? TaskStatus.IN_PROGRESS : TaskStatus.COMPLETED;
                                updateTask(task.id, { status: nextStat });
                                if (nextStat === TaskStatus.COMPLETED) gainXP(150);
                              }}
                              className="p-1 text-[#71717a] hover:text-blue-500 cursor-pointer"
                              title="Advance Status"
                            >
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleStartEdit(task)}
                            className="p-1 text-[#71717a] hover:text-[#fafafa] cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-[#71717a] hover:text-red-400 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="py-12 text-center text-[#71717a] text-xs font-mono border border-dashed border-[#1f1f23] rounded-lg">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
