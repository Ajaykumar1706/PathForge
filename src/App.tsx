import React, { useState } from "react";
import { useStore } from "./store";
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
import AICoach from "./components/AICoach";
import Settings from "./components/Settings";
import { Menu } from "lucide-react";
import SystemBar from "./components/SystemBar";

export default function App() {
  const { activeTab, profile } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      case "coach":
        return <AICoach />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] font-sans text-[#fafafa] relative">
      {/* Mobile Top Header (only visible on mobile/tablet) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0c0c0e] border-b border-[#1f1f23] px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b] rounded-lg transition-colors cursor-pointer"
            id="mobile-sidebar-toggle"
            title="Open main navigation menu"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
          <span className="font-sans font-bold text-sm text-white tracking-tight">CareerOS</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-[#71717a] bg-[#18181b] px-2 py-0.5 rounded border border-[#27272a] font-bold">
            LVL {profile.level}
          </span>
        </div>
      </div>

      {/* Navigation sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Primary content area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative pt-14 md:pt-0">
        <SystemBar />
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}
