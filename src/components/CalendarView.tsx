import React, { useState } from "react";
import { useStore } from "../store";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckSquare, Award, Clock } from "lucide-react";

export default function CalendarView() {
  const { tasks, jobApplications, plannerSlots } = useStore();

  // Calendar configuration for July 2026
  // July 1, 2026 falls on a Wednesday.
  // There are 31 days in July.
  const year = 2026;
  const monthName = "July";
  const startDayOffset = 3; // Wednesday (0=Sun, 1=Mon, 2=Tue, 3=Wed...)
  const totalDays = 31;

  const [selectedDay, setSelectedDay] = useState<number | null>(12); // default to July 12, 2026

  // Generate calendar grid array
  const calendarGrid: (number | null)[] = [];
  for (let i = 0; i < startDayOffset; i++) {
    calendarGrid.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarGrid.push(d);
  }
  // Fill remaining slots to make multiples of 7
  while (calendarGrid.length % 7 !== 0) {
    calendarGrid.push(null);
  }

  // Format single digit date to YYYY-MM-DD
  const formatDateStr = (dayNum: number) => {
    const dStr = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    return `2026-07-${dStr}`;
  };

  // Extract agenda items for selected day
  const getSelectedDayAgenda = () => {
    if (!selectedDay) return [];
    const dateStr = formatDateStr(selectedDay);

    const dayTasks = tasks.filter((t) => t.dueDate === dateStr).map((t) => ({
      type: "Task",
      title: `[${t.category}] ${t.title}`,
      time: t.priority === "High" || t.priority === "Critical" ? "Important" : "General",
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5",
    }));

    const dayInterviews = jobApplications
      .filter((app) => app.interviewDate === dateStr)
      .map((app) => ({
        type: "Interview",
        title: `${app.company} - ${app.role} Interview`,
        time: "Scheduled",
        color: "border-blue-500/30 text-blue-400 bg-blue-500/5",
      }));

    const daySchedule = plannerSlots.map((slot) => ({
      type: "Activity",
      title: slot.label,
      time: slot.time,
      color: "border-zinc-500/30 text-zinc-400 bg-zinc-500/5",
    }));

    return [...dayInterviews, ...dayTasks, ...daySchedule];
  };

  const currentAgenda = getSelectedDayAgenda();

  return (
    <div id="calendar-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Integrated Workspace Calendar
          </h2>
          <p className="text-xs text-[#71717a] font-mono mt-1">
            Track interview rounds, milestones, and daily study timetables from one single dashboard
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#71717a] bg-[#0c0c0e] border border-[#1f1f23] rounded-lg p-2 font-mono">
          <CalendarIcon className="w-4 h-4 text-blue-500 animate-pulse" />
          <span>Active month: July 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Calendar monthly grid */}
        <div className="lg:col-span-3 bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#1f1f23]">
            <h3 className="font-sans font-bold text-base text-[#fafafa]">
              {monthName} {year}
            </h3>
            <div className="flex gap-1">
              <button className="p-1.5 hover:bg-[#18181b] rounded text-[#71717a] hover:text-[#fafafa] cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1.5 hover:bg-[#18181b] rounded text-[#71717a] hover:text-[#fafafa] cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Month Days Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono text-[#71717a] uppercase font-bold py-1 bg-[#09090b]/45 rounded">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Grid Box */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarGrid.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="bg-[#09090b]/10 min-h-[70px] rounded-lg border border-transparent" />;
              }

              const dateStr = formatDateStr(day);
              const isSelected = selectedDay === day;

              // Compute events counts
              const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
              const dayInterviews = jobApplications.filter((app) => app.interviewDate === dateStr);
              const hasPlanner = plannerSlots.length > 0;

              return (
                <button
                  key={`day-${day}`}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[80px] rounded-xl p-2 border text-left flex flex-col justify-between transition-all group relative cursor-pointer ${
                    isSelected
                      ? "bg-blue-500/10 border-blue-500/50 text-blue-400 font-semibold"
                      : "bg-[#09090b]/40 hover:bg-[#18181b] border-[#1f1f23] text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <span className="text-xs font-mono font-bold">{day}</span>

                  {/* Tiny visual tags */}
                  <div className="space-y-1 w-full">
                    {dayInterviews.length > 0 && (
                      <div className="w-full bg-blue-500/20 text-blue-300 border border-blue-500/15 text-[8px] font-mono px-1 rounded truncate leading-none py-0.5">
                        Interview: {dayInterviews[0].company}
                      </div>
                    )}
                    {dayTasks.length > 0 && (
                      <div className="w-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/15 text-[8px] font-mono px-1 rounded truncate leading-none py-0.5">
                        Task: {dayTasks[0].title}
                      </div>
                    )}
                    {day === 12 && hasPlanner && (
                      <div className="w-full bg-zinc-500/20 text-zinc-300 border border-[#1f1f23] text-[8px] font-mono px-1 rounded truncate leading-none py-0.5">
                        {plannerSlots.length} schedule slots
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Daily Agenda Checklist */}
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#1f1f23] pb-3">
              <Clock className="w-4 h-4 text-blue-500" />
              <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono">
                July {selectedDay}, 2026 Agenda
              </h3>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {currentAgenda.map((item, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border flex flex-col gap-1 transition-all ${item.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono">{item.time}</span>
                  </div>
                  <p className="text-xs font-bold leading-snug">{item.title}</p>
                </div>
              ))}

              {currentAgenda.length === 0 && (
                <div className="py-16 text-center text-[#71717a] text-xs font-mono">
                  No active events listed for this date.
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-[#1f1f23] pt-4 mt-4 text-center">
            <span className="text-[10px] font-mono text-[#71717a]">
              * Click any date in the calendar box to inspect specific agendas.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
