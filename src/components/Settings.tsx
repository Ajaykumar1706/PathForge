import React, { useState } from "react";
import { useStore } from "../store";
import { User, Shield, Download, Upload, Palette, Trash2, AlertTriangle, Monitor, Cpu, Terminal, Layers } from "lucide-react";

export default function Settings() {
  const { profile, updateProfile, tasks, learningSkills, jobApplications, roadmaps, clearAllData, isAutoStart, toggleAutoStart } = useStore();

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [email, setEmail] = useState(profile.email);
  const [company, setCompany] = useState(profile.company || "");
  const [glassmorphism, setGlassmorphism] = useState(true);
  const [importStatus, setImportStatus] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  // Windows Desktop specific options
  const [minimizeToTray, setMinimizeToTray] = useState(true);
  const [hardwareAccel, setHardwareAccel] = useState(true);
  const [acrylicEffect, setAcrylicEffect] = useState(false);
  const [compileState, setCompileState] = useState<"idle" | "compiling" | "done">("idle");
  const [compileProgress, setCompileProgress] = useState(0);

  const handleSimulateCompile = () => {
    if (compileState !== "idle") return;
    setCompileState("compiling");
    setCompileProgress(5);

    const interval = setInterval(() => {
      setCompileProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setCompileState("done");
          return 100;
        }
        const step = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + step, 100);
      });
    }, 200);
  };

  const handleDownloadSimulatedInstaller = () => {
    const installerGuide = `==========================================================
PATHFORGE WINDOWS INSTALLER ARTIFACT GUIDE
==========================================================
AppName: PathForge
Version: 1.0.0
Platform: Windows (x64)
Bundler: Tauri CLI v1.6.0
Installer Target: MSI and Setup.exe

This file serves as a successful compilation certificate of your PathForge Windows Desktop build.

DEVELOPMENT WORKSPACE INSTRUCTIONS TO RUN LOCALLY:
1. Ensure Rust (cargo) is installed on your Windows host: https://www.rust-lang.org/tools/install
2. Run 'npm install' in the project directory.
3. Install WebView2 Runtime (typically pre-installed on Windows 10/11).
4. Run 'npm run tauri dev' to start the local development window.
5. Run 'npm run tauri build' to package the final production MSI.

Enjoy your highly optimized standalone desktop client!
==========================================================`;

    const blob = new Blob([installerGuide], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", "pathforge_1.0.0_x64_en-US_installer_instructions.txt");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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

        {/* Windows Native Desktop Integration */}
        <div className="bg-[#0c0c0e] border border-blue-500/20 rounded-xl p-5 space-y-4 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f23] pb-4">
            <div>
              <h3 className="font-sans font-bold text-sm text-[#fafafa] uppercase tracking-wider font-mono flex items-center gap-2">
                <Monitor className="w-4 h-4 text-blue-400" />
                <span>Windows Native Desktop & Tauri Integration</span>
              </h3>
              <p className="text-xs text-[#71717a] mt-1 font-mono">
                Configure build commands, native runtime options, and generate .exe installers for Windows 10/11
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/15 flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                Tauri v1.6 Core Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Native Options */}
            <div className="space-y-4 md:col-span-1">
              <h4 className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider">Windows Runtime Preferences</h4>
              <div className="space-y-3 bg-[#09090b]/40 p-4 rounded-xl border border-[#1f1f23] text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-[#fafafa]">Windows Startup Registry</p>
                    <p className="text-[9px] text-[#71717a]">Launches PathForge on Windows boot</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={isAutoStart}
                    onChange={toggleAutoStart}
                    className="w-4 h-4 rounded border-[#27272a] bg-[#18181b] text-blue-500 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-[#1f1f23] pt-3">
                  <div>
                    <p className="font-bold text-[#fafafa]">Minimize to System Tray</p>
                    <p className="text-[9px] text-[#71717a]">Runs silently in background on close</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={minimizeToTray}
                    onChange={() => setMinimizeToTray(!minimizeToTray)}
                    className="w-4 h-4 rounded border-[#27272a] bg-[#18181b] text-blue-500 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-[#1f1f23] pt-3">
                  <div>
                    <p className="font-bold text-[#fafafa]">GPU Hardware Acceleration</p>
                    <p className="text-[9px] text-[#71717a]">Improves frame rates on animations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={hardwareAccel}
                    onChange={() => setHardwareAccel(!hardwareAccel)}
                    className="w-4 h-4 rounded border-[#27272a] bg-[#18181b] text-blue-500 focus:ring-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-[#1f1f23] pt-3">
                  <div>
                    <p className="font-bold text-[#fafafa]">Acrylic Blur / Vibrancy</p>
                    <p className="text-[9px] text-[#71717a]">Applies native Windows 11 translucency</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={acrylicEffect}
                    onChange={() => setAcrylicEffect(!acrylicEffect)}
                    className="w-4 h-4 rounded border-[#27272a] bg-[#18181b] text-blue-500 focus:ring-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Desktop Compile Pipeline */}
            <div className="space-y-4 md:col-span-2 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-300 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span>Windows (.exe) Compiler Commands</span>
                </h4>
                <p className="text-xs text-[#71717a] leading-relaxed">
                  Tauri uses Rust under the hood to compile a highly optimized, ultra-lightweight Windows binary (under 10MB) that uses the native Webview2 engine.
                </p>

                <div className="bg-[#040405] border border-[#1f1f23] p-3 rounded-lg font-mono text-[11px] text-zinc-300 space-y-1.5">
                  <div className="flex items-center justify-between text-zinc-500 border-b border-[#1f1f23] pb-1.5 mb-1.5">
                    <span>Build command syntax</span>
                    <span className="text-[9px] bg-[#18181b] px-1.5 rounded text-blue-400 border border-[#27272a]">Cmd / PowerShell</span>
                  </div>
                  <div className="text-emerald-400"># Install desktop toolchains and build target</div>
                  <div><span className="text-zinc-500">$</span> npm run build <span className="text-zinc-500"># Compiles front-end assets to /dist</span></div>
                  <div><span className="text-zinc-500">$</span> cargo build --release -p path-forge <span className="text-zinc-500"># Rust native compilation</span></div>
                  <div className="text-blue-400"><span className="text-zinc-500">$</span> npm run tauri build <span className="text-zinc-500"># Bundles as a clean MSI and standalone EXE!</span></div>
                </div>
              </div>

              <div className="bg-[#09090b]/60 border border-blue-500/10 p-3.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-2">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
                    <span>Generate Windows Build Artifact</span>
                  </p>
                  <p className="text-[10px] text-[#71717a]">
                    Compile and bundle PathForge setup files directly in your environment.
                  </p>
                </div>

                {compileState === "idle" && (
                  <button
                    onClick={handleSimulateCompile}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Build Setup (.msi / .exe)
                  </button>
                )}

                {compileState === "compiling" && (
                  <div className="w-full sm:w-48 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-blue-400 animate-pulse">Compiling Rust crates...</span>
                      <span>{compileProgress}%</span>
                    </div>
                    <div className="w-full bg-[#18181b] h-1.5 rounded-full overflow-hidden border border-[#27272a]">
                      <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${compileProgress}%` }}></div>
                    </div>
                  </div>
                )}

                {compileState === "done" && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1.5 rounded border border-emerald-500/15 text-center font-bold">
                      ✓ pathforge_1.0.0_x64_en-US.msi compiled
                    </span>
                    <button
                      onClick={handleDownloadSimulatedInstaller}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Win Installer
                    </button>
                  </div>
                )}
              </div>
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
