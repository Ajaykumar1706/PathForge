import React, { useState } from "react";
import { useStore } from "../store";
import { JobApplication } from "../types";
import { Plus, Trash2, ArrowRight, DollarSign, MapPin, Globe, Sparkles, FolderKanban, Calendar } from "lucide-react";

type LiteralStatus = "Applied" | "HR" | "Technical" | "Manager" | "Offer" | "Rejected";

export default function JobApplications() {
  const { jobApplications, addJobApplication, updateJobApplication, deleteJobApplication, gainXP } = useStore();

  const [isAdding, setIsAdding] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [status, setStatus] = useState<LiteralStatus>("Applied");
  const [interviewDate, setInterviewDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;

    addJobApplication({
      company,
      role,
      location,
      salary,
      status,
      appliedDate: "2026-07-12",
      interviewDate: interviewDate || undefined,
      notes: notes || undefined
    });

    gainXP(150); // reward 150 XP for applying and logging!

    setCompany("");
    setRole("");
    setLocation("");
    setSalary("");
    setStatus("Applied");
    setInterviewDate("");
    setNotes("");
    setIsAdding(false);
  };

  const getStatusColor = (s: LiteralStatus) => {
    switch (s) {
      case "Offer":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Rejected":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      case "Applied":
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
      default:
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    }
  };

  const pipelineColumns = [
    { label: "Applied", status: "Applied" as LiteralStatus },
    { label: "HR Screen", status: "HR" as LiteralStatus },
    { label: "Technical", status: "Technical" as LiteralStatus },
    { label: "Manager", status: "Manager" as LiteralStatus },
    { label: "Offer Received", status: "Offer" as LiteralStatus },
    { label: "Rejected", status: "Rejected" as LiteralStatus }
  ];

  return (
    <div id="applications-view" className="flex-1 overflow-y-auto bg-slate-950 p-6 space-y-6 text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-slate-100 flex items-center gap-2">
            Job Applications CRM
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Track hiring rounds, compensation offers, and schedule dates for top SDE positions
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Job Application</span>
          </button>
        </div>
      </div>

      {/* Adding Form inline */}
      {isAdding && (
        <form onSubmit={handleCreateApplication} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg max-w-xl space-y-4">
          <h3 className="font-sans font-bold text-sm text-slate-200 uppercase tracking-wider font-mono">
            New Target Position Specs
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Company *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, Vercel"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Software Engineer - Core Backend"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Location / Setup</label>
                <input
                  type="text"
                  placeholder="Remote / Hybrid (San Francisco)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Estimated Comp / Salary</label>
                <input
                  type="text"
                  placeholder="$185k - $220k base"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Hiring Stage Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LiteralStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="Applied">Applied</option>
                  <option value="HR">HR Screen</option>
                  <option value="Technical">Technical</option>
                  <option value="Manager">Manager</option>
                  <option value="Offer">Offer Received</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Interview Date (Optional)</label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-mono block mb-1">Recruitment Logs / Details</label>
                <textarea
                  placeholder="Hiring manager names, referral source, or questions asked..."
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs"
            >
              Save Application
            </button>
          </div>
        </form>
      )}

      {/* Horizontal Pipeline columns list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {pipelineColumns.map((col) => {
          const colApps = jobApplications.filter((app) => app.status === col.status);

          return (
            <div key={col.status} className="bg-slate-900/50 border border-slate-800/85 p-3.5 rounded-xl flex flex-col min-h-[380px] w-full min-w-[200px] max-w-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3.5">
                <h4 className="font-sans font-bold text-xs text-slate-300 truncate tracking-wide">
                  {col.label}
                </h4>
                <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-950 border border-slate-800 px-1.5 rounded-full">
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-850 hover:border-slate-750 transition-all group flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-100 truncate">{app.company}</h5>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{app.role}</p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {app.location && (
                        <span className="text-[9px] font-mono text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-500/50" />
                          {app.location}
                        </span>
                      )}
                      {app.salary && (
                        <span className="text-[9px] font-mono text-teal-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-teal-500/50" />
                          {app.salary}
                        </span>
                      )}
                      {app.interviewDate && (
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/5 border border-amber-500/10 px-1 rounded flex items-center gap-1 w-fit">
                          <Calendar className="w-3 h-3 text-amber-500/50" />
                          {app.interviewDate}
                        </span>
                      )}
                    </div>

                    {app.notes && (
                      <p className="text-[10px] text-slate-600 line-clamp-2 leading-tight italic">
                        "{app.notes}"
                      </p>
                    )}

                    <div className="border-t border-slate-850 pt-2 flex items-center justify-between">
                      {/* Advance Stage button */}
                      {col.status !== "Offer" && col.status !== "Rejected" && (
                        <button
                          onClick={() => {
                            let nextStage: LiteralStatus = "HR";
                            if (col.status === "Applied") nextStage = "HR";
                            else if (col.status === "HR") nextStage = "Technical";
                            else if (col.status === "Technical") nextStage = "Manager";
                            else if (col.status === "Manager") nextStage = "Offer";

                            updateJobApplication(app.id, { status: nextStage });
                            gainXP(150); // reward XP for progressing candidate pipeline!
                          }}
                          className="text-[9px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
                          title="Advance Stage"
                        >
                          <span>Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}

                      <button
                        onClick={() => deleteJobApplication(app.id)}
                        className="p-1 text-slate-600 hover:text-red-400 ml-auto"
                        title="Delete application log"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div className="py-12 text-center text-slate-600 text-[10px] font-mono border border-dashed border-slate-800 rounded-xl">
                    No records
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
