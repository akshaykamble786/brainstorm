import {
  FileText,
  FileHeart,
  FileSignature,
  FileClock,
  FileCheck,
  FileSpreadsheet,
  GraduationCap,
  FileCode,
  Scale,
  Users,
  Calendar,
} from "lucide-react";

export const templateCategories = [
  {
    id: "all",
    name: "All Templates",
  },
  {
    id: "personal",
    name: "Personal",
  },
  {
    id: "work",
    name: "Work",
  },
  {
    id: "education",
    name: "Education",
  },
  {
    id: "legal",
    name: "Legal",
  },
];

export const templates = [
  {
    id: "blank",
    name: "Blank",
    description: "Start from scratch with a blank document",
    icon: FileText,
    categories: ["all"],
  },
  {
    id: "resume",
    name: "Resume",
    description: "Professional resume template",
    icon: FileHeart,
    categories: ["all", "personal"],
  },
  {
    id: "cover-letter",
    name: "Cover Letter",
    description: "Formal cover letter for job applications",
    icon: FileSignature,
    categories: ["all", "personal"],
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    description: "Structured template for meeting notes",
    icon: FileClock,
    categories: ["all", "work"],
  },
  {
    id: "project-proposal",
    name: "Project Proposal",
    description: "Detailed project proposal template",
    icon: FileCheck,
    categories: ["all", "work"],
  },
  {
    id: "weekly-report",
    name: "Weekly Report",
    description: "Weekly progress report template",
    icon: FileSpreadsheet,
    categories: ["all", "work"],
  },
  {
    id: "research-paper",
    name: "Research Paper",
    description: "Academic research paper format",
    icon: GraduationCap,
    categories: ["all", "education"],
  },
  {
    id: "study-notes",
    name: "Study Notes",
    description: "Organized study notes template",
    icon: FileCode,
    categories: ["all", "education"],
  },
  {
    id: "legal-contract",
    name: "Legal Contract",
    description: "Standard legal contract template",
    icon: Scale,
    categories: ["all", "legal"],
  },
  {
    id: "nda",
    name: "NDA",
    description: "Non-disclosure agreement template",
    icon: FileSignature,
    categories: ["all", "legal"],
  },
  {
    id: "team-directory",
    name: "Team Directory",
    description: "Organize team members and contacts",
    icon: Users,
    categories: ["all", "work"],
  },
  {
    id: "project-calendar",
    name: "Project Calendar",
    description: "Project timeline and milestones",
    icon: Calendar,
    categories: ["all", "work"],
  },
];
