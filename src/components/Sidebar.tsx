import React from "react";
import { useStore } from "../store";
import {
  LayoutDashboard,
  CalendarRange,
  CheckSquare,
  Route,
  BookOpen,
  FolderGit2,
  Activity,
  FileText,
  Award,
  Briefcase,
  MessageSquareCode,
  Settings as SettingsIcon,
  Flame,
  Zap,
  Sparkles,
  X
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { profile, activeTab, setActiveTab } = useStore();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "planner", label: "Today's Planner", icon: CalendarRange },
    { id: "tasks", label: "Task Manager", icon: CheckSquare },
    { id: "calendar", label: "Calendar", icon: CalendarRange },
    { id: "roadmap", label: "Career Roadmap", icon: Route },
    { id: "learning", label: "Learning Tracker", icon: BookOpen },
    { id: "projects", label: "Projects", icon: FolderGit2 },
    { id: "habits", label: "Habits", icon: Activity },
    { id: "resume", label: "Resume Manager", icon: FileText },
    { id: "interview", label: "Interview Prep", icon: Award },
    { id: "applications", label: "Applications", icon: Briefcase },
    { id: "coach", label: "AI Coach", icon: MessageSquareCode, highlight: true },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  // Calculate XP requirements
  // Level 1: 0-1000 XP
  // Level 2: 1000-2500 XP (Target: 1500 XP range)
  // Level 3: 2500-5000 XP (Target: 2500 XP range)
  const getXpProgress = () => {
    const xp = profile.xp;
    const lvl = profile.level;
    if (lvl === 1) {
      return { percentage: Math.min(100, (xp / 1000) * 100), current: xp, next: 1000 };
    } else if (lvl === 2) {
      const currentRangeXp = xp - 1000;
      return { percentage: Math.min(100, (currentRangeXp / 1500) * 100), current: xp, next: 2500 };
    } else if (lvl === 3) {
      const currentRangeXp = xp - 2500;
      return { percentage: Math.min(100, (currentRangeXp / 2500) * 100), current: xp, next: 5000 };
    } else if (lvl === 4) {
      const currentRangeXp = xp - 5000;
      return { percentage: Math.min(100, (currentRangeXp / 4000) * 100), current: xp, next: 9000 };
    } else {
      const currentRangeXp = xp - 9000;
      return { percentage: Math.min(100, (currentRangeXp / 5000) * 100), current: xp, next: 14000 };
    }
  };

  const xpData = getXpProgress();

  // Custom ranks based on level
  const getRank = (lvl: number) => {
    if (lvl === 1) return "Associate Engineer";
    if (lvl === 2) return "Mid-Level Specialist";
    if (lvl === 3) return "Senior Staff Designer";
    if (lvl === 4) return "Principal Architect";
    return "Elite Tech Lead";
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <div
        id="sidebar"
        className={`flex flex-col h-screen bg-[#09090b] border-r border-[#1f1f23] text-[#71717a] transition-transform duration-300 ease-in-out
          fixed inset-y-0 left-0 z-50 w-64 md:static md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1f1f23]">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center shrink-0 font-bold">
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
            </div>
            <div>
              <h1 className="font-sans font-bold text-[#fafafa] tracking-tight leading-none text-base">CareerOS</h1>
              <span className="text-[10px] font-mono text-[#71717a] font-semibold uppercase tracking-wider">Active Workspace</span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-[#71717a] hover:text-white hover:bg-[#18181b] rounded transition-colors cursor-pointer"
            title="Close navigation drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      {/* Gamification Stats Quick Glance */}
      <div className="px-4 py-4 bg-[#0c0c0e]/40 border-b border-[#1f1f23]/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-[#71717a] font-medium">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>Streak</span>
          </div>
          <span className="text-sm font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
            {profile.streak} Days
          </span>
        </div>

        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[#71717a] font-medium">Level {profile.level}</span>
          <span className="text-[10px] font-mono text-[#71717a] font-semibold uppercase">{getRank(profile.level)}</span>
        </div>

        {/* Level XP Progress Bar */}
        <div className="w-full bg-[#18181b] h-2 rounded-full overflow-hidden mb-1 border border-[#27272a]/50">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${xpData.percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[#71717a]">
          <span>{xpData.current} XP</span>
          <span>{xpData.next} XP</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-all group cursor-pointer ${
                isActive
                  ? "bg-[#18181b] text-white border border-[#27272a] shadow-sm font-semibold"
                  : "hover:bg-[#18181b]/50 hover:text-white border border-transparent text-[#71717a]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    isActive ? "text-blue-500" : "text-[#71717a] group-hover:text-[#a1a1aa]"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.highlight && (
                <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/15">
                  <Sparkles className="w-2 h-2" />
                  AI
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-[#1f1f23] bg-[#0c0c0e]/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center font-bold text-white text-sm shadow-inner uppercase tracking-wider shrink-0">
          {profile.name.substring(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{profile.name}</p>
          <p className="text-[10px] text-[#71717a] truncate">{profile.email}</p>
        </div>
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#18181b] border border-[#27272a]">
          <Zap className="w-3 h-3 text-yellow-500 animate-pulse" />
        </div>
      </div>
      </div>
    </>
  );
}
