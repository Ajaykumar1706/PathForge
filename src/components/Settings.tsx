import React, { useState } from "react";
import { useStore } from "../store";
import { User, Shield, Download, Upload, Palette, Trash2, AlertTriangle } from "lucide-react";

export default function Settings() {
  const { profile, updateProfile, tasks, learningSkills, jobApplications, roadmaps, clearAllData } = useStore();

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [email, setEmail] = useState(profile.email);
  const [company, setCompany] = useState(profile.company || "");
  const [glassmorphism, setGlassmorphism] = useState(true);
  const [importStatus, setImportStatus] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, role, email, company });
  };

  const handleClearAllData = () => {
    clearAllData();
    setShowConfirmClear(false);
    setConfirmInput("");
    setImportStatus("All data cleared successfully! Resetting workspace.");
    // Update local states so input fields refresh instantly
    setName("Developer");
    setEmail("developer@example.com");
    setRole("Software Engineer");
    setCompany("Target Company");
  };

  const handleExportBackup = () => {
    const backupData = {
      profile,
      tasks,
      learningSkills,
      jobApplications,
      roadmaps,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CareerOS_Backup_${profile.name.replace(/\s+/g, "_")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile && parsed.tasks) {
          // Update zustand store
          useStore.setState({
            profile: parsed.profile,
            tasks: parsed.tasks,
            learningSkills: parsed.learningSkills || [],
            jobApplications: parsed.jobApplications || [],
            roadmaps: parsed.roadmaps || []
          });
          setImportStatus("Database imported successfully!");
          // Sync local input state
          setName(parsed.profile.name);
          setRole(parsed.profile.role);
          setEmail(parsed.profile.email);
          setCompany(parsed.profile.company || "");
        } else {
          setImportStatus("Invalid backup JSON schema.");
        }
      } catch (err) {
        setImportStatus("Failed to parse JSON file.");
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div id="settings-view" className="flex-1 overflow-y-auto bg-[#09090b] p-6 space-y-6 text-[#fafafa]">
      
      {/* Header */}
      <div className="border-b border-[#1f1f23] pb-5">
        <h2 className="font-sans font-bold text-2xl tracking-tight text-[#fafafa]">Settings Workspace</h2>
        <p className="text-xs text-[#71717a] font-mono mt-1">
          Adjust visual themes, update your target level credentials, and download database backups
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Profile Card */}
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>Profile Identity</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Developer Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Target Professional Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#71717a] font-mono block mb-1">Target Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#09090b] border border-[#1f1f23] focus:border-blue-500 rounded-lg p-2.5 text-xs text-[#fafafa] focus:outline-none"
                  placeholder="Stripe / Google"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors shadow"
            >
              Update Credentials
            </button>
          </form>
        </div>

        {/* Database backup card */}
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Data Protection & Backup</span>
            </h3>

            <p className="text-xs text-[#71717a] leading-relaxed">
              Export your entire CareerOS database (including study records, progress ratios, job application steps, and XP level metrics) as a JSON file, or restore a previous session file.
            </p>

            {importStatus && (
              <p className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/15">
                {importStatus}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-[#1f1f23]">
            <button
              onClick={handleExportBackup}
              className="flex items-center justify-center gap-2 bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] text-xs font-bold py-2.5 rounded-lg border border-[#27272a] cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Backup</span>
            </button>

            <label className="flex items-center justify-center gap-2 bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] text-xs font-bold py-2.5 rounded-lg border border-[#27272a] cursor-pointer text-center transition-colors">
              <Upload className="w-4 h-4" />
              <span>Restore Backup</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Aesthetics preferences panel */}
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 shadow-sm lg:col-span-1">
          <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono flex items-center gap-2">
            <Palette className="w-4 h-4 text-blue-400" />
            <span>Aesthetics Preferences</span>
          </h3>

          <div className="space-y-4 bg-[#09090b]/40 p-4 rounded-xl border border-[#1f1f23] text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-[#fafafa]">Glassmorphism Backdrops</p>
                <p className="text-[10px] text-[#71717a] mt-0.5">Applies beautiful background blur filters to cards</p>
              </div>
              <input
                type="checkbox"
                checked={glassmorphism}
                onChange={() => setGlassmorphism(!glassmorphism)}
                className="w-4 h-4 rounded border-[#27272a] bg-[#18181b] text-blue-500 focus:ring-0 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#1f1f23] pt-3">
              <div>
                <p className="font-bold text-[#fafafa]">Linear / Notion Minimalist Slate Theme</p>
                <p className="text-[10px] text-[#71717a] mt-0.5">Deep charcoal dark palette with glowing cobalt elements</p>
              </div>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/15">
                Active Default
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-[#0c0c0e] border border-red-500/20 rounded-xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-4 h-4" />
              <span>Danger Zone</span>
            </h3>

            <p className="text-xs text-[#71717a] leading-relaxed mt-1">
              Permanently wipe your profile info, tasks, roadmaps, skills, habits, resume data, and performance stats. This cannot be undone.
            </p>
          </div>

          <div className="pt-4 border-t border-[#1f1f23] flex flex-col justify-end flex-1">
            {!showConfirmClear ? (
              <button
                type="button"
                onClick={() => {
                  setShowConfirmClear(true);
                  setConfirmInput("");
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-900/30 text-red-400 text-xs font-bold py-2.5 rounded-lg border border-red-500/20 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
            ) : (
              <div className="space-y-3 animate-in fade-in duration-200">
                <p className="text-[10px] font-mono text-red-400 font-bold">
                  To confirm, please type <span className="underline select-all">RESET</span> below:
                </p>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  className="w-full bg-[#140c0c] border border-red-500/30 focus:border-red-500 rounded-lg p-2 text-xs text-red-200 focus:outline-none font-mono"
                  placeholder="Type RESET"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmClear(false)}
                    className="flex-1 bg-[#18181b] hover:bg-[#27272a] text-[#fafafa] text-[10px] font-bold py-2 rounded-lg border border-[#27272a] cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={confirmInput.trim().toUpperCase() !== "RESET"}
                    onClick={handleClearAllData}
                    className="flex-1 bg-red-600 hover:bg-red-500 disabled:bg-red-900/40 disabled:text-red-400/50 disabled:border-transparent text-white text-[10px] font-bold py-2 rounded-lg cursor-pointer transition-colors"
                  >
                    Yes, Wipe Everything
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
