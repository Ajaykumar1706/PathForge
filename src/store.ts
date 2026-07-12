import { create } from "zustand";
import {
  Task,
  TaskStatus,
  TaskPriority,
  TaskDifficulty,
  UserProfile,
  PlannerSlot,
  CareerRoadmap,
  LearningSkill,
  CareerProject,
  Habit,
  ResumeVersion,
  InterviewPrepQuestion,
  JobApplication,
  PomodoroSession,
  DailyPriority
} from "./types";

interface CareerOSState {
  profile: UserProfile;
  tasks: Task[];
  plannerSlots: PlannerSlot[];
  roadmaps: CareerRoadmap[];
  learningSkills: LearningSkill[];
  projects: CareerProject[];
  habits: Habit[];
  resumeVersions: ResumeVersion[];
  interviewQuestions: InterviewPrepQuestion[];
  jobApplications: JobApplication[];
  pomodoroSessions: PomodoroSession[];
  activeTab: string;
  isAiLoading: boolean;
  theme: "dark" | "light";
  isAutoStart: boolean;
  notifications: Array<{ id: string; text: string; timestamp: string; type: "info" | "success" | "warning" | "update" }>;
  dailyPriorities: DailyPriority[];

  // Profile actions
  updateProfile: (updates: Partial<UserProfile>) => void;
  gainXP: (amount: number) => void;

  // Theme & App actions
  toggleTheme: () => void;
  toggleAutoStart: () => void;
  addNotification: (text: string, type?: "info" | "success" | "warning" | "update") => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;

  // Daily Priorities actions
  addDailyPriority: (text: string, xpValue?: number) => void;
  toggleDailyPriority: (id: string) => void;
  updateDailyPriority: (id: string, text: string) => void;
  deleteDailyPriority: (id: string) => void;

  // Task actions
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  // Planner actions
  setPlannerSlots: (slots: PlannerSlot[]) => void;
  addPlannerSlot: (slot: PlannerSlot) => void;
  deletePlannerSlot: (time: string) => void;

  // Roadmap actions
  addRoadmap: (roadmap: Omit<CareerRoadmap, "id">) => void;
  updateRoadmap: (id: string, updates: Partial<CareerRoadmap>) => void;
  deleteRoadmap: (id: string) => void;
  toggleMilestone: (roadmapId: string, milestoneId: string) => void;

  // Learning actions
  addSkill: (skill: Omit<LearningSkill, "id">) => void;
  updateSkill: (id: string, updates: Partial<LearningSkill>) => void;
  deleteSkill: (id: string) => void;
  addResourceToSkill: (skillId: string, resource: { title: string; type: any; url?: string }) => void;
  toggleResourceCompleted: (skillId: string, resourceId: string) => void;

  // Project actions
  addProject: (project: Omit<CareerProject, "id">) => void;
  updateProject: (id: string, updates: Partial<CareerProject>) => void;
  deleteProject: (id: string) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;

  // Habit actions
  toggleHabitDate: (id: string, dateStr: string) => void;
  addHabit: (name: string, frequency?: "daily" | "weekly") => void;
  deleteHabit: (id: string) => void;

  // Resume actions
  addResumeVersion: (title: string, notes?: string) => void;
  updateResumeVersion: (id: string, updates: Partial<ResumeVersion>) => void;
  deleteResumeVersion: (id: string) => void;

  // Interview actions
  addInterviewQuestion: (question: Omit<InterviewPrepQuestion, "id">) => void;
  updateInterviewQuestion: (id: string, updates: Partial<InterviewPrepQuestion>) => void;
  deleteInterviewQuestion: (id: string) => void;

  // Job Application actions
  addJobApplication: (app: Omit<JobApplication, "id">) => void;
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteJobApplication: (id: string) => void;

  // Focus actions
  addPomodoroSession: (session: Omit<PomodoroSession, "id">) => void;

  // Navigation action
  setActiveTab: (tab: string) => void;
  setAiLoading: (loading: boolean) => void;
  clearAllData: () => void;
}

// Helper to calculate Level and Career Score based on XP and overall metrics
const calculateLevel = (xp: number) => {
  // Simple: Level 1 = 0-1000 XP, Level 2 = 1000-2500 XP, Level 3 = 2500-5000 XP, etc.
  if (xp < 1000) return 1;
  if (xp < 2500) return 2;
  if (xp < 5000) return 3;
  if (xp < 9000) return 4;
  return 5 + Math.floor((xp - 9000) / 5000);
};

// Initial Seed Data for user profile
const initialProfile: UserProfile = {
  name: "New Developer",
  email: "developer@example.com",
  role: "Software Engineer",
  company: "Target Company",
  focusGoal: "Complete SQL Performance Optimization",
  xp: 1850, // Level 2
  level: 2,
  streak: 14,
  careerScore: 78,
  focusTimeToday: 75,
  focusTimeWeek: 310,
  focusTimeMonth: 1240,
  completedTasksCount: 42
};

