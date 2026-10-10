import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Bell, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { navItems } from "../../config/navigation";
import { isDemoMode } from "../../services/apiClient";
import { useToast } from "../feedback/ToastProvider";
import styles from "./AppShell.module.css";

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { showToast } = useToast();

  // Match "/investigations/abc" to the "Investigations" item as well as exact paths.
  const current = navItems.find(
    (item) => item.path === location.pathname || (item.path !== "/" && location.pathname.startsWith(`${item.path}/`))
  );

  // apiClient fires "session-expired" when the backend answers 401.
  useEffect(() => {
    const handler = () => showToast("Your session expired. Sign in again to continue.", "error");
    window.addEventListener("session-expired", handler);
    return () => window.removeEventListener("session-expired", handler);
  }, [showToast]);

  return (
    <div className={styles.shell}>
      {isDemoMode && (
        <div className={styles.demoBanner} role="status">
          Demonstration mode: all data shown is sample data, not live results.
        </div>
      )}

      <div className={styles.body}>
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
          <button className={styles.toggle} onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-label="Toggle sidebar">
            {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>

          <nav aria-label="Main">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} end={item.path === "/"}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>
                  <Icon size={20} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className={styles.main}>
          <header className={styles.topbar}>
            <div>
              <div className={styles.breadcrumb}>Workspace / {current?.label}</div>
              <strong>{current?.label}</strong>
            </div>
            <div className={styles.actions}>
              <button title="Global search (Stage 5)" aria-label="Search" disabled><Search size={18} /></button>
              <button title="Notifications (Stage 3)" aria-label="Notifications" disabled><Bell size={18} /></button>
            </div>
          </header>

          <main className={styles.content}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
