import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import PlaceholderPage from "../components/ui/PlaceholderPage";
import ErrorBoundary from "../components/feedback/ErrorBoundary";
import { ToastProvider } from "../components/feedback/ToastProvider";
import DashboardPage from "../features/dashboard/DashboardPage";
import InvestigationsPage from "../features/investigations/InvestigationsPage";
import NewInvestigationPage from "../features/investigations/NewInvestigationPage";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* AppShell wraps every page, so the sidebar is written only once. */}
          <Route element={<AppShell />}>
            <Route path="/" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
            <Route path="/new" element={<ErrorBoundary><NewInvestigationPage /></ErrorBoundary>} />
            <Route path="/investigations" element={<ErrorBoundary><InvestigationsPage /></ErrorBoundary>} />
            {/* ":id" is a URL parameter. The workspace page arrives in Stage 3. */}
            <Route path="/investigations/:id" element={<PlaceholderPage title="Investigation workspace" stage="Stage 3" />} />
            <Route path="/targets" element={<PlaceholderPage title="Target Profiles" stage="Stage 4" />} />
            <Route path="/graph" element={<PlaceholderPage title="Relationship Graph" stage="Stage 3" />} />
            <Route path="/leaks" element={<PlaceholderPage title="Leaked Information" stage="Stage 4" />} />
            <Route path="/tools" element={<PlaceholderPage title="OSINT Tools" stage="Stage 4" />} />
            <Route path="/evidence" element={<PlaceholderPage title="Evidence & Sources" stage="Stage 4" />} />
            <Route path="/reports" element={<PlaceholderPage title="Reports & Exports" stage="Stage 5" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" stage="Stage 5" />} />
            <Route path="*" element={<PlaceholderPage title="Page not found" />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
