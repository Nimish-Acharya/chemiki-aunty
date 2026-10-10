// Data for the Overview page.
// Live mode would call something like GET /api/dashboard/overview (proposed).

import { apiRequest, isDemoMode } from "./apiClient";
import { investigationsService } from "./investigationsService";
import {
  mockActivity, mockActivityChart, mockEntityDistribution, mockFindings, mockToolSummary,
} from "../data/mockDashboard";

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardService = {
  async getOverview({ signal } = {}) {
    if (!isDemoMode) return apiRequest("/api/dashboard/overview", { signal });

    await wait();
    // Cards are calculated from the same investigation list the tables use,
    // so the numbers always match what the user sees.
    const investigations = await investigationsService.list();
    const visible = investigations.filter((item) => item.status !== "archived");
    const sum = (field) => visible.reduce((total, item) => total + (item[field] || 0), 0);

    return {
      summary: {
        totalInvestigations: visible.length,
        activeInvestigations: visible.filter((i) => i.status === "queued" || i.status === "running").length,
        entitiesDiscovered: sum("entityCount"),
        evidenceRecords: sum("evidenceCount"),
        unreviewedFindings: mockFindings.filter((f) => f.status === "unreviewed").length,
        failedToolExecutions: mockToolSummary.reduce((total, row) => total + row.failed, 0),
      },
      findings: mockFindings,
      activity: mockActivity,
      activityChart: mockActivityChart,
      entityDistribution: mockEntityDistribution,
      toolSummary: mockToolSummary,
    };
  },
};
