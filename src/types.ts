/**
 * CareerOS Shared Types & Interfaces
 */

export enum TaskStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  BLOCKED = "Blocked",
  COMPLETED = "Completed",
  CANCELLED = "Cancelled"
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
  CRITICAL = "Critical"
}

export enum TaskDifficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
  EXPERT = "Expert"
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  category: string; // e.g. "Work", "Interview Prep", "Learning", "Project"
  estimatedTime: number; // in minutes
  actualTime: number; // in minutes
  dueDate: string; // ISO Date YYYY-MM-DD
  reminder?: string; // Time HH:MM or similar
  notes?: string;
  tags: string[];
  createdAt: string;
  isArchived?: boolean;
}

export interface PlannerSlot {
  time: string; // e.g. "08:00"
  label: string; // e.g. "Exercise"
  taskId?: string; // link to task if applicable
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  role: string; // e.g. "Software Engineer"
  company?: string;
  focusGoal: string; // e.g. "Complete SQL Project"
  xp: number;
  level: number;
  streak: number; // daily consecutive active days
  careerScore: number; // 0 to 100 overall readiness
  focusTimeToday: number; // in minutes
  focusTimeWeek: number; // in minutes
  focusTimeMonth: number; // in minutes
  completedTasksCount: number;
}

export interface CareerMilestone {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  nestedMilestones?: CareerMilestone[];
  dependencies?: string[]; // IDs of milestones that must be completed first
}

export interface CareerRoadmap {
  id: string;
  title: string; // e.g. "Become AI Engineer"
  description?: string;
  progress: number; // 0 to 100
  milestones: CareerMilestone[];
  createdAt: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: "Book" | "Video" | "Article" | "Course" | "Practice";
  url?: string;
  isCompleted: boolean;
}

export interface LearningSkill {
  id: string;
  name: string; // e.g. "Python", "Docker"
  progress: number; // 0 to 100
  hoursLearned: number;
  revisionDate?: string;
  resources: LearningResource[];
  notes?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface CareerProject {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  gitHubUrl?: string;
  liveUrl?: string;
  progress: number; // 0 to 100
  milestones: ProjectMilestone[];
  notes?: string;
  deploymentStatus?: "success" | "pending" | "failed" | "none";
}

export interface Habit {
  id: string;
  name: string; // e.g. "Exercise", "Meditation"
  streak: number;
  frequency: "daily" | "weekly";
  history: { [dateStr: string]: boolean }; // e.g. { "2026-07-12": true }
}

export interface ResumeVersion {
  id: string;
  title: string; // e.g. "Full Stack Engineer v1"
  lastUpdated: string;
  isFavorite: boolean;
  notes?: string;
  aiReviewScore?: number;
  aiReviewFeedback?: string;
}

export interface InterviewPrepQuestion {
  id: string;
  company?: string;
  round?: string; // e.g. "Technical", "System Design"
  category: "DSA" | "System Design" | "Behavioral" | "SQL" | "General";
  question: string;
  answer?: string; // user's notes or prepared answer
  starSituation?: string; // S
  starTask?: string;      // T
  starAction?: string;    // A
  starResult?: string;    // R
  difficulty: "Easy" | "Medium" | "Hard";
  isReviewed: boolean;
}

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  salary?: string;
  location: string;
  status: "Applied" | "HR" | "Technical" | "Manager" | "Offer" | "Rejected";
  appliedDate: string;
  interviewDate?: string;
  notes?: string;
}

export interface PomodoroSession {
  id: string;
  date: string; // YYYY-MM-DD
  duration: number; // in minutes
  category: string;
}

export interface DailyPriority {
  id: string;
  text: string;
  completed: boolean;
  xpValue: number;
}
