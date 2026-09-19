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
  Award,
  Briefcase,
  FileText,
  Settings as SettingsIcon,
  Flame,
  Zap,
  X,
  Compass
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const { profile, activeTab, setActiveTab } = useStore();

  const navSections = [
    {
      title: "Core Work",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "tasks", label: "Task Manager", icon: CheckSquare },
        { id: "planner", label: "Today's Schedule", icon: CalendarRange },
        { id: "calendar", label: "Calendar", icon: CalendarRange }
      ]
    },
    {
      title: "Career & Growth",
      items: [
        { id: "roadmap", label: "Career Roadmap", icon: Route },
        { id: "learning", label: "Skills & Learning", icon: BookOpen },
        { id: "resume", label: "Resume Manager", icon: FileText },
        { id: "applications", label: "Job Applications", icon: Briefcase },
        { id: "interview", label: "Interview Prep", icon: Award }
      ]
    },
    {
      title: "Workspace",
      items: [
        { id: "projects", label: "Portfolio Projects", icon: FolderGit2 },
        { id: "habits", label: "Habit Tracker", icon: Activity },
        { id: "settings", label: "Settings", icon: SettingsIcon }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside
        id="sidebar"
        className={`flex flex-col h-screen bg-[#09090b] border-r border-[#1f1f23] text-[#71717a] transition-transform duration-300 ease-in-out
          fixed inset-y-0 left-0 z-50 w-64 md:static md:translate-x-0 select-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f1f23] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-white tracking-tight text-sm leading-none">
                PathForge
              </h1>
              <span className="text-[10px] text-zinc-500 font-medium">Web Workspace</span>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white hover:bg-[#18181b] rounded-lg transition-colors cursor-pointer"
            title="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact User Streak & Level Glance */}
        <div className="px-4 py-3 bg-[#0c0c0e]/60 border-b border-[#1f1f23] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-zinc-300">
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-semibold">{profile.streak} Day Streak</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
            Lvl {profile.level}
          </span>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
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
                      className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                        isActive
                          ? "bg-[#18181b] text-white border border-[#27272a] shadow-xs font-semibold"
                          : "hover:bg-[#18181b]/50 hover:text-zinc-200 text-zinc-400 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-blue-400"
                              : "text-zinc-500 group-hover:text-zinc-300"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-[#1f1f23] bg-[#0c0c0e]/80 flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs uppercase tracking-wider shrink-0">
            {profile.name.substring(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-200 truncate">{profile.name}</p>
            <p className="text-[10px] text-zinc-500 truncate">{profile.role || "Developer"}</p>
          </div>
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#18181b] border border-[#27272a]">
            <Zap className="w-3 h-3 text-amber-400" />
          </div>
        </div>
      </aside>
    </>
  );
}
