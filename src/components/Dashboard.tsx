import React, { useState } from "react";
import { useStore, getTodayStr } from "../store";
import { TaskStatus } from "../types";
import {
  Target,
  CheckCircle2,
  BookOpen,
  Calendar,
  Flame,
  Award,
  TrendingUp,
  FolderKanban,
  Send,
  Zap,
  ArrowUpRight,
  ChevronRight,
  Clock,
  X,
  Route,
  User,
  Edit3,
  Circle,
  CalendarRange
} from "lucide-react";

export default function Dashboard() {
  const {
    profile,
    tasks,
    learningSkills,
    projects,
    jobApplications,
    habits,
    dailyPriorities,
    toggleDailyPriority,
    toggleTaskStatus,
    setActiveTab,
    updateProfile
  } = useStore();

  const [newFocusGoal, setNewFocusGoal] = useState(profile.focusGoal);
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(profile.name);
  const [profileEmail, setProfileEmail] = useState(profile.email);
  const [profileRole, setProfileRole] = useState(profile.role);
  const [profileCompany, setProfileCompany] = useState(profile.company || "");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      email: profileEmail,
      role: profileRole,
      company: profileCompany
    });
    setIsEditingProfile(false);
  };

  // Derive interactive stats
  const todayStr = getTodayStr();
  const completedTasksCount = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
  const activeTasks = tasks.filter((t) => t.status !== TaskStatus.COMPLETED);
  const todaysTasks = tasks.filter((t) => t.dueDate === todayStr);
  const completedToday = tasks.filter((t) => t.status === TaskStatus.COMPLETED && t.dueDate === todayStr).length;

  const totalStudyHours = learningSkills.reduce((sum, s) => sum + s.hoursLearned, 0);
  const finishedProjectsCount = projects.filter((p) => p.progress === 100).length;
  const activeProjectsCount = projects.filter((p) => p.progress < 100 && p.progress > 0).length;
  const totalApplications = jobApplications.length;

  // Interviews scheduled are applications with an interview date set
  const interviewsScheduled = jobApplications.filter((app) => app.interviewDate && app.status !== "Rejected" && app.status !== "Offer").length;

  // Average skill progress
  const avgSkillProgress = learningSkills.length > 0
    ? Math.round(learningSkills.reduce((sum, s) => sum + s.progress, 0) / learningSkills.length)
    : 0;

  // Dynamic status for new user baseline
  const isNewUser = (profile.xp || 0) === 0 && completedTasksCount === 0 && (profile.streak || 0) === 0 && totalStudyHours === 0;

  // Weekly productivity: starts at 0 for all days for a new user
  const weeklyProductivity = isNewUser
    ? [0, 0, 0, 0, 0, 0, 0]
    : [
        Math.min(100, completedTasksCount * 15),
        Math.min(100, completedToday * 25),
        Math.min(100, Math.round(totalStudyHours * 5)),
        Math.min(100, habits.reduce((acc, h) => acc + (h.streak > 0 ? 10 : 0), 0)),
        Math.min(100, Math.round(avgSkillProgress * 0.8)),
        Math.min(100, finishedProjectsCount * 30),
        Math.min(100, Math.round((profile.xp || 0) / 20))
      ];

  const weeklyLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const avgPoints = weeklyProductivity.reduce((sum, val) => sum + val, 0) / weeklyProductivity.length;

  // Baseline Y coordinate for chart
  const getY = (val: number) => {
    if (val === 0) return 170;
    return Math.max(25, 170 - (val * 1.35));
  };

  const weeklyStudyHours = (profile.focusTimeWeek > 0
    ? profile.focusTimeWeek / 60
    : totalStudyHours > 0
      ? totalStudyHours
      : 0
  ).toFixed(1);

  const codingCommitScore = tasks.length > 0
    ? Math.round((completedTasksCount / tasks.length) * 100)
    : 0;

  const appsWithInterviews = jobApplications.filter(
    (a) => a.status === "Technical" || a.status === "Manager" || a.status === "Offer"
  ).length;
  const offersCount = jobApplications.filter((a) => a.status === "Offer").length;
  const interviewSuccessRate = appsWithInterviews > 0
    ? Math.round((offersCount / appsWithInterviews) * 100)
    : 0;

  const handleSaveGoal = () => {
    updateProfile({ focusGoal: newFocusGoal });
    setIsEditingGoal(false);
  };

  return (
    <div id="dashboard-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header Greeting Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Good Morning, <span onClick={() => { setProfileName(profile.name); setProfileEmail(profile.email); setProfileRole(profile.role); setProfileCompany(profile.company || ""); setIsEditingProfile(true); }} className="hover:text-blue-400 cursor-pointer transition-colors underline decoration-dotted decoration-blue-500/50 underline-offset-4">{profile.name}</span> <span className="animate-bounce">👋</span>
            <button
              onClick={() => { setProfileName(profile.name); setProfileEmail(profile.email); setProfileRole(profile.role); setProfileCompany(profile.company || ""); setIsEditingProfile(true); }}
              className="text-xs font-normal text-[#71717a] hover:text-blue-400 font-mono transition-colors border border-[#1f1f23] hover:border-blue-500/25 px-2 py-0.5 rounded cursor-pointer"
            >
              Edit Identity
            </button>
          </h2>
          <p className="text-xs text-[#71717a] font-medium mt-1">
            Welcome back! Here is your daily productivity and career progress overview.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono font-bold text-[#71717a] uppercase tracking-wider">
            Workspace Active
          </span>
        </div>
      </div>

      {/* Large Welcome Focus Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#0c0c0e] border border-[#1f1f23] p-6 md:p-8 shadow-lg shadow-black/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20">
              <Target className="w-3.5 h-3.5" />
              <span>Daily Focus & Priorities</span>
            </div>
            
            <div className="space-y-1">
              <span className="text-xs text-[#71717a] uppercase tracking-wider font-mono">Today's Focus Goal</span>
              {isEditingGoal ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={newFocusGoal}
                    onChange={(e) => setNewFocusGoal(e.target.value)}
                    className="bg-[#18181b] border border-[#27272a] rounded-lg px-3 py-1.5 text-sm text-[#fafafa] focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                    placeholder="Enter your focus goal for today..."
                  />
                  <button onClick={handleSaveGoal} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs cursor-pointer">
                    Save
                  </button>
                  <button onClick={() => setIsEditingGoal(false)} className="bg-[#18181b] hover:bg-[#27272a] text-zinc-400 px-3 py-1.5 rounded-lg text-xs cursor-pointer">
                    Cancel
                  </button>
                </div>
              ) : (
                <h3 className="font-sans font-bold text-xl md:text-2xl text-[#fafafa] group flex items-center gap-2">
                  "{profile.focusGoal}"
                  <button
                    onClick={() => { setNewFocusGoal(profile.focusGoal); setIsEditingGoal(true); }}
                    className="text-xs text-[#71717a] hover:text-blue-400 font-mono transition-colors font-medium border border-[#1f1f23] hover:border-blue-500/20 px-2 py-0.5 rounded cursor-pointer"
                  >
                    Edit Goal
                  </button>
                </h3>
              )}
            </div>

            <p className="text-sm text-[#a1a1aa]">
              You have <strong className="text-blue-400 font-semibold">{todaysTasks.length} tasks scheduled</strong> for today. Complete them to earn <strong className="text-indigo-400 font-mono">+{todaysTasks.length * 150} XP</strong> toward Level {profile.level + 1}!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab("planner")}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 text-sm cursor-pointer"
            >
              <Clock className="w-4 h-4" />
              <span>Today's Schedule</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("roadmap")}
              className="flex items-center justify-center gap-2 bg-[#18181b] hover:bg-zinc-800 text-white border border-[#27272a] font-semibold px-5 py-3 rounded-xl transition-all text-sm cursor-pointer"
            >
              <Route className="w-4 h-4 text-blue-400" />
              <span>Career Roadmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards Grid with click actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 - Completed Tasks */}
        <div
          onClick={() => setActiveTab("tasks")}
          className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-blue-500/40 hover:bg-[#121215] rounded-xl p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 group"
          title="Click to open Task Manager"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717a] font-mono uppercase tracking-wider group-hover:text-blue-400 transition-colors">Completed Tasks</span>
            <CheckCircle2 className="w-5 h-5 text-blue-500 transition-transform group-hover:scale-105" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#fafafa]">{completedTasksCount}</h4>
            <span className="text-[10px] text-[#71717a] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-blue-400" /> +150 XP rewarded each
            </span>
          </div>
        </div>

        {/* Card 2 - Hours Studied */}
        <div
          onClick={() => setActiveTab("learning")}
          className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-blue-500/40 hover:bg-[#121215] rounded-xl p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 group"
          title="Click to open Learning Tracker"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717a] font-mono uppercase tracking-wider group-hover:text-indigo-400 transition-colors">Hours Studied</span>
            <BookOpen className="w-5 h-5 text-indigo-400 transition-transform group-hover:scale-105" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#fafafa]">{totalStudyHours} hrs</h4>
            <span className="text-[10px] text-[#71717a] flex items-center gap-1 mt-1">
              Across {learningSkills.length} core technology tracks
            </span>
          </div>
        </div>

        {/* Card 3 - Streak Count */}
        <div
          onClick={() => setActiveTab("habits")}
          className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-orange-500/40 hover:bg-[#121215] rounded-xl p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 group"
          title="Click to open Habits Tracker"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717a] font-mono uppercase tracking-wider group-hover:text-orange-400 transition-colors">Streak Count</span>
            <Flame className="w-5 h-5 text-orange-500 transition-transform group-hover:scale-105" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#fafafa]">{profile.streak} Days</h4>
            <span className="text-[10px] text-orange-400 flex items-center gap-1 mt-1 font-semibold">
              <Zap className="w-3 h-3" /> Consistent daily progress
            </span>
          </div>
        </div>

        {/* Card 4 - Interviews Set */}
        <div
          onClick={() => setActiveTab("interview")}
          className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-blue-500/40 hover:bg-[#121215] rounded-xl p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 group"
          title="Click to open Interview Prep"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717a] font-mono uppercase tracking-wider group-hover:text-blue-400 transition-colors">Interviews Set</span>
            <Calendar className="w-5 h-5 text-blue-400 transition-transform group-hover:scale-105" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#fafafa]">{interviewsScheduled}</h4>
            <span className="text-[10px] text-[#71717a] flex items-center gap-1 mt-1">
              Active recruiting callbacks
            </span>
          </div>
        </div>

        {/* Card 5 - Portfolio Projects */}
        <div
          onClick={() => setActiveTab("projects")}
          className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-indigo-500/40 hover:bg-[#121215] rounded-xl p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 group"
          title="Click to open Projects Workspace"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717a] font-mono uppercase tracking-wider group-hover:text-indigo-400 transition-colors">Portfolio Projects</span>
            <FolderKanban className="w-5 h-5 text-indigo-400 transition-transform group-hover:scale-105" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#fafafa]">{finishedProjectsCount} / {projects.length}</h4>
            <span className="text-[10px] text-[#71717a] flex items-center gap-1 mt-1">
              {activeProjectsCount} active build-outs in progress
            </span>
          </div>
        </div>

        {/* Card 6 - Applications Sent */}
        <div
          onClick={() => setActiveTab("applications")}
          className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-cyan-500/40 hover:bg-[#121215] rounded-xl p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 group"
          title="Click to open Applications Pipeline"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717a] font-mono uppercase tracking-wider group-hover:text-cyan-400 transition-colors">Applications Sent</span>
            <Send className="w-5 h-5 text-cyan-400 transition-transform group-hover:scale-105" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#fafafa]">{totalApplications} submitted</h4>
            <span className="text-[10px] text-[#71717a] flex items-center gap-1 mt-1">
              Tracked in active CRM pipeline
            </span>
          </div>
        </div>

        {/* Card 7 - Skill Average Progress */}
        <div
          onClick={() => setActiveTab("learning")}
          className="bg-[#0c0c0e] border border-[#1f1f23] hover:border-pink-500/40 hover:bg-[#121215] rounded-xl p-4 flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 group"
          title="Click to open Learning Tracks"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#71717a] font-mono uppercase tracking-wider group-hover:text-pink-400 transition-colors">Skill Avg Progress</span>
            <Award className="w-5 h-5 text-pink-400 transition-transform group-hover:scale-105" />
          </div>
          <div className="mt-4">
            <h4 className="text-2xl font-bold font-mono text-[#fafafa]">{avgSkillProgress}%</h4>
            <div className="w-full bg-[#18181b] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-pink-500" style={{ width: `${avgSkillProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Card 8 (Career Score Meter / Customize Profile) */}
        <div
          onClick={() => { setProfileName(profile.name); setProfileEmail(profile.email); setProfileRole(profile.role); setProfileCompany(profile.company || ""); setIsEditingProfile(true); }}
          className="bg-gradient-to-tr from-[#0c0c0e] to-[#0c0c0e]/40 border border-[#1f1f23] hover:border-blue-500/40 hover:bg-[#121215]/80 rounded-xl p-4 flex flex-col justify-between shadow-md cursor-pointer transition-all duration-200 group"
          title="Click to Customize Profile Identity"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider flex items-center gap-1 group-hover:text-blue-400 transition-colors">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span>Career Score</span>
            </span>
            <span className="text-blue-400 font-bold text-xs bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full transition-transform group-hover:scale-105">
              Level {profile.level}
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <h4 className="text-3xl font-extrabold font-mono text-blue-400">{profile.careerScore}</h4>
              <span className="text-xs text-[#71717a] font-mono">/100</span>
            </div>
            <p className="text-[9px] text-[#a1a1aa] mt-1 uppercase font-mono group-hover:text-[#fafafa] transition-colors">
              Click to edit profile details
            </p>
          </div>
        </div>
      </div>

      {/* Charts & Today Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Column 1: Daily Productivity & Growth Analytics */}
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 lg:col-span-2 space-y-4 relative overflow-hidden transition-all duration-200 hover:border-[#2a2a30]">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-sans font-bold text-base text-[#fafafa]">Daily Productivity Graph</h4>
                {isNewUser && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold">
                    New User Baseline • 0 pts
                  </span>
                )}
              </div>
              <p className="text-xs text-[#71717a]">Completed activities & study sessions this week</p>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/25 font-bold">
              Avg: {avgPoints.toFixed(1)} points
            </span>
          </div>

          {/* Premium Custom SVG Chart */}
          <div className="h-56 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Grids */}
              <line x1="0" y1="45" x2="600" y2="45" stroke="#1f1f23" strokeDasharray="3,3" />
              <line x1="0" y1="95" x2="600" y2="95" stroke="#1f1f23" strokeDasharray="3,3" />
              <line x1="0" y1="145" x2="600" y2="145" stroke="#1f1f23" strokeDasharray="3,3" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="#27272a" strokeWidth="1.5" />

              {/* Area Gradient */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path
                d={`
                  M 0 170
                  L 0 ${getY(weeklyProductivity[0])}
                  L 100 ${getY(weeklyProductivity[1])}
                  L 200 ${getY(weeklyProductivity[2])}
                  L 300 ${getY(weeklyProductivity[3])}
                  L 400 ${getY(weeklyProductivity[4])}
                  L 500 ${getY(weeklyProductivity[5])}
                  L 600 ${getY(weeklyProductivity[6])}
                  L 600 170
                  Z
                `}
                fill="url(#chartGradient)"
              />

              {/* Glowing Smooth Line */}
              <path
                d={`
                  M 0 ${getY(weeklyProductivity[0])}
                  C 50 ${getY(weeklyProductivity[0])}, 50 ${getY(weeklyProductivity[1])}, 100 ${getY(weeklyProductivity[1])}
                  C 150 ${getY(weeklyProductivity[1])}, 150 ${getY(weeklyProductivity[2])}, 200 ${getY(weeklyProductivity[2])}
                  C 250 ${getY(weeklyProductivity[2])}, 250 ${getY(weeklyProductivity[3])}, 300 ${getY(weeklyProductivity[3])}
                  C 350 ${getY(weeklyProductivity[3])}, 350 ${getY(weeklyProductivity[4])}, 400 ${getY(weeklyProductivity[4])}
                  C 450 ${getY(weeklyProductivity[4])}, 450 ${getY(weeklyProductivity[5])}, 500 ${getY(weeklyProductivity[5])}
                  C 550 ${getY(weeklyProductivity[5])}, 550 ${getY(weeklyProductivity[6])}, 600 ${getY(weeklyProductivity[6])}
                `}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data points */}
              {weeklyProductivity.map((val, idx) => {
                const cx = idx * 100;
                const cy = getY(val);
                return (
                  <g key={idx} className="group/dot cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r="5"
                      fill="#09090b"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="12"
                      fill="#3b82f6"
                      fillOpacity="0.2"
                      className="opacity-0 group-hover/dot:opacity-100 transition-opacity"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Zero state guide for fresh user */}
            {avgPoints === 0 && (
              <div className="absolute inset-x-0 top-10 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121215]/95 border border-[#27272a] shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-mono font-medium text-zinc-300">
                    Statistics start at 0
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-xs">
                  Complete tasks in Task Manager or tick off habits to chart your productivity trajectory.
                </p>
              </div>
            )}

            {/* Labels beneath chart */}
            <div className="flex justify-between px-1 mt-2 text-[10px] font-mono text-[#71717a]">
              {weeklyLabels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center border-t border-[#1f1f23] pt-4">
            <div>
              <p className="text-[10px] font-mono text-[#71717a] uppercase">Weekly Study Hours</p>
              <h5 className="text-base font-bold text-[#fafafa] mt-0.5">{weeklyStudyHours} hrs</h5>
            </div>
            <div className="border-x border-[#1f1f23]/80">
              <p className="text-[10px] font-mono text-[#71717a] uppercase">Coding Commit Score</p>
              <h5 className="text-base font-bold text-blue-400 mt-0.5">{codingCommitScore}%</h5>
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#71717a] uppercase">Interviews Success Rate</p>
              <h5 className="text-base font-bold text-indigo-400 mt-0.5">{interviewSuccessRate}%</h5>
            </div>
          </div>
        </div>

        {/* Column 2: Today's Priorities preview */}
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-sans font-bold text-base text-[#fafafa]">Morning Priorities</h4>
                <p className="text-[11px] text-[#71717a] font-mono">Syncs live with Today's Schedule</p>
              </div>
              <span className="text-[10px] font-mono font-semibold uppercase text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {dailyPriorities.filter((p) => p.completed).length} / {dailyPriorities.length} Done
              </span>
            </div>

            <div className="space-y-2.5">
              {dailyPriorities.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleDailyPriority(item.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group ${
                    item.completed
                      ? "bg-emerald-500/5 border-emerald-500/30 text-zinc-400"
                      : "bg-[#09090b] border-[#1f1f23] hover:border-blue-500/30 text-white"
                  }`}
                  title={item.completed ? "Click to uncheck" : "Click to mark done (+100 XP)"}
                >
                  <button
                    type="button"
                    className="shrink-0 text-zinc-500 group-hover:text-blue-400 transition-colors"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-600 group-hover:text-blue-400" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${item.completed ? "line-through text-zinc-500" : "text-[#fafafa]"}`}>
                      {item.text}
                    </p>
                    <p className="text-[10px] text-[#71717a] font-mono">
                      {item.completed ? "Completed" : "+100 XP on finish"}
                    </p>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#71717a] group-hover:text-blue-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#1f1f23] pt-4 mt-4 grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab("planner")}
              className="flex items-center justify-between text-xs font-medium text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 hover:border-blue-500/20 px-3 py-2 rounded-lg transition-colors group cursor-pointer"
            >
              <span>Today's Schedule</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => setActiveTab("calendar")}
              className="flex items-center justify-between text-xs font-medium text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 hover:border-indigo-500/20 px-3 py-2 rounded-lg transition-colors group cursor-pointer"
            >
              <span>View Calendar</span>
              <CalendarRange className="w-3.5 h-3.5 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
              <h3 className="font-sans font-bold text-lg text-[#fafafa] flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" />
                <span>Customize Profile</span>
              </h3>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 text-[#71717a] hover:text-white rounded-lg hover:bg-[#18181b] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs text-[#71717a] font-mono block mb-1">Developer Name</label>
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-sm text-[#fafafa] focus:outline-none"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              <div>
                <label className="text-xs text-[#71717a] font-mono block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-sm text-[#fafafa] focus:outline-none"
                  placeholder="e.g. developer@example.com"
                />
              </div>

              <div>
                <label className="text-xs text-[#71717a] font-mono block mb-1">Target Professional Role</label>
                <input
                  type="text"
                  required
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-sm text-[#fafafa] focus:outline-none"
                  placeholder="e.g. Senior Backend Engineer"
                />
              </div>

              <div>
                <label className="text-xs text-[#71717a] font-mono block mb-1">Target Company</label>
                <input
                  type="text"
                  value={profileCompany}
                  onChange={(e) => setProfileCompany(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-sm text-[#fafafa] focus:outline-none"
                  placeholder="e.g. Stripe / Google"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#1f1f23]">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
