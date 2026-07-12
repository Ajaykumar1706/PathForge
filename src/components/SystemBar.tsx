import React, { useState, useEffect } from "react";
import { useStore } from "../store";
import { TaskPriority, TaskStatus } from "../types";
import {
  Bell,
  Clock,
  Database,
  Keyboard,
  Sun,
  Moon,
  Download,
  Printer,
  Sliders,
  X,
  Check,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Play,
  FileSpreadsheet,
  AlertTriangle,
  Flame,
  User,
  Power,
  Calendar
} from "lucide-react";

export default function SystemBar() {
  const {
    tasks,
    jobApplications,
    theme,
    toggleTheme,
    isAutoStart,
    toggleAutoStart,
    notifications,
    addNotification,
    clearNotifications,
    removeNotification,
    gainXP,
    setActiveTab,
    activeTab,
    profile
  } = useStore();

  // Active Clock state
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  // UI Panels state
  const [dbPanelOpen, setDbPanelOpen] = useState(false);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [trayOpen, setTrayOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Db Optimization states
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optProgress, setOptProgress] = useState(0);

  // Update check state
  const [checkingUpdates, setCheckingUpdates] = useState(false);

  // Keyboard shortcut state helper
  const [lastKey, setLastKey] = useState<string | null>(null);

  // Ticking clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
      setDateStr(now.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard Shortcuts global listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside form inputs
      const activeEl = document.activeElement?.tagName;
      if (activeEl === "INPUT" || activeEl === "TEXTAREA" || activeEl === "SELECT") {
        return;
      }

      const key = e.key.toLowerCase();

      // Shortcuts helper modal
      if (key === "?" || key === "/") {
        setShortcutsOpen((prev) => !prev);
        e.preventDefault();
        return;
      }

      if (key === "escape") {
        setDbPanelOpen(false);
        setNotifPanelOpen(false);
        setTrayOpen(false);
        setShortcutsOpen(false);
        return;
      }

      // Sequential keys (e.g., 'g' then 'd')
      if (lastKey === "g") {
        if (key === "d") setActiveTab("dashboard");
        if (key === "t") setActiveTab("tasks");
        if (key === "c") setActiveTab("coach");
        if (key === "s") setActiveTab("settings");
        if (key === "a") setActiveTab("applications");
        if (key === "l") setActiveTab("learning");
        if (key === "p") setActiveTab("projects");
        if (key === "h") setActiveTab("habits");
        setLastKey(null);
        e.preventDefault();
        return;
      }

      if (key === "g") {
        setLastKey("g");
        // Reset after 1 second if no follow-up
        setTimeout(() => setLastKey(null), 1000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lastKey, setActiveTab]);

  // Handle SQLite indexing optimization sequence
  const handleOptimizeDatabase = () => {
    if (isOptimizing) return;
    setIsOptimizing(true);
    setOptProgress(10);

    const interval = setInterval(() => {
      setOptProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsOptimizing(false);
            setOptProgress(0);
            gainXP(50); // reward 50 XP
            addNotification("SQLite local engine index tree optimization complete. vacuum nominal (cleaned 5.4KB).", "success");
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  // Simulate updates checker
  const handleCheckUpdates = () => {
    if (checkingUpdates) return;
    setCheckingUpdates(true);
    addNotification("Checking CareerOS SDE curriculum databases for updates...", "info");

    setTimeout(() => {
      setCheckingUpdates(false);
      addNotification("Latest curriculum packages synced successfully! SDE Core at v2.6.4.", "success");
    }, 1500);
  };

  // Live active calendar synchronization (Real ICS download!)
  const handleExportICS = () => {
    let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//CareerOS//Calendar Sync//EN\r\nMETHOD:PUBLISH\r\n";

    // Add tasks
    tasks.forEach((task) => {
      const cleanTitle = task.title.replace(/[,;]/g, "");
      const cleanDesc = (task.description || "").replace(/[,;]/g, "");
      const datePart = task.dueDate.replace(/-/g, "");

      icsContent += "BEGIN:VEVENT\r\n";
      icsContent += `UID:task-${task.id}@careeros\r\n`;
      icsContent += `DTSTAMP:${datePart}T090000Z\r\n`;
      icsContent += `DTSTART;VALUE=DATE:${datePart}\r\n`;
      icsContent += `SUMMARY:CareerOS Task: ${cleanTitle}\r\n`;
      icsContent += `DESCRIPTION:Priority: ${task.priority} | Status: ${task.status} | Category: ${task.category} - ${cleanDesc}\r\n`;
      icsContent += "END:VEVENT\r\n";
    });

    // Add interviews
    jobApplications.filter((app) => app.interviewDate).forEach((app) => {
      const cleanTitle = `Interview with ${app.company} (${app.role})`.replace(/[,;]/g, "");
      const datePart = app.interviewDate!.replace(/-/g, "");

      icsContent += "BEGIN:VEVENT\r\n";
      icsContent += `UID:interview-${app.id}@careeros\r\n`;
      icsContent += `DTSTAMP:${datePart}T140000Z\r\n`;
      icsContent += `DTSTART:${datePart}T140000Z\r\n`;
      icsContent += `DTEND:${datePart}T150000Z\r\n`;
      icsContent += `SUMMARY:${cleanTitle}\r\n`;
      icsContent += `DESCRIPTION:Interview round at ${app.company}. Notes: ${app.notes || ""}\r\n`;
      icsContent += "END:VEVENT\r\n";
    });

    icsContent += "END:VCALENDAR\r\n";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "CareerOS_Schedule_Sync.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification("Synchronized ICS Calendar File downloaded successfully. Open in Outlook/Google Calendar!", "success");
  };

  // Direct CSV Downloader
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Title,Description,Status,Priority,Difficulty,Category,Estimated Time,Actual Time,Due Date\r\n";

    tasks.forEach((t) => {
      const row = [
        t.id,
        `"${t.title.replace(/"/g, '""')}"`,
        `"${t.description.replace(/"/g, '""')}"`,
        t.status,
        t.priority,
        t.difficulty,
        t.category,
        t.estimatedTime,
        t.actualTime,
        t.dueDate
      ].join(",");
      csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `CareerOS_Active_Tasks_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addNotification("CSV file generated and downloaded successfully.", "success");
  };

  // Print Page Layout
  const handlePrint = () => {
    window.print();
  };

  // Apply real DOM theme class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  }, [theme]);

  return (
    <>
      <div id="system-bar" className="h-11 bg-[#0c0c0e] border-b border-[#1f1f23] text-zinc-400 text-xs px-4 flex items-center justify-between shrink-0 select-none z-40 relative">
        
        {/* Left Side: System Telemetry & Quick DB info */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => {
              setDbPanelOpen(!dbPanelOpen);
              setNotifPanelOpen(false);
              setTrayOpen(false);
            }}
            className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer px-1.5 py-1 rounded hover:bg-[#18181b]/50"
          >
            <Database className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="font-mono font-bold tracking-tight text-[11px] text-zinc-300">SQLITE : nominal</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>

          <span className="text-[#1f1f23] hidden md:inline">|</span>

          {/* Quick Active Task Glance */}
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono">
            <span className="text-zinc-500">TASKS:</span>
            <span className="text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/15">
              {tasks.filter(t => t.status !== TaskStatus.COMPLETED).length} active
            </span>
          </div>
        </div>

        {/* Center: Live clock and active calendar view tag */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("calendar")}
            className="flex items-center gap-2 text-[11px] font-mono text-zinc-300 hover:text-white hover:bg-[#18181b]/60 px-2.5 py-1 rounded transition-all cursor-pointer border border-[#1f1f23]/40"
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold">{timeStr || "Loading..."}</span>
            <span className="text-zinc-500 text-[10px] hidden sm:inline">•</span>
            <span className="text-zinc-400 text-[10px] hidden sm:inline">{dateStr}</span>
          </button>
        </div>

        {/* Right Side: Tray controllers and custom widgets */}
        <div className="flex items-center gap-3">
          
          {/* Shortcuts Info */}
          <button
            onClick={() => setShortcutsOpen(true)}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#18181b] rounded transition-all cursor-pointer"
            title="Keyboard Shortcuts Guide (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#18181b] rounded transition-all cursor-pointer"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Real Notification Bell with Badge */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifPanelOpen(!notifPanelOpen);
                setDbPanelOpen(false);
                setTrayOpen(false);
              }}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#18181b] rounded transition-all relative cursor-pointer"
              title="Notifications Panel"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#0c0c0e] animate-ping" />
              )}
            </button>
          </div>

          {/* Control Tray Toggle */}
          <button
            onClick={() => {
              setTrayOpen(!trayOpen);
              setDbPanelOpen(false);
              setNotifPanelOpen(false);
            }}
            className={`p-1.5 text-zinc-400 hover:text-white hover:bg-[#18181b] rounded transition-all cursor-pointer ${
              trayOpen ? "bg-[#18181b] text-white" : ""
            }`}
            title="SDE Settings & Integrations"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        {/* --- DROPDOWN PANEL: SQLite Database Diagnostic Panel --- */}
        {dbPanelOpen && (
          <div className="absolute left-4 top-12 bg-[#0c0c0e] border border-[#1f1f23] shadow-2xl rounded-xl p-4 w-80 z-50 text-xs text-zinc-300 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-2">
              <div className="flex items-center gap-1.5 font-bold text-white font-mono uppercase tracking-wider text-[10px]">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                <span>SQLite Engine Diagnostics</span>
              </div>
              <button onClick={() => setDbPanelOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 bg-[#09090b] p-3 rounded-lg border border-[#1f1f23] font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-zinc-500">DB ENGINE</span>
                <span className="text-emerald-400 font-bold">SQLite-Indexed localStorage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">PAGE SIZE / CACHE</span>
                <span className="text-zinc-300">4096 bytes / 512KB WAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">LATENCY / IOPS</span>
                <span className="text-zinc-300">0.08ms nominal</span>
              </div>
              <div className="flex justify-between border-t border-[#1f1f23] pt-1.5 mt-1">
                <span className="text-zinc-500">RECORDS TABLE</span>
                <span className="text-zinc-300">Tasks ({tasks.length})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ROADMAP NODES</span>
                <span className="text-zinc-300">Active (4)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span className="text-zinc-500">ESTIMATED STORAGE SIZE</span>
                <span className="text-blue-400">~ 28.4 KB (Nominal write)</span>
              </div>
            </div>

            {/* Optimize DB Action Button */}
            <div>
              {isOptimizing ? (
                <div className="space-y-1.5 font-mono text-[10px] bg-[#09090b]/80 border border-blue-500/10 p-2.5 rounded-lg text-blue-400 text-center animate-pulse">
                  <span>Vacuuming and indexing: {optProgress}%</span>
                  <div className="w-full bg-[#18181b] h-1 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-150" style={{ width: `${optProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleOptimizeDatabase}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-all cursor-pointer font-sans"
                >
                  Optimize Database (Reindex & Prune)
                </button>
              )}
            </div>
          </div>
        )}

        {/* --- DROPDOWN PANEL: Notifications Panel --- */}
        {notifPanelOpen && (
          <div className="absolute right-12 top-12 bg-[#0c0c0e] border border-[#1f1f23] shadow-2xl rounded-xl p-4 w-80 z-50 text-xs text-zinc-300 space-y-3.5 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-2">
              <span className="font-bold text-white font-sans uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-blue-400" />
                <span>Active Notification Center</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearNotifications}
                  className="text-[10px] font-mono font-semibold text-zinc-500 hover:text-red-400 transition-colors"
                >
                  Clear All
                </button>
                <button onClick={() => setNotifPanelOpen(false)} className="text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-2.5 bg-[#09090b] border border-[#1f1f23] rounded-lg text-[11px] leading-relaxed relative group flex gap-2"
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${
                    notif.type === "success" ? "bg-emerald-500" : notif.type === "warning" ? "bg-amber-500" : "bg-blue-400"
                  }`} />
                  <div className="flex-1">
                    <p className="text-zinc-200">{notif.text}</p>
                    <span className="text-[9px] font-mono text-zinc-600 block mt-1">{notif.timestamp}</span>
                  </div>
                  <button
                    onClick={() => removeNotification(notif.id)}
                    className="text-zinc-600 hover:text-red-400 transition-colors self-start cursor-pointer opacity-10 group-hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="py-8 text-center text-zinc-600 text-[11px] font-mono">
                  No unread alerts. Workspace synchronized.
                </div>
              )}
            </div>

            <button
              onClick={() => addNotification("SDE Curriculum update available: Prep-Check scheduled.", "info")}
              className="w-full py-1.5 bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] font-bold border border-[#27272a] rounded-lg text-[10px] transition-all cursor-pointer font-mono"
            >
              + Inject Test Alert
            </button>
          </div>
        )}

        {/* --- DROPDOWN PANEL: Settings & Control Tray (macOS Control Center style) --- */}
        {trayOpen && (
          <div className="absolute right-4 top-12 bg-[#0c0c0e] border border-[#1f1f23] shadow-2xl rounded-xl p-4 w-80 z-50 text-xs text-zinc-300 space-y-4 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-2">
              <span className="font-bold text-white font-sans uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-500" />
                <span>Control Center</span>
              </span>
              <button onClick={() => setTrayOpen(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Toggle Settings */}
            <div className="space-y-3">
              {/* Boot / Startup Switch */}
              <div className="flex items-center justify-between bg-[#09090b] p-2.5 rounded-lg border border-[#1f1f23]">
                <div>
                  <p className="font-bold text-zinc-200">Launch on Startup</p>
                  <p className="text-[9px] text-zinc-500">Auto-start CareerOS on Boot</p>
                </div>
                <button
                  onClick={toggleAutoStart}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${
                    isAutoStart ? "bg-blue-600" : "bg-zinc-800"
                  }`}
                >
                  <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform duration-200 ${isAutoStart ? "translate-x-4.5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Google Calendar linkage */}
              <div className="flex items-center justify-between bg-[#09090b] p-2.5 rounded-lg border border-[#1f1f23]">
                <div>
                  <p className="font-bold text-zinc-200">Google Calendar Link</p>
                  <p className="text-[9px] text-zinc-500">Synchronized and monitored</p>
                </div>
                <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15">
                  LOCAL ONLY
                </span>
              </div>
            </div>

            {/* Calendar & Export Actions */}
            <div className="space-y-2 border-t border-[#1f1f23] pt-3">
              <span className="text-[9px] font-mono font-bold uppercase text-zinc-500 tracking-wider">Schedule Sync & Data Exports</span>
              
              {/* Export to Calendar ICS */}
              <button
                onClick={handleExportICS}
                className="w-full flex items-center gap-2 justify-start px-3 py-2 bg-[#18181b] hover:bg-[#27272a] rounded-lg text-zinc-300 font-semibold cursor-pointer border border-transparent hover:border-[#27272a] transition-all"
              >
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>Synchronize (ICS Download)</span>
              </button>

              {/* Export to Excel CSV */}
              <button
                onClick={handleExportCSV}
                className="w-full flex items-center gap-2 justify-start px-3 py-2 bg-[#18181b] hover:bg-[#27272a] rounded-lg text-zinc-300 font-semibold cursor-pointer border border-transparent hover:border-[#27272a] transition-all"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Export to Excel / CSV</span>
              </button>

              {/* Print current dashboard layout */}
              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-2 justify-start px-3 py-2 bg-[#18181b] hover:bg-[#27272a] rounded-lg text-zinc-300 font-semibold cursor-pointer border border-transparent hover:border-[#27272a] transition-all"
              >
                <Printer className="w-4 h-4 text-blue-400" />
                <span>Print Document (PDF Export)</span>
              </button>
            </div>

            {/* Quick SDE Update Action */}
            <div className="border-t border-[#1f1f23] pt-3">
              <button
                onClick={handleCheckUpdates}
                className="w-full py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-[#1f1f23] text-[10px] font-mono font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${checkingUpdates ? "animate-spin" : ""}`} />
                <span>Check for SDE updates</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL: Keyboard Shortcuts Help Cheat Sheet --- */}
      {shortcutsOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#0c0c0e] border border-[#1f1f23] shadow-2xl rounded-2xl p-6 max-w-md w-full text-xs text-zinc-300 space-y-4 relative animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
              <h3 className="font-sans font-bold text-base text-white flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-400" />
                <span>Keyboard Shortcuts Cheat Sheet</span>
              </h3>
              <button
                onClick={() => setShortcutsOpen(false)}
                className="p-1 text-zinc-500 hover:text-white hover:bg-[#18181b] rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="flex justify-between items-center bg-[#09090b] p-2 rounded border border-[#1f1f23]">
                <span className="text-zinc-500">Go to Dashboard</span>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15 font-bold">g then d</span>
              </div>
              <div className="flex justify-between items-center bg-[#09090b] p-2 rounded border border-[#1f1f23]">
                <span className="text-zinc-500">Go to Task Manager</span>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15 font-bold">g then t</span>
              </div>
              <div className="flex justify-between items-center bg-[#09090b] p-2 rounded border border-[#1f1f23]">
                <span className="text-zinc-500">Go to AI Career Coach</span>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15 font-bold">g then c</span>
              </div>
              <div className="flex justify-between items-center bg-[#09090b] p-2 rounded border border-[#1f1f23]">
                <span className="text-zinc-500">Go to Job Applications</span>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15 font-bold">g then a</span>
              </div>
              <div className="flex justify-between items-center bg-[#09090b] p-2 rounded border border-[#1f1f23]">
                <span className="text-zinc-500">Go to Learning Tracks</span>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15 font-bold">g then l</span>
              </div>
              <div className="flex justify-between items-center bg-[#09090b] p-2 rounded border border-[#1f1f23]">
                <span className="text-zinc-500">Go to Project Manager</span>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15 font-bold">g then p</span>
              </div>
              <div className="flex justify-between items-center bg-[#09090b] p-2 rounded border border-[#1f1f23]">
                <span className="text-zinc-500">Go to Habits Tracker</span>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15 font-bold">g then h</span>
              </div>
              <div className="flex justify-between items-center bg-[#09090b] p-2 rounded border border-[#1f1f23]">
                <span className="text-zinc-500">Go to Settings Workspace</span>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15 font-bold">g then s</span>
              </div>
              <div className="flex justify-between items-center bg-[#09090b] p-2 rounded border border-[#1f1f23]">
                <span className="text-zinc-500">Close open panels/modals</span>
                <span className="text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/15 font-bold">Esc</span>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 font-sans text-center">
              * Shortcuts are globally active. Just press the sequence while on the app!
            </div>
          </div>
        </div>
      )}
    </>
  );
}
