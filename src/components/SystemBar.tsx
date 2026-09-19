import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import {
  Bell,
  Sun,
  Moon,
  X,
  Share2,
  Check,
  Calendar,
  User,
  CheckCircle2,
  CalendarRange,
  Menu
} from "lucide-react";

interface SystemBarProps {
  onOpenSidebar?: () => void;
}

export default function SystemBar({ onOpenSidebar }: SystemBarProps) {
  const {
    tasks,
    theme,
    toggleTheme,
    notifications,
    clearNotifications,
    removeNotification,
    setActiveTab,
    activeTab,
    profile
  } = useStore();

  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentDateStr, setCurrentDateStr] = useState("");

  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(
      now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      })
    );
  }, []);

  const activeTaskCount = tasks.filter((t) => t.status !== "Completed").length;

  const handleShareLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  };

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return "Dashboard";
      case "planner":
        return "Today's Schedule";
      case "tasks":
        return "Task Manager";
      case "calendar":
        return "Calendar";
      case "roadmap":
        return "Career Roadmap";
      case "learning":
        return "Skills & Learning";
      case "projects":
        return "Portfolio Projects";
      case "habits":
        return "Daily Habits";
      case "resume":
        return "Resume Manager";
      case "interview":
        return "Interview Prep";
      case "applications":
        return "Job Applications";
      case "settings":
        return "Workspace Settings";
      default:
        return "PathForge";
    }
  };

  return (
    <header className="h-14 border-b border-[#1f1f23] bg-[#0c0c0e]/95 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left side: View title & quick status */}
      <div className="flex items-center gap-3">
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-1.5 -ml-1 text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] rounded-lg transition-colors cursor-pointer"
            id="mobile-sidebar-toggle"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <h2 className="font-sans font-bold text-sm text-[#fafafa] tracking-tight">
            {getTabTitle(activeTab)}
          </h2>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-zinc-600" />
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#71717a] font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            {currentDateStr}
          </span>
        </div>

        {activeTaskCount > 0 && (
          <button
            onClick={() => setActiveTab("tasks")}
            className="hidden md:flex items-center gap-1.5 text-[11px] font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-500/20 transition-colors cursor-pointer"
            title="View active tasks"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>{activeTaskCount} tasks to do</span>
          </button>
        )}
      </div>

      {/* Right side: Share, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Share Web Link button */}
        <button
          onClick={handleShareLink}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
            copiedLink
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
              : "bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-white border-[#27272a]"
          }`}
          title="Copy web link to share with others"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px]">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] hidden sm:inline">Share App</span>
            </>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-transparent hover:bg-zinc-100 dark:hover:bg-[#18181b] border border-transparent hover:border-slate-200 dark:hover:border-[#27272a] rounded-lg transition-all cursor-pointer group"
          title={theme === "dark" ? "Currently Dark mode. Click to switch to Light mode" : "Currently Light mode. Click to switch to Dark mode"}
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span className="text-[11px] font-mono hidden md:inline text-zinc-400 group-hover:text-zinc-200">Dark</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-500 group-hover:-rotate-12 transition-transform" />
              <span className="text-[11px] font-mono hidden md:inline text-slate-700 group-hover:text-slate-900 font-medium">Light</span>
            </>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifPanelOpen(!notifPanelOpen)}
            className="p-1.5 text-[#a1a1aa] hover:text-white hover:bg-[#18181b] rounded-lg transition-colors relative cursor-pointer"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifPanelOpen && (
            <div className="absolute right-0 top-11 bg-[#0c0c0e] border border-[#1f1f23] shadow-2xl rounded-xl p-3.5 w-76 sm:w-80 z-50 text-xs space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between border-b border-[#1f1f23] pb-2">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-blue-400" />
                  <span>Notifications</span>
                </span>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-[10px] text-zinc-500 hover:text-red-400 transition-colors font-medium cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setNotifPanelOpen(false)}
                    className="text-zinc-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-center text-[#71717a] py-4 text-xs">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-2.5 bg-[#09090b] border border-[#1f1f23] rounded-lg text-xs relative group flex items-start gap-2"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                          notif.type === "success"
                            ? "bg-emerald-500"
                            : notif.type === "warning"
                            ? "bg-amber-500"
                            : "bg-blue-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-200 text-xs leading-snug">{notif.text}</p>
                        <span className="text-[10px] text-zinc-500 block mt-1">{notif.timestamp}</span>
                      </div>
                      <button
                        onClick={() => removeNotification(notif.id)}
                        className="text-zinc-600 hover:text-red-400 transition-colors p-0.5 cursor-pointer opacity-40 group-hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[#1f1f23] mx-0.5 hidden sm:block" />

        {/* User Profile Pill */}
        <button
          onClick={() => setActiveTab("settings")}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[#18181b] transition-colors cursor-pointer group"
          title="Open Profile Settings"
        >
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            {profile.name.substring(0, 1)}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-white leading-tight group-hover:text-blue-400 transition-colors">
              {profile.name}
            </p>
            <p className="text-[10px] text-[#71717a] leading-tight">Level {profile.level}</p>
          </div>
        </button>
      </div>
    </header>
  );
}