const initialTasks: Task[] = [
  {
    id: "t1",
    title: "SQL Performance Optimization",
    description: "Analyze and optimize queries for database caching system.",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    difficulty: TaskDifficulty.HARD,
    category: "SQL",
    estimatedTime: 90,
    actualTime: 45,
    dueDate: "2026-07-12",
    tags: ["Database", "SQL", "Optimization"],
    createdAt: new Date().toISOString(),
    notes: "Review explain plan and index utilization on user tables."
  },
  {
    id: "t2",
    title: "Azure AI Fundamentals Review",
    description: "Go over cognitive services and setup AI search indexing.",
    status: TaskStatus.NOT_STARTED,
    priority: TaskPriority.MEDIUM,
    difficulty: TaskDifficulty.MEDIUM,
    category: "Azure AI",
    estimatedTime: 60,
    actualTime: 0,
    dueDate: "2026-07-12",
    tags: ["Cloud", "Azure", "AI Services"],
    createdAt: new Date().toISOString()
  },
  {
    id: "t3",
    title: "Python Automation Engine Setup",
    description: "Draft automation scripts to process excel files to server.",
    status: TaskStatus.NOT_STARTED,
    priority: TaskPriority.LOW,
    difficulty: TaskDifficulty.EASY,
    category: "Python Automation",
    estimatedTime: 45,
    actualTime: 0,
    dueDate: "2026-07-12",
    tags: ["Scripting", "Python", "Automation"],
    createdAt: new Date().toISOString()
  },
  {
    id: "t4",
    title: "DSA Graph Algorithms Practice",
    description: "Solve BFS, DFS, and Dijkstra's algorithm challenges.",
    status: TaskStatus.NOT_STARTED,
    priority: TaskPriority.HIGH,
    difficulty: TaskDifficulty.HARD,
    category: "Interview Prep",
    estimatedTime: 120,
    actualTime: 0,
    dueDate: "2026-07-13",
    tags: ["LeetCode", "DSA", "Graphs"],
    createdAt: new Date().toISOString()
  },
  {
    id: "t5",
    title: "Tailwind UI Redesign for Resume Portal",
    description: "Rebuild custom header & mobile sidebar using grid layouts.",
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.MEDIUM,
    difficulty: TaskDifficulty.MEDIUM,
    category: "Project",
    estimatedTime: 90,
    actualTime: 80,
    dueDate: "2026-07-11",
    tags: ["Frontend", "React", "Tailwind"],
    createdAt: new Date().toISOString()
  },
  {
    id: "t6",
    title: "Prepare System Design - Rate Limiter",
    description: "Study Token Bucket vs Leaky Bucket algorithms and cache storage.",
    status: TaskStatus.NOT_STARTED,
    priority: TaskPriority.HIGH,
    difficulty: TaskDifficulty.HARD,
    category: "Interview Prep",
    estimatedTime: 90,
    actualTime: 0,
    dueDate: "2026-07-14",
    tags: ["System Design", "Scalability", "Redis"],
    createdAt: new Date().toISOString()
  },
  {
    id: "t7",
    title: "Clean Up Github Repo Portfolio Pages",
    description: "Add README, license files, and project demo links.",
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.LOW,
    difficulty: TaskDifficulty.EASY,
    category: "Project",
    estimatedTime: 40,
    actualTime: 15,
    dueDate: "2026-07-12",
    tags: ["GitHub", "Portfolio"],
    createdAt: new Date().toISOString()
  },
  {
    id: "t8",
    title: "Submit Azure Certificate Application",
    description: "Complete formal application upload with transcripts.",
    status: TaskStatus.NOT_STARTED,
    priority: TaskPriority.MEDIUM,
    difficulty: TaskDifficulty.EASY,
    category: "Learning",
    estimatedTime: 15,
    actualTime: 0,
    dueDate: "2026-07-12",
    tags: ["Certification", "Azure"],
    createdAt: new Date().toISOString()
  }
];

const initialPlannerSlots: PlannerSlot[] = [
  { time: "08:00", label: "Exercise" },
  { time: "09:00", label: "Office Job" },
  { time: "18:30", label: "Learn SQL Queries", taskId: "t1" },
  { time: "20:00", label: "Build PathForge Project", taskId: "t5" },
  { time: "22:00", label: "Read Tech Articles" }
];

