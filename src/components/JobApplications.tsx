import React, { useState } from "react";
import { useStore } from "../store";
import { JobApplication } from "../types";
import {
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  MapPin,
  Calendar,
  X,
  Building2,
  ChevronRight
} from "lucide-react";

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

  // Edit modal state
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editSalary, setEditSalary] = useState("");
  const [editStatus, setEditStatus] = useState<LiteralStatus>("Applied");
  const [editInterviewDate, setEditInterviewDate] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    addJobApplication({
      company: company.trim(),
      role: role.trim(),
      location: location.trim() || undefined,
      salary: salary.trim() || undefined,
      status,
      appliedDate: new Date().toISOString().split("T")[0],
      interviewDate: interviewDate || undefined,
      notes: notes.trim() || undefined
    });

    gainXP(150);

    setCompany("");
    setRole("");
    setLocation("");
    setSalary("");
    setStatus("Applied");
    setInterviewDate("");
    setNotes("");
    setIsAdding(false);
  };

  const handleStartEdit = (app: JobApplication) => {
    setEditingAppId(app.id);
    setEditCompany(app.company);
    setEditRole(app.role);
    setEditLocation(app.location || "");
    setEditSalary(app.salary || "");
    setEditStatus((app.status as LiteralStatus) || "Applied");
    setEditInterviewDate(app.interviewDate || "");
    setEditNotes(app.notes || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppId || !editCompany.trim() || !editRole.trim()) return;

    updateJobApplication(editingAppId, {
      company: editCompany.trim(),
      role: editRole.trim(),
      location: editLocation.trim() || undefined,
      salary: editSalary.trim() || undefined,
      status: editStatus,
      interviewDate: editInterviewDate || undefined,
      notes: editNotes.trim() || undefined
    });

    setEditingAppId(null);
  };

  const pipelineColumns: { label: string; status: LiteralStatus }[] = [
    { label: "Applied", status: "Applied" },
    { label: "HR Screen", status: "HR" },
    { label: "Technical", status: "Technical" },
    { label: "Manager", status: "Manager" },
    { label: "Offer Received", status: "Offer" },
    { label: "Rejected", status: "Rejected" }
  ];

  return (
    <div id="applications-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1f1f23] pb-5">
        <div>
          <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa] flex items-center gap-2">
            Job Applications Tracker
          </h2>
          <p className="text-xs text-[#71717a] mt-1">
            Track interview rounds, compensation, statuses, and recruiter notes. Everything is fully editable.
          </p>
        </div>

        <div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Log Job Application</span>
          </button>
        </div>
      </div>

      {/* Add Application Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateApplication}
          className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 shadow-lg max-w-2xl space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
            <h3 className="font-sans font-bold text-sm text-[#fafafa]">Log Job Application</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Company Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Stripe, Google, Linear"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Job Title / Role</label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Remote, San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Target Compensation</label>
              <input
                type="text"
                placeholder="e.g. $165,000 / yr"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Pipeline Stage</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LiteralStatus)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="Applied">Applied</option>
                <option value="HR">HR Screen</option>
                <option value="Technical">Technical</option>
                <option value="Manager">Manager Interview</option>
                <option value="Offer">Offer Received</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Next Interview Date (Optional)</label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-300 focus:outline-none font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-zinc-400 block mb-1">Recruiter Notes / Details</label>
              <textarea
                placeholder="Recruiter contact, interview prep notes, referral source..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#1f1f23]">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#18181b] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
            >
              Save Application
            </button>
          </div>
        </form>
      )}

      {/* Edit Application Modal */}
      {editingAppId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSaveEdit}
            className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-6 shadow-2xl w-full max-w-xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-3">
              <h3 className="font-sans font-bold text-base text-[#fafafa] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span>Edit Job Application</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingAppId(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Role</label>
                <input
                  type="text"
                  required
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Compensation</label>
                <input
                  type="text"
                  value={editSalary}
                  onChange={(e) => setEditSalary(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-[#fafafa] font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Pipeline Stage</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as LiteralStatus)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-zinc-200"
                >
                  <option value="Applied">Applied</option>
                  <option value="HR">HR Screen</option>
                  <option value="Technical">Technical</option>
                  <option value="Manager">Manager Interview</option>
                  <option value="Offer">Offer Received</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Interview Date</label>
                <input
                  type="date"
                  value={editInterviewDate}
                  onChange={(e) => setEditInterviewDate(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-zinc-300 font-mono"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-zinc-400 block mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#1f1f23]">
              <button
                type="button"
                onClick={() => setEditingAppId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white hover:bg-[#18181b] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {pipelineColumns.map((col) => {
          const colApps = jobApplications.filter((app) => app.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-[#0c0c0e] border border-[#1f1f23] p-3.5 rounded-xl flex flex-col min-h-[400px] w-full min-w-[220px]"
            >
              <div className="flex items-center justify-between border-b border-[#1f1f23] pb-2.5 mb-3">
                <h4 className="font-bold text-xs text-zinc-200 tracking-wide">
                  {col.label}
                </h4>
                <span className="text-[10px] font-mono font-bold text-zinc-400 bg-[#09090b] border border-[#1f1f23] px-2 py-0.5 rounded-full">
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    className="bg-[#09090b] p-3.5 rounded-xl border border-[#1f1f23] hover:border-zinc-700 transition-all group flex flex-col justify-between space-y-2.5"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="text-xs font-bold text-[#fafafa] truncate flex-1">{app.company}</h5>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(app)}
                            className="p-1 text-zinc-400 hover:text-blue-400 rounded cursor-pointer"
                            title="Edit application"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteJobApplication(app.id)}
                            className="p-1 text-zinc-400 hover:text-red-400 rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{app.role}</p>
                    </div>

                    <div className="space-y-1 pt-1 text-[10px]">
                      {app.location && (
                        <span className="text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-500" />
                          {app.location}
                        </span>
                      )}
                      {app.salary && (
                        <span className="text-blue-400 font-mono flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {app.salary}
                        </span>
                      )}
                      {app.interviewDate && (
                        <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit font-mono">
                          <Calendar className="w-3 h-3" />
                          {app.interviewDate}
                        </span>
                      )}
                    </div>

                    {app.notes && (
                      <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed bg-[#0c0c0e] p-2 rounded border border-[#1f1f23]">
                        {app.notes}
                      </p>
                    )}

                    {/* Stage quick advance */}
                    <div className="pt-1 flex items-center justify-between border-t border-[#1f1f23] text-[10px]">
                      <select
                        value={app.status}
                        onChange={(e) =>
                          updateJobApplication(app.id, { status: e.target.value as LiteralStatus })
                        }
                        className="bg-[#0c0c0e] border border-[#1f1f23] rounded px-1.5 py-0.5 text-zinc-300 text-[10px] cursor-pointer"
                      >
                        <option value="Applied">Applied</option>
                        <option value="HR">HR Screen</option>
                        <option value="Technical">Technical</option>
                        <option value="Manager">Manager</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div className="h-24 flex items-center justify-center text-[10px] text-zinc-600 border border-dashed border-[#1f1f23] rounded-lg">
                    Empty
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
