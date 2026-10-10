// Sidebar items. Adding a page later = adding one line here.
import {
  LayoutDashboard, FilePlus, FolderSearch, Users, Share2,
  ShieldAlert, Wrench, FileSearch, FileText, Settings,
} from "lucide-react";

export const navItems = [
  { label: "Overview",           path: "/",               icon: LayoutDashboard },
  { label: "New Investigation",  path: "/new",            icon: FilePlus },
  { label: "Investigations",     path: "/investigations", icon: FolderSearch },
  { label: "Target Profiles",    path: "/targets",        icon: Users },
  { label: "Relationship Graph", path: "/graph",          icon: Share2 },
  { label: "Leaked Information", path: "/leaks",          icon: ShieldAlert },
  { label: "OSINT Tools",        path: "/tools",          icon: Wrench },
  { label: "Evidence & Sources", path: "/evidence",       icon: FileSearch },
  { label: "Reports & Exports",  path: "/reports",        icon: FileText },
  { label: "Settings",           path: "/settings",       icon: Settings },
];
