import React, { useState, useEffect } from "react";
import { useStore, applyThemeToDom, applyDensityToDom } from "./store";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TodayPlanner from "./components/TodayPlanner";
import TaskManager from "./components/TaskManager";
import CalendarView from "./components/CalendarView";
import RoadmapTracker from "./components/RoadmapTracker";
import LearningTracker from "./components/LearningTracker";
import ProjectManager from "./components/ProjectManager";
import HabitTracker from "./components/HabitTracker";
import ResumeManager from "./components/ResumeManager";
import InterviewPrep from "./components/InterviewPrep";
import JobApplications from "./components/JobApplications";
import Settings from "./components/Settings";
import { Menu } from "lucide-react";
import SystemBar from "./components/SystemBar";

export default function App() {
  const { activeTab, profile, theme, density } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    applyThemeToDom(theme);
  }, [theme]);

  useEffect(() => {
    applyDensityToDom(density);
  }, [density]);

  const isLight =
    theme === "light" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches);

  const resolvedTheme = isLight ? "light" : "dark";

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "planner":
        return <TodayPlanner />;
      case "tasks":
        return <TaskManager />;
      case "calendar":
        return <CalendarView />;
      case "roadmap":
        return <RoadmapTracker />;
      case "learning":
        return <LearningTracker />;
      case "projects":
        return <ProjectManager />;
      case "habits":
        return <HabitTracker />;
      case "resume":
        return <ResumeManager />;
      case "interview":
        return <InterviewPrep />;
      case "applications":
        return <JobApplications />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      id="app-root"
      data-theme={resolvedTheme}
      className={`flex h-screen w-screen overflow-hidden font-sans relative transition-colors duration-150 ${
        isLight ? "light bg-[#f8fafc] text-[#0f172a]" : "dark bg-[#09090b] text-[#fafafa]"
      } ${density === "compact" ? "compact-mode" : ""}`}
    >
      {/* Navigation sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Primary content area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <SystemBar onOpenSidebar={() => setSidebarOpen(true)} />
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}