const initialRoadmaps: CareerRoadmap[] = [
  {
    id: "r1",
    title: "Become AI Engineer",
    description: "Full professional track from backend to prompt engineering and modern LLMs",
    progress: 35,
    createdAt: new Date().toISOString(),
    milestones: [
      {
        id: "m1",
        title: "Python & Advanced Notebooks",
        description: "Pandas, NumPy, and local notebooks setup",
        isCompleted: true,
        dueDate: "2026-05-15"
      },
      {
        id: "m2",
        title: "SQL & Vector Databases",
        description: "Postgres and pgvector indexing with embeddings",
        isCompleted: true,
        dueDate: "2026-06-20"
      },
      {
        id: "m3",
        title: "LLM APIs & Frameworks",
        description: "LangChain, Gemini SDK Integration, Prompt Engineering",
        isCompleted: false,
        dueDate: "2026-07-25"
      },
      {
        id: "m4",
        title: "Fine-Tuning & Local Models",
        description: "Hugging Face, LoRA tuning, and Ollama integration",
        isCompleted: false,
        dueDate: "2026-08-30"
      }
    ]
  }
];

const initialSkills: LearningSkill[] = [
  {
    id: "s1",
    name: "Python",
    progress: 85,
    hoursLearned: 120,
    revisionDate: "2026-07-15",
    resources: [
      { id: "s1-r1", title: "Automate the Boring Stuff with Python", type: "Book", isCompleted: true },
      { id: "s1-r2", title: "Python Advanced Concurrency & Asyncio", type: "Video", isCompleted: false },
      { id: "s1-r3", title: "Practice Challenges on Algorithms", type: "Practice", isCompleted: true }
    ],
    notes: "Key concepts to remember: Generators, Context Managers, Decorators."
  },
  {
    id: "s2",
    name: "SQL & PostgreSQL",
    progress: 75,
    hoursLearned: 45,
    revisionDate: "2026-07-12",
    resources: [
      { id: "s2-r1", title: "SQL Indexing and Query Tuning", type: "Course", isCompleted: true },
      { id: "s2-r2", title: "PostgreSQL High Performance", type: "Book", isCompleted: false }
    ],
    notes: "Review query plans, partition tables, and indexing guidelines."
  },
  {
    id: "s3",
    name: "Azure & AI Search",
    progress: 50,
    hoursLearned: 22,
    revisionDate: "2026-07-18",
    resources: [
      { id: "s3-r1", title: "Azure AI Search Setup and Config", type: "Course", isCompleted: false },
      { id: "s3-r2", title: "Cognitive Services Overview", type: "Article", isCompleted: true }
    ],
    notes: "Focus heavily on Semantic Search features."
  }
];

const initialProjects: CareerProject[] = [
  {
    id: "p1",
    name: "PathForge Portal",
    description: "An offline-first operating system for software engineers to track growth.",
    techStack: ["React 19", "Vite", "Zustand", "Tailwind CSS", "Lucide Icons"],
    gitHubUrl: "https://github.com/yourusername/pathforge",
    liveUrl: "https://pathforge-preview.vercel.app",
    progress: 45,
    deploymentStatus: "success",
    notes: "Next step is implementing beautiful calendar scheduling and Gemini integrations.",
    milestones: [
      { id: "p1-m1", title: "Define layout and core database model", isCompleted: true },
      { id: "p1-m2", title: "Implement Kanban Task Board with local storage", isCompleted: true },
      { id: "p1-m3", title: "Connect server-side Gemini AI assistance", isCompleted: false },
      { id: "p1-m4", title: "Export to resume PDF review module", isCompleted: false }
    ]
  }
];

const initialHabits: Habit[] = [
  {
    id: "h1",
    name: "Exercise",
    streak: 5,
    frequency: "daily",
    history: {
      "2026-07-11": true,
      "2026-07-12": true,
      "2026-07-10": true,
      "2026-07-09": true,
      "2026-07-08": true
    }
  },
  {
    id: "h2",
    name: "Meditation",
    streak: 0,
    frequency: "daily",
    history: {
      "2026-07-11": false,
      "2026-07-12": false
    }
  },
  {
    id: "h3",
    name: "Python Coding",
    streak: 8,
    frequency: "daily",
    history: {
      "2026-07-12": true,
      "2026-07-11": true,
      "2026-07-10": true,
      "2026-07-09": true,
      "2026-07-08": true,
      "2026-07-07": true,
      "2026-07-06": true,
      "2026-07-05": true
    }
  },
  {
    id: "h4",
    name: "Drink 3L Water",
    streak: 3,
    frequency: "daily",
    history: {
      "2026-07-12": true,
      "2026-07-11": true,
      "2026-07-10": true
    }
  }
];

const initialResumes: ResumeVersion[] = [
  {
    id: "res1",
    title: "SDE_Resume_Backend_v1.pdf",
    lastUpdated: "2026-07-10",
    isFavorite: true,
    notes: "Standard PDF optimized for backend systems & cloud. Contains engineering experience.",
    aiReviewScore: 82,
    aiReviewFeedback: "Strong action verbs. Suggest adding more metrics under experience section (e.g. % performance speedups, cloud cost reduction)."
  }
];

