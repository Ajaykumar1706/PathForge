import React, { useState } from "react";
import { useStore } from "../store";
import {
  User,
  Shield,
  Download,
  Upload,
  Palette,
  Trash2,
  AlertTriangle,
  Globe,
  Copy,
  Check,
  Share2,
  Sun,
  Moon,
  Monitor,
  Layout,
  RefreshCw,
  Sliders
} from "lucide-react";

export default function Settings() {
  const {
    profile,
    updateProfile,
    tasks,
    learningSkills,
    jobApplications,
    roadmaps,
    habits,
    projects,
    resumeVersions,
    plannerSlots,
    interviewQuestions,
    clearAllData,
    theme,
    setTheme,
    toggleTheme,
    density,
    setDensity,
    resetUserSession
  } = useStore();

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [email, setEmail] = useState(profile.email);
  const [company, setCompany] = useState(profile.company || "");
  const [importStatus, setImportStatus] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyShareLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    });
  };

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
      habits,
      projects,
      resumeVersions,
      plannerSlots,
      interviewQuestions,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `PathForge_Backup_${profile.name.replace(/\s+/g, "_")}.json`);
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
            roadmaps: parsed.roadmaps || [],
            habits: parsed.habits || [],
            projects: parsed.projects || [],
            resumeVersions: parsed.resumeVersions || [],
            plannerSlots: parsed.plannerSlots || [],
            interviewQuestions: parsed.interviewQuestions || []
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
              Export your entire PathForge database (including study records, progress ratios, job application steps, and XP level metrics) as a JSON file, or restore a previous session file.
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

        {/* Personal Web Viewing Experience preferences panel */}
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 shadow-sm lg:col-span-1">
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-400" />
              <span>Viewing Experience</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Personalized
            </span>
          </div>

          <div className="space-y-4 bg-[#09090b]/40 p-4 rounded-xl border border-[#1f1f23] text-xs">
            {/* Theme Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#fafafa]">Interface Theme</p>
                <span className="text-[10px] font-mono text-blue-400 uppercase">
                  {theme} mode
                </span>
              </div>
              <p className="text-[11px] text-[#71717a]">
                Choose your preferred canvas. Changes take effect instantly and stay saved for your browser.
              </p>
              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    theme === "dark"
                      ? "bg-blue-600/20 border-blue-500 text-white font-bold"
                      : "bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white hover:bg-[#222226]"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dark</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    theme === "light"
                      ? "bg-amber-500/20 border-amber-500 text-amber-500 font-bold"
                      : "bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white hover:bg-[#222226]"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`flex flex-col items-center justify-center gap-1.5 py-2 px-1 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    theme === "system"
                      ? "bg-indigo-600/20 border-indigo-500 text-indigo-400 font-bold"
                      : "bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white hover:bg-[#222226]"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                  <span>System</span>
                </button>
              </div>
            </div>

            {/* Layout Density */}
            <div className="border-t border-[#1f1f23] pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[#fafafa]">Layout Density</p>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  {density}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDensity("normal")}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    density === "normal"
                      ? "bg-blue-600/20 border-blue-500 text-white font-bold"
                      : "bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white hover:bg-[#222226]"
                  }`}
                >
                  Comfortable
                </button>
                <button
                  type="button"
                  onClick={() => setDensity("compact")}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    density === "compact"
                      ? "bg-blue-600/20 border-blue-500 text-white font-bold"
                      : "bg-[#18181b] border-[#27272a] text-zinc-400 hover:text-white hover:bg-[#222226]"
                  }`}
                >
                  Compact
                </button>
              </div>
            </div>

            {/* Individual Client Storage Notice */}
            <div className="border-t border-[#1f1f23] pt-3">
              <div className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#71717a] leading-relaxed">
                  Your viewing preferences and data are stored locally in your browser session. Other connected users have their own independent workspace.
                </p>
              </div>
            </div>

            {/* Reset Client Session */}
            <div className="border-t border-[#1f1f23] pt-3">
              <button
                type="button"
                onClick={resetUserSession}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                title="Reset your personal browser session back to default settings"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset My Web Experience</span>
              </button>
            </div>
          </div>
        </div>

        {/* Web Hosting & Sharing Information */}
        <div className="bg-[#0c0c0e] border border-[#1f1f23] rounded-xl p-5 space-y-4 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f23] pb-4">
            <div>
              <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Web Deployment & Quick Access</span>
              </h3>
              <p className="text-xs text-[#71717a] mt-1 font-mono">
                Accessible directly from any modern web browser on desktop, tablet, or phone
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/15 flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                Web Ready • React + Vite
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-[#09090b]/60 border border-[#1f1f23] p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Share2 className="w-4 h-4 text-blue-400" />
                <span>Share with Others</span>
              </div>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Anyone can open this web application in their browser. Personal data (tasks, habits, roadmaps) is safely stored in local browser storage, so each user gets their own dedicated workspace.
              </p>
              <button
                onClick={handleCopyShareLink}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                <span>{copiedUrl ? "Link Copied to Clipboard!" : "Copy Web App Link"}</span>
              </button>
            </div>

            <div className="bg-[#09090b]/60 border border-[#1f1f23] p-4 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Zero-Friction Access</span>
              </div>
              <ul className="text-xs text-[#71717a] space-y-1.5 leading-relaxed">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Runs instantly with no downloads or installation required</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Fully responsive across smartphones, tablets, and desktop</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Export & import JSON anytime to transfer data between devices</span>
                </li>
              </ul>
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
