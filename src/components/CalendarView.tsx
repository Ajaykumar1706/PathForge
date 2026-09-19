import React, { useState } from "react";
import { useStore, getTodayStr } from "../store";
import { TaskStatus, TaskPriority, TaskDifficulty } from "../types";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckSquare,
  Clock,
  Plus,
  Trash2,
  Briefcase,
  Activity,
  CheckCircle2,
  Circle,
  ExternalLink,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function CalendarView() {
  const {
    tasks,
    jobApplications,
    plannerSlots,
    habits,
    addTask,
    deleteTask,
    toggleTaskStatus,
    gainXP,
    setActiveTab
  } = useStore();

  const todayStr = getTodayStr();

  // Dynamic calendar date: defaults to real current date
  const [currentDate, setCurrentDate] = useState(() => new Date());
  // Selected date string YYYY-MM-DD: defaults to today
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => todayStr);

  // Quick add task inline state
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("Work");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  // Compute days in current month and start day offset
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startDayOffset = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  // Month navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(todayStr);
  };

  // Generate calendar grid array
  const calendarGrid: (number | null)[] = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarGrid.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarGrid.push(d);
  }
  while (calendarGrid.length % 7 !== 0) {
    calendarGrid.push(null);
  }

  // Format date helper for days in current viewing month
  const formatDateStr = (dayNum: number) => {
    const mStr = String(month + 1).padStart(2, "0");
    const dStr = String(dayNum).padStart(2, "0");
    return `${year}-${mStr}-${dStr}`;
  };

  // Handle quick task creation for selected date
  const handleCreateTaskForDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      description: `Scheduled via workspace calendar for ${selectedDateStr}`,
      status: TaskStatus.NOT_STARTED,
      priority: newTaskPriority,
      difficulty: TaskDifficulty.MEDIUM,
      category: newTaskCategory,
      estimatedTime: 45,
      actualTime: 0,
      dueDate: selectedDateStr,
      tags: ["Calendar", newTaskCategory]
    });

    gainXP(50);
    setNewTaskTitle("");
    setIsAddingTask(false);
  };

  // Selected date human-readable title
  const selectedDateObj = new Date(selectedDateStr + "T00:00:00");
  const selectedDateFormatted = isNaN(selectedDateObj.getTime())
    ? selectedDateStr
    : selectedDateObj.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      });

  const isSelectedDateToday = selectedDateStr === todayStr;

  // Filter items specifically for the selected date
  const selectedDateTasks = tasks.filter((t) => t.dueDate === selectedDateStr);
  const selectedDateInterviews = jobApplications.filter(
    (app) => app.interviewDate === selectedDateStr
  );
  const selectedDateHabits = habits.filter((h) => h.history && h.history[selectedDateStr]);
  const isSelectedDateForPlanner = isSelectedDateToday && plannerSlots.length > 0;

  // Count active events in current month
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthTasksCount = tasks.filter((t) => t.dueDate.startsWith(currentMonthPrefix)).length;
  const monthInterviewsCount = jobApplications.filter(
    (a) => a.interviewDate && a.interviewDate.startsWith(currentMonthPrefix)
  ).length;

  return (
    <div id="calendar-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Workspace Calendar
          </h2>
          <p className="text-xs text-[#71717a] mt-1">
            Real-time schedule connected across tasks, interviews, habits, and daily plans
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleGoToToday}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#121215] border border-[#27272a] hover:border-blue-500/40 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Today ({todayStr})</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#71717a] bg-[#0c0c0e] border border-[#1f1f23] rounded-lg px-3 py-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Sync Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Interactive Calendar monthly grid */}
        <div className="lg:col-span-3 bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 shadow-sm">
          {/* Calendar Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-[#1f1f23]">
            <div className="flex items-center gap-3">
              <h3 className="font-sans font-bold text-lg text-[#fafafa] tracking-tight">
                {monthName} {year}
              </h3>
              <span className="text-[11px] font-mono text-zinc-400 bg-[#18181b] border border-[#27272a] px-2 py-0.5 rounded">
                {monthTasksCount} tasks • {monthInterviewsCount} interviews
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-2 hover:bg-[#18181b] rounded-lg text-zinc-400 hover:text-white border border-transparent hover:border-[#27272a] cursor-pointer transition-colors"
                title="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleGoToToday}
                className="px-2.5 py-1 text-xs font-mono text-blue-400 hover:bg-blue-500/10 rounded-md border border-blue-500/20 cursor-pointer transition-colors"
              >
                Current
              </button>
              <button
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-2 hover:bg-[#18181b] rounded-lg text-zinc-400 hover:text-white border border-transparent hover:border-[#27272a] cursor-pointer transition-colors"
                title="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Month Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-zinc-400 uppercase font-bold py-1.5 bg-[#09090b] rounded-lg border border-[#1f1f23]">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarGrid.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="bg-[#09090b]/20 min-h-[88px] rounded-xl border border-transparent"
                  />
                );
              }

              const dateStr = formatDateStr(day);
              const isSelected = selectedDateStr === dateStr;
              const isToday = dateStr === todayStr;

              // Compute event counts for this cell
              const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
              const dayCompletedTasks = dayTasks.filter((t) => t.status === TaskStatus.COMPLETED);
              const dayInterviews = jobApplications.filter(
                (app) => app.interviewDate === dateStr
              );
              const hasHabits = habits.some((h) => h.history && h.history[dateStr]);
              const hasPlanner = isToday && plannerSlots.length > 0;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`min-h-[88px] rounded-xl p-2 border text-left flex flex-col justify-between transition-all group relative cursor-pointer ${
                    isSelected
                      ? "bg-blue-500/10 border-blue-500 text-blue-400 shadow-sm ring-1 ring-blue-500/50"
                      : isToday
                      ? "bg-blue-950/20 border-blue-500/40 text-zinc-200 hover:border-blue-400"
                      : "bg-[#09090b]/60 hover:bg-[#141418] border-[#1f1f23] text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-mono font-bold ${isToday ? "text-blue-400" : ""}`}>
                      {day}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-mono uppercase tracking-wider bg-blue-500/20 text-blue-400 px-1 py-0.2 rounded font-bold border border-blue-500/30">
                        Today
                      </span>
                    )}
                  </div>

                  {/* Visual badges for events */}
                  <div className="space-y-1 w-full mt-1">
                    {dayInterviews.length > 0 && (
                      <div className="w-full bg-blue-500/25 text-blue-300 border border-blue-500/30 text-[8px] font-mono px-1 rounded truncate leading-tight py-0.5 flex items-center gap-1">
                        <Briefcase className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{dayInterviews[0].company}</span>
                      </div>
                    )}

                    {dayTasks.length > 0 && (
                      <div className={`w-full text-[8px] font-mono px-1 rounded truncate leading-tight py-0.5 flex items-center justify-between gap-1 border ${
                        dayCompletedTasks.length === dayTasks.length
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 line-through"
                          : "bg-indigo-500/20 text-indigo-300 border-indigo-500/25"
                      }`}>
                        <span className="truncate">{dayTasks[0].title}</span>
                        {dayTasks.length > 1 && (
                          <span className="shrink-0 font-bold opacity-80">+{dayTasks.length - 1}</span>
                        )}
                      </div>
                    )}

                    {hasPlanner && (
                      <div className="w-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-[8px] font-mono px-1 rounded truncate leading-tight py-0.5 flex items-center gap-1">
                        <Clock className="w-2 h-2 shrink-0 text-blue-400" />
                        <span className="truncate">{plannerSlots.length} schedule slots</span>
                      </div>
                    )}

                    {hasHabits && !dayTasks.length && !dayInterviews.length && (
                      <div className="w-full bg-emerald-500/10 text-emerald-400 text-[8px] font-mono px-1 rounded truncate leading-tight py-0.5 flex items-center gap-1">
                        <Activity className="w-2 h-2 shrink-0" />
                        <span>Habit logged</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Day Agenda & Instant Actions */}
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 flex flex-col justify-between shadow-sm space-y-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="border-b border-[#1f1f23] pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <h3 className="font-sans font-bold text-sm text-[#fafafa] tracking-tight">
                    {selectedDateFormatted}
                  </h3>
                </div>
                {isSelectedDateToday && (
                  <span className="text-[10px] font-mono bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-500/30">
                    TODAY
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                {selectedDateTasks.length} tasks • {selectedDateInterviews.length} interviews
              </p>
            </div>

            {/* Quick Add Task Button or Form for this Date */}
            {!isAddingTask ? (
              <button
                onClick={() => setIsAddingTask(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/30 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task on this Date</span>
              </button>
            ) : (
              <form
                onSubmit={handleCreateTaskForDate}
                className="bg-[#09090b] border border-[#27272a] rounded-xl p-3 space-y-2.5 animate-in fade-in duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">New Task for {selectedDateStr}</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="text-zinc-500 hover:text-white text-xs font-mono"
                  >
                    Cancel
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Task title (e.g. System Design Practice)..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full bg-[#121215] border border-[#27272a] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  autoFocus
                />

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="bg-[#121215] border border-[#27272a] rounded-lg px-2 py-1 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="SQL">SQL</option>
                    <option value="Python">Python</option>
                    <option value="React">React</option>
                    <option value="Interview Prep">Interview Prep</option>
                    <option value="Learning">Learning</option>
                    <option value="Project">Project</option>
                    <option value="Work">Work</option>
                  </select>

                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="bg-[#121215] border border-[#27272a] rounded-lg px-2 py-1 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value={TaskPriority.LOW}>Low Priority</option>
                    <option value={TaskPriority.MEDIUM}>Medium</option>
                    <option value={TaskPriority.HIGH}>High Priority</option>
                    <option value={TaskPriority.CRITICAL}>Critical</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Save to Calendar & Task Manager (+50 XP)
                </button>
              </form>
            )}

            {/* Agenda Items List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              
              {/* Interviews on this date */}
              {selectedDateInterviews.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl border border-blue-500/30 bg-blue-500/5 text-blue-300 space-y-1.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                      Interview Scheduled
                    </span>
                    <button
                      onClick={() => setActiveTab("applications")}
                      className="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Pipeline</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <h5 className="text-xs font-bold text-white">{app.company} — {app.role}</h5>
                  {app.location && (
                    <p className="text-[10px] text-zinc-400">{app.location}</p>
                  )}
                  {app.notes && (
                    <p className="text-[10px] text-blue-200/80 italic">{app.notes}</p>
                  )}
                </div>
              ))}

              {/* Tasks on this date */}
              {selectedDateTasks.map((task) => {
                const isCompleted = task.status === TaskStatus.COMPLETED;
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isCompleted
                        ? "bg-[#09090b]/80 border-emerald-500/30 text-zinc-400"
                        : "bg-[#09090b] border-[#27272a] text-zinc-200 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className="mt-0.5 text-zinc-400 hover:text-white cursor-pointer"
                          title={isCompleted ? "Mark incomplete" : "Mark completed (+150 XP)"}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-zinc-500 hover:text-blue-400" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${isCompleted ? "line-through text-zinc-500" : "text-white"}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {task.category}
                            </span>
                            <span className={`text-[9px] font-mono ${
                              task.priority === TaskPriority.HIGH || task.priority === TaskPriority.CRITICAL
                                ? "text-rose-400"
                                : "text-zinc-400"
                            }`}>
                              {task.priority} Priority
                            </span>
                            {task.estimatedTime > 0 && (
                              <span className="text-[9px] font-mono text-zinc-500">
                                {task.estimatedTime}m
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-zinc-600 hover:text-rose-400 p-1 rounded cursor-pointer transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Planner Schedule link if viewing today */}
              {isSelectedDateForPlanner && (
                <div className="p-3 rounded-xl border border-zinc-800 bg-[#09090b] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                      Today's Schedule Blocks ({plannerSlots.length})
                    </span>
                    <button
                      onClick={() => setActiveTab("planner")}
                      className="text-[10px] font-mono text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Planner</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="space-y-1 text-xs">
                    {plannerSlots.slice(0, 3).map((slot, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between text-[11px] text-zinc-300 font-mono">
                        <span className="text-zinc-500">{slot.time}</span>
                        <span className="truncate max-w-[150px]">{slot.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state for this date */}
              {selectedDateTasks.length === 0 && selectedDateInterviews.length === 0 && !isSelectedDateForPlanner && (
                <div className="py-12 text-center text-zinc-500 text-xs font-mono space-y-2">
                  <CalendarIcon className="w-8 h-8 text-zinc-700 mx-auto" />
                  <p>No scheduled tasks or interviews on this date.</p>
                  <button
                    onClick={() => setIsAddingTask(true)}
                    className="text-blue-400 hover:underline font-sans cursor-pointer text-xs"
                  >
                    + Schedule something for {selectedDateFormatted}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#1f1f23] pt-3 text-center">
            <span className="text-[10px] font-mono text-[#71717a]">
              Changes here immediately sync with Task Manager & Dashboard.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