const initialInterviewQuestions: InterviewPrepQuestion[] = [
  {
    id: "q1",
    company: "Google",
    round: "Technical Screen",
    category: "DSA",
    question: "Design a data structure that implements an LRU (Least Recently Used) Cache.",
    answer: "Uses a combination of a Doubly Linked List and a HashMap for O(1) lookups and insertions.",
    difficulty: "Medium",
    isReviewed: true
  },
  {
    id: "q2",
    company: "Stripe",
    round: "Systems Design",
    category: "System Design",
    question: "Design an API Rate Limiter that supports multiple pricing plans.",
    answer: "Can be modeled with Redis using Token Bucket algorithm. Redis sorted sets handle sliding window logs elegantly.",
    difficulty: "Hard",
    isReviewed: false
  },
  {
    id: "q3",
    company: "Netflix",
    round: "Managerial Round",
    category: "Behavioral",
    question: "Tell me about a time you resolved a major production outage under heavy pressure.",
    starSituation: "Our microservice handling stream analytics went down during peak weekend hours, causing user telemetry delays.",
    starTask: "I had to coordinate a fix while keeping stakeholders updated and restoring indexing speed.",
    starAction: "I spun up temporary read replicas, isolated corrupted log segments, and hot-patched the query cache leak.",
    starResult: "Restored service in 22 minutes, added visual dashboards for active telemetry, and reduced future failover time by 80%.",
    difficulty: "Hard",
    isReviewed: true
  }
];

const initialJobApplications: JobApplication[] = [
  {
    id: "a1",
    company: "Amazon",
    role: "Senior Backend Engineer",
    salary: "$180,000 - $210,000",
    location: "Seattle, WA (Hybrid)",
    status: "Technical",
    appliedDate: "2026-07-01",
    interviewDate: "2026-07-15",
    notes: "Completed online assessment. Up next: Virtual Onsite with 3 Coding and 1 System Design round."
  },
  {
    id: "a2",
    company: "Vercel",
    role: "Frontend Systems Specialist",
    salary: "$190,000",
    location: "Remote (US)",
    status: "HR",
    appliedDate: "2026-07-05",
    interviewDate: "2026-07-13",
    notes: "Introductory chat scheduled with lead recruiter."
  }
];

const initialDailyPriorities: DailyPriority[] = [
  { id: "sql", text: "SQL Performance Optimization Project", completed: false, xpValue: 100 },
  { id: "azure", text: "Azure AI Cognitive Search Study", completed: false, xpValue: 100 },
  { id: "python", text: "Python Automation Engine Script", completed: false, xpValue: 100 }
];

// Combine state from localStorage or seed fallback
const loadSavedState = (): Partial<CareerOSState> => {
  try {
    const saved = localStorage.getItem("careeros_state_v1");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error loading localStorage careeros state:", e);
  }
  return {};
};

const saveState = (state: any) => {
  try {
    localStorage.setItem("careeros_state_v1", JSON.stringify({
      profile: state.profile,
      tasks: state.tasks,
      plannerSlots: state.plannerSlots,
      roadmaps: state.roadmaps,
      learningSkills: state.learningSkills,
      projects: state.projects,
      habits: state.habits,
      resumeVersions: state.resumeVersions,
      interviewQuestions: state.interviewQuestions,
      jobApplications: state.jobApplications,
      pomodoroSessions: state.pomodoroSessions,
      activeTab: state.activeTab,
      theme: state.theme,
      isAutoStart: state.isAutoStart,
      notifications: state.notifications,
      dailyPriorities: state.dailyPriorities
    }));
  } catch (e) {
    console.error("Error saving state to localStorage:", e);
  }
};

