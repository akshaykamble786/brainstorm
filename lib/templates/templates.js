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
    id: "resume",
    name: "Resume",
    description: "Professional resume template",
    icon: FileHeart,
    categories: ["all", "personal"],
    status: "Free"
  },
  {
    id: "cover-letter",
    name: "Cover Letter",
    description: "Formal cover letter for job applications",
    icon: FileSignature,
    categories: ["all", "personal"],
    status: "Free"
  },
  {
    id: "legal-contract",
    name: "Legal Contract",
    description: "Standard legal contract template",
    icon: Scale,
    categories: ["all", "legal"],
    status: "Pro"
  },
  {
    id: "meeting-minutes",
    name: "Minutes of Meeting",
    description: "Structured template for meeting notes",
    icon: FileClock,
    categories: ["all", "work"],
    status: "Free"
  },
  {
    id: "project-proposal",
    name: "Project Proposal",
    description: "Detailed project proposal template",
    icon: FileCheck,
    categories: ["all", "work"],
    status: "Free"
  },
  {
    id: "nda",
    name: "NDA",
    description: "Non-disclosure agreement template",
    icon: FileSignature,
    categories: ["all", "legal"],
    status: "Pro"
  },
  {
    id: "weekly-report",
    name: "Weekly Report",
    description: "Weekly progress report template",
    icon: FileSpreadsheet,
    categories: ["all", "work"],
    status: "Free"
  },
  {
    id: "research-paper",
    name: "Research Paper",
    description: "Academic research paper format",
    icon: GraduationCap,
    categories: ["all", "education"],
    status: "Pro"
  },
  {
    id: "study-notes",
    name: "Study Notes",
    description: "Organized study notes template",
    icon: FileCode,
    categories: ["all", "education"],
    status: "Free"
  },
  {
    id: "team-directory",
    name: "Team Directory",
    description: "Organize team members and contacts",
    icon: Users,
    categories: ["all", "work"],
    status: "Pro"
  },
];