export const useStore = create<CareerOSState>((set, get) => {
  const loaded = loadSavedState();

  return {
    profile: loaded.profile || initialProfile,
    tasks: loaded.tasks || initialTasks,
    plannerSlots: loaded.plannerSlots || initialPlannerSlots,
    roadmaps: loaded.roadmaps || initialRoadmaps,
    learningSkills: loaded.learningSkills || initialSkills,
    projects: loaded.projects || initialProjects,
    habits: loaded.habits || initialHabits,
    resumeVersions: loaded.resumeVersions || initialResumes,
    interviewQuestions: loaded.interviewQuestions || initialInterviewQuestions,
    jobApplications: loaded.jobApplications || initialJobApplications,
    pomodoroSessions: loaded.pomodoroSessions || [],
    activeTab: loaded.activeTab || "dashboard",
    isAiLoading: false,
    theme: loaded.theme || "dark",
    isAutoStart: loaded.isAutoStart !== undefined ? loaded.isAutoStart : true,
    notifications: loaded.notifications || [
      { id: "init-1", text: "Welcome to PathForge Workspace! Offline SQLite Engine Sync nominal.", timestamp: "14:40", type: "info" },
      { id: "init-2", text: "SQL Performance Optimization task has a High Priority today.", timestamp: "14:42", type: "warning" }
    ],
    dailyPriorities: loaded.dailyPriorities || initialDailyPriorities,

    updateProfile: (updates) => set((state) => {
      const nextProfile = { ...state.profile, ...updates };
      const next = { ...state, profile: nextProfile };
      saveState(next);
      return { profile: nextProfile };
    }),

    toggleTheme: () => set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      const next = { ...state, theme: nextTheme };
      saveState(next);
      return { theme: nextTheme };
    }),

    toggleAutoStart: () => set((state) => {
      const nextAuto = !state.isAutoStart;
      const next = { ...state, isAutoStart: nextAuto };
      saveState(next);
      return { isAutoStart: nextAuto };
    }),

    addNotification: (text, type = "info") => set((state) => {
      const newNotif = {
        id: "n_" + Math.random().toString(36).substring(2, 9),
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type
      };
      const nextNotifs = [newNotif, ...state.notifications].slice(0, 30);
      const next = { ...state, notifications: nextNotifs };
      saveState(next);
      return { notifications: nextNotifs };
    }),

    clearNotifications: () => set((state) => {
      const next = { ...state, notifications: [] };
      saveState(next);
      return { notifications: [] };
    }),

    removeNotification: (id) => set((state) => {
      const nextNotifs = state.notifications.filter((n) => n.id !== id);
      const next = { ...state, notifications: nextNotifs };
      saveState(next);
      return { notifications: nextNotifs };
    }),

    addDailyPriority: (text, xpValue = 100) => set((state) => {
      const newPriority: DailyPriority = {
        id: "dp_" + Math.random().toString(36).substring(2, 9),
        text,
        completed: false,
        xpValue
      };
      const nextPriorities = [...state.dailyPriorities, newPriority];
      const next = { ...state, dailyPriorities: nextPriorities };
      saveState(next);
      return { dailyPriorities: nextPriorities };
    }),

    toggleDailyPriority: (id) => set((state) => {
      let xpDelta = 0;
      const nextPriorities = state.dailyPriorities.map((p) => {
        if (p.id === id) {
          const nextCompleted = !p.completed;
          xpDelta = nextCompleted ? p.xpValue : -p.xpValue;
          return { ...p, completed: nextCompleted };
        }
        return p;
      });
      
      const currentXp = state.profile.xp;
      const nextXp = Math.max(0, currentXp + xpDelta);
      const nextLevel = calculateLevel(nextXp);
      const nextProfile = {
        ...state.profile,
        xp: nextXp,
        level: nextLevel
      };

      const next = { ...state, dailyPriorities: nextPriorities, profile: nextProfile };
      saveState(next);
      return { dailyPriorities: nextPriorities, profile: nextProfile };
    }),

    updateDailyPriority: (id, text) => set((state) => {
      const nextPriorities = state.dailyPriorities.map((p) => 
        p.id === id ? { ...p, text } : p
      );
      const next = { ...state, dailyPriorities: nextPriorities };
      saveState(next);
      return { dailyPriorities: nextPriorities };
    }),

    deleteDailyPriority: (id) => set((state) => {
      const nextPriorities = state.dailyPriorities.filter((p) => p.id !== id);
      const next = { ...state, dailyPriorities: nextPriorities };
      saveState(next);
      return { dailyPriorities: nextPriorities };
    }),

    gainXP: (amount) => set((state) => {
      const nextXp = state.profile.xp + amount;
      const nextLevel = calculateLevel(nextXp);
      const levelUp = nextLevel > state.profile.level;
      const nextProfile = {
        ...state.profile,
        xp: nextXp,
        level: nextLevel
      };
      const next = { ...state, profile: nextProfile };
      saveState(next);
      return { profile: nextProfile };
    }),

    addTask: (taskInput) => set((state) => {
      const newTask: Task = {
        ...taskInput,
        id: "t_" + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
      const nextTasks = [newTask, ...state.tasks];
      const next = { ...state, tasks: nextTasks };
      saveState(next);
      return { tasks: nextTasks };
    }),

    updateTask: (id, updates) => set((state) => {
      const nextTasks = state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
      const next = { ...state, tasks: nextTasks };
      saveState(next);
      return { tasks: nextTasks };
    }),

    deleteTask: (id) => set((state) => {
      const nextTasks = state.tasks.filter((t) => t.id !== id);
      const next = { ...state, tasks: nextTasks };
      saveState(next);
      return { tasks: nextTasks };
    }),

    toggleTaskStatus: (id) => set((state) => {
      let isXpGained = false;
      const nextTasks = state.tasks.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === TaskStatus.COMPLETED ? TaskStatus.NOT_STARTED : TaskStatus.COMPLETED;
          if (nextStatus === TaskStatus.COMPLETED) {
            isXpGained = true;
          }
          return { ...t, status: nextStatus };
        }
        return t;
      });

      // Update completed counter and potentially reward XP
      let nextProfile = { ...state.profile };
      if (isXpGained) {
        nextProfile.completedTasksCount += 1;
        nextProfile.xp += 150; // reward 150 XP per completed task
        nextProfile.level = calculateLevel(nextProfile.xp);
      } else {
        nextProfile.completedTasksCount = Math.max(0, nextProfile.completedTasksCount - 1);
        nextProfile.xp = Math.max(0, nextProfile.xp - 150);
        nextProfile.level = calculateLevel(nextProfile.xp);
      }

      const next = { ...state, tasks: nextTasks, profile: nextProfile };
      saveState(next);
      return { tasks: nextTasks, profile: nextProfile };
    }),

    setPlannerSlots: (slots) => set((state) => {
      const next = { ...state, plannerSlots: slots };
      saveState(next);
      return { plannerSlots: slots };
    }),

    addPlannerSlot: (slot) => set((state) => {
      const nextSlots = [...state.plannerSlots, slot].sort((a, b) => a.time.localeCompare(b.time));
      const next = { ...state, plannerSlots: nextSlots };
      saveState(next);
      return { plannerSlots: nextSlots };
    }),

    deletePlannerSlot: (time) => set((state) => {
      const nextSlots = state.plannerSlots.filter((s) => s.time !== time);
      const next = { ...state, plannerSlots: nextSlots };
      saveState(next);
      return { plannerSlots: nextSlots };
    }),

    addRoadmap: (roadmap) => set((state) => {
      const newRoadmap: CareerRoadmap = {
        ...roadmap,
        id: "r_" + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
      const nextRoadmaps = [...state.roadmaps, newRoadmap];
      const next = { ...state, roadmaps: nextRoadmaps };
      saveState(next);
      return { roadmaps: nextRoadmaps };
    }),

    updateRoadmap: (id, updates) => set((state) => {
      const nextRoadmaps = state.roadmaps.map((r) => (r.id === id ? { ...r, ...updates } : r));
      const next = { ...state, roadmaps: nextRoadmaps };
      saveState(next);
      return { roadmaps: nextRoadmaps };
    }),

    deleteRoadmap: (id) => set((state) => {
      const nextRoadmaps = state.roadmaps.filter((r) => r.id !== id);
      const next = { ...state, roadmaps: nextRoadmaps };
      saveState(next);
      return { roadmaps: nextRoadmaps };
    }),

    toggleMilestone: (roadmapId, milestoneId) => set((state) => {
      const nextRoadmaps = state.roadmaps.map((r) => {
        if (r.id === roadmapId) {
          const nextMilestones = r.milestones.map((m) => {
            if (m.id === milestoneId) {
              return { ...m, isCompleted: !m.isCompleted };
            }
            return m;
          });
          // calculate new progress %
          const completedCount = nextMilestones.filter((m) => m.isCompleted).length;
          const progress = Math.round((completedCount / nextMilestones.length) * 100) || 0;
          return { ...r, milestones: nextMilestones, progress };
        }
        return r;
      });
      const next = { ...state, roadmaps: nextRoadmaps };
      saveState(next);
      return { roadmaps: nextRoadmaps };
    }),

    addSkill: (skill) => set((state) => {
      const newSkill: LearningSkill = {
        ...skill,
        id: "s_" + Math.random().toString(36).substr(2, 9)
      };
      const nextSkills = [...state.learningSkills, newSkill];
      const next = { ...state, learningSkills: nextSkills };
      saveState(next);
      return { learningSkills: nextSkills };
    }),

    updateSkill: (id, updates) => set((state) => {
      const nextSkills = state.learningSkills.map((s) => (s.id === id ? { ...s, ...updates } : s));
      const next = { ...state, learningSkills: nextSkills };
      saveState(next);
      return { learningSkills: nextSkills };
    }),

    deleteSkill: (id) => set((state) => {
      const nextSkills = state.learningSkills.filter((s) => s.id !== id);
      const next = { ...state, learningSkills: nextSkills };
      saveState(next);
      return { learningSkills: nextSkills };
    }),

    addResourceToSkill: (skillId, resource) => set((state) => {
      const nextSkills = state.learningSkills.map((s) => {
        if (s.id === skillId) {
          const newResource = {
            id: "res_" + Math.random().toString(36).substr(2, 9),
            ...resource,
            isCompleted: false
          };
          const resources = [...s.resources, newResource];
          // Recalculate progress
          const comp = resources.filter((r) => r.isCompleted).length;
          const progress = Math.round((comp / resources.length) * 100) || 0;
          return { ...s, resources, progress };
        }
        return s;
      });
      const next = { ...state, learningSkills: nextSkills };
      saveState(next);
      return { learningSkills: nextSkills };
    }),

    toggleResourceCompleted: (skillId, resourceId) => set((state) => {
      const nextSkills = state.learningSkills.map((s) => {
        if (s.id === skillId) {
          const resources = s.resources.map((r) => (r.id === resourceId ? { ...r, isCompleted: !r.isCompleted } : r));
          const comp = resources.filter((r) => r.isCompleted).length;
          const progress = Math.round((comp / resources.length) * 100) || 0;
          return { ...s, resources, progress };
        }
        return s;
      });
      const next = { ...state, learningSkills: nextSkills };
      saveState(next);
      return { learningSkills: nextSkills };
    }),

    addProject: (project) => set((state) => {
      const newProject: CareerProject = {
        ...project,
        id: "p_" + Math.random().toString(36).substr(2, 9)
      };
      const nextProjects = [...state.projects, newProject];
      const next = { ...state, projects: nextProjects };
      saveState(next);
      return { projects: nextProjects };
    }),

    updateProject: (id, updates) => set((state) => {
      const nextProjects = state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
      const next = { ...state, projects: nextProjects };
      saveState(next);
      return { projects: nextProjects };
    }),

    deleteProject: (id) => set((state) => {
      const nextProjects = state.projects.filter((p) => p.id !== id);
      const next = { ...state, projects: nextProjects };
      saveState(next);
      return { projects: nextProjects };
    }),

    toggleProjectMilestone: (projectId, milestoneId) => set((state) => {
      const nextProjects = state.projects.map((p) => {
        if (p.id === projectId) {
          const milestones = p.milestones.map((m) => (m.id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m));
          const completedCount = milestones.filter((m) => m.isCompleted).length;
          const progress = Math.round((completedCount / milestones.length) * 100) || 0;
          return { ...p, milestones, progress };
        }
        return p;
      });
      const next = { ...state, projects: nextProjects };
      saveState(next);
      return { projects: nextProjects };
    }),

    toggleHabitDate: (id, dateStr) => set((state) => {
      let isChecking = false;
      const nextHabits = state.habits.map((h) => {
        if (h.id === id) {
          const currentVal = !!h.history[dateStr];
          isChecking = !currentVal;
          const nextHistory = { ...h.history, [dateStr]: isChecking };

          // recalculate simple streak
          let currentStreak = h.streak;
          if (isChecking) {
            currentStreak += 1;
          } else {
            currentStreak = Math.max(0, currentStreak - 1);
          }

          return { ...h, history: nextHistory, streak: currentStreak };
        }
        return h;
      });

      // Award XP for completing high priority habits
      let nextProfile = { ...state.profile };
      if (isChecking) {
        nextProfile.xp += 50; // reward 50 XP
        nextProfile.level = calculateLevel(nextProfile.xp);
      } else {
        nextProfile.xp = Math.max(0, nextProfile.xp - 50);
        nextProfile.level = calculateLevel(nextProfile.xp);
      }

      const next = { ...state, habits: nextHabits, profile: nextProfile };
      saveState(next);
      return { habits: nextHabits, profile: nextProfile };
    }),

    addHabit: (name, frequency = "daily") => set((state) => {
      const newHabit: Habit = {
        id: "h_" + Math.random().toString(36).substr(2, 9),
        name,
        streak: 0,
        frequency,
        history: {}
      };
      const nextHabits = [...state.habits, newHabit];
      const next = { ...state, habits: nextHabits };
      saveState(next);
      return { habits: nextHabits };
    }),

    deleteHabit: (id) => set((state) => {
      const nextHabits = state.habits.filter((h) => h.id !== id);
      const next = { ...state, habits: nextHabits };
      saveState(next);
      return { habits: nextHabits };
    }),

    addResumeVersion: (title, notes) => set((state) => {
      const newResume: ResumeVersion = {
        id: "res_" + Math.random().toString(36).substr(2, 9),
        title,
        lastUpdated: new Date().toISOString().split("T")[0],
        isFavorite: false,
        notes
      };
      const nextResumes = [newResume, ...state.resumeVersions];
      const next = { ...state, resumeVersions: nextResumes };
      saveState(next);
      return { resumeVersions: nextResumes };
    }),

    updateResumeVersion: (id, updates) => set((state) => {
      const nextResumes = state.resumeVersions.map((r) => (r.id === id ? { ...r, ...updates } : r));
      const next = { ...state, resumeVersions: nextResumes };
      saveState(next);
      return { resumeVersions: nextResumes };
    }),

    deleteResumeVersion: (id) => set((state) => {
      const nextResumes = state.resumeVersions.filter((r) => r.id !== id);
      const next = { ...state, resumeVersions: nextResumes };
      saveState(next);
      return { resumeVersions: nextResumes };
    }),

    addInterviewQuestion: (question) => set((state) => {
      const newQuestion: InterviewPrepQuestion = {
        ...question,
        id: "q_" + Math.random().toString(36).substr(2, 9)
      };
      const nextQuestions = [...state.interviewQuestions, newQuestion];
      const next = { ...state, interviewQuestions: nextQuestions };
      saveState(next);
      return { interviewQuestions: nextQuestions };
    }),

    updateInterviewQuestion: (id, updates) => set((state) => {
      const nextQuestions = state.interviewQuestions.map((q) => (q.id === id ? { ...q, ...updates } : q));
      const next = { ...state, interviewQuestions: nextQuestions };
      saveState(next);
      return { interviewQuestions: nextQuestions };
    }),

    deleteInterviewQuestion: (id) => set((state) => {
      const nextQuestions = state.interviewQuestions.filter((q) => q.id !== id);
      const next = { ...state, interviewQuestions: nextQuestions };
      saveState(next);
      return { interviewQuestions: nextQuestions };
    }),

    addJobApplication: (app) => set((state) => {
      const newApp: JobApplication = {
        ...app,
        id: "a_" + Math.random().toString(36).substr(2, 9)
      };
      const nextApps = [...state.jobApplications, newApp];
      const next = { ...state, jobApplications: nextApps };
      saveState(next);
      return { jobApplications: nextApps };
    }),

    updateJobApplication: (id, updates) => set((state) => {
      const nextApps = state.jobApplications.map((a) => (a.id === id ? { ...a, ...updates } : a));
      const next = { ...state, jobApplications: nextApps };
      saveState(next);
      return { jobApplications: nextApps };
    }),

    deleteJobApplication: (id) => set((state) => {
      const nextApps = state.jobApplications.filter((a) => a.id !== id);
      const next = { ...state, jobApplications: nextApps };
      saveState(next);
      return { jobApplications: nextApps };
    }),

    addPomodoroSession: (session) => set((state) => {
      const newSession: PomodoroSession = {
        id: "pomo_" + Math.random().toString(36).substr(2, 9),
        ...session
      };
      const pomodoroSessions = [...state.pomodoroSessions, newSession];
      const focusTimeToday = state.profile.focusTimeToday + session.duration;
      const focusTimeWeek = state.profile.focusTimeWeek + session.duration;
      const focusTimeMonth = state.profile.focusTimeMonth + session.duration;

      // also gain some XP for focused time! (1 XP per minute)
      const xp = state.profile.xp + session.duration;
      const level = calculateLevel(xp);

      const nextProfile = {
        ...state.profile,
        focusTimeToday,
        focusTimeWeek,
        focusTimeMonth,
        xp,
        level
      };

      const next = { ...state, pomodoroSessions, profile: nextProfile };
      saveState(next);
      return { pomodoroSessions, profile: nextProfile };
    }),

    setActiveTab: (tab) => set((state) => {
      const next = { ...state, activeTab: tab };
      saveState(next);
      return { activeTab: tab };
    }),

    setAiLoading: (loading) => set({ isAiLoading: loading }),

    clearAllData: () => set(() => {
      const cleanProfile: UserProfile = {
        name: "Developer",
        email: "developer@example.com",
        role: "Software Engineer",
        company: "Target Company",
        focusGoal: "",
        xp: 0,
        level: 1,
        streak: 0,
        careerScore: 0,
        focusTimeToday: 0,
        focusTimeWeek: 0,
        focusTimeMonth: 0,
        completedTasksCount: 0
      };
      const cleanState = {
        profile: cleanProfile,
        tasks: [],
        plannerSlots: [],
        roadmaps: [],
        learningSkills: [],
        projects: [],
        habits: [],
        resumeVersions: [],
        interviewQuestions: [],
        jobApplications: [],
        pomodoroSessions: [],
        activeTab: "dashboard",
        isAiLoading: false,
        theme: "dark" as "dark" | "light",
        isAutoStart: true,
        notifications: [
          { id: "init-1", text: "Database cleared! Welcome back to PathForge. Offline SQLite Engine Sync nominal.", timestamp: "12:00", type: "info" as const }
        ],
        dailyPriorities: initialDailyPriorities
      };
      saveState(cleanState);
      return cleanState;
    })
  };
});
