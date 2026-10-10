import { AlertTriangle, Boxes, FileSearch, FolderOpen, FolderSearch, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import SummaryCard from "../../components/ui/SummaryCard";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAsync } from "../../hooks/useAsync";
import { dashboardService } from "../../services/dashboardService";
import { investigationsService } from "../../services/investigationsService";
import InvestigationList from "../investigations/InvestigationList";
import { ActivityChart, EntityDistributionChart } from "./DashboardCharts";
import ActivityTimeline from "./ActivityTimeline";
import FindingsList from "./FindingsList";
import styles from "./Dashboard.module.css";

// Overview page. Two data requests run side by side: the summary and the investigation list.
export default function DashboardPage() {
  const overview = useAsync(dashboardService.getOverview);
  const investigations = useAsync(investigationsService.list);

  // After an action in the table (rename, archive, delete) reload both so the cards update too.
  function reloadAll() {
    overview.reload();
    investigations.reload();
  }

  if (overview.error) {
    return (
      <div>
        <PageHeader title="Overview" />
        <ErrorState message={overview.error.message} onRetry={reloadAll} />
      </div>
    );
  }

  const data = overview.data;
  const summary = data?.summary;

  return (
    <div>
      <PageHeader
        title="Overview"
        description="Investigations, findings and tool activity at a glance."
        actions={<Link className="btn btn-primary" to="/new">New investigation</Link>}
      />

      {/* Summary cards */}
      {!data ? (
        <Skeleton height={84} count={2} />
      ) : (
        <div className={styles.cards}>
          <SummaryCard icon={FolderSearch} label="Total investigations" value={summary.totalInvestigations} />
          <SummaryCard icon={FolderOpen} label="Active investigations" value={summary.activeInvestigations} hint="Queued or running" />
          <SummaryCard icon={Boxes} label="Entities discovered" value={summary.entitiesDiscovered} tone="secondary" />
          <SummaryCard icon={FileSearch} label="Evidence records" value={summary.evidenceRecords} tone="secondary" />
          <SummaryCard icon={ShieldAlert} label="Unreviewed exposure findings" value={summary.unreviewedFindings} tone="warning"
            hint="References awaiting review, not confirmed exposures" />
          <SummaryCard icon={AlertTriangle} label="Failed tool executions" value={summary.failedToolExecutions} tone="danger" />
        </div>
      )}

      {/* Recent investigations */}
      <section className="card">
        <div className="card-header">
          <h2>Recent investigations</h2>
          <Link to="/investigations">View all</Link>
        </div>
        {investigations.error && <ErrorState message={investigations.error.message} onRetry={investigations.reload} />}
        {!investigations.error && !investigations.data && <Skeleton height={40} count={5} />}
        {!investigations.error && investigations.data && (
          <InvestigationList investigations={investigations.data} variant="overview" pageSize={5} onChanged={reloadAll} />
        )}
      </section>

      {!data ? (
        <div style={{ marginTop: 16 }}><Skeleton height={260} /></div>
      ) : (
        <>
          <div className={styles.grid2}>
            <section className="card">
              <h2 className="card-header">Investigation activity (last 7 days)</h2>
              <ActivityChart data={data.activityChart} />
            </section>
            <section className="card">
              <h2 className="card-header">Entities by category</h2>
              <EntityDistributionChart data={data.entityDistribution} />
            </section>
          </div>

          <div className={styles.grid2}>
            <section className="card">
              <h2 className="card-header">Tool execution summary</h2>
              <div className="table-wrap">
                <table className="table">
                  <caption className="sr-only">Tool executions</caption>
                  <thead>
                    <tr>
                      <th scope="col">Tool</th>
                      <th scope="col" className="num">Succeeded</th>
                      <th scope="col" className="num">Failed</th>
                      <th scope="col" className="num">Skipped</th>
                      <th scope="col">Last run</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.toolSummary.map((row) => (
                      <tr key={row.tool}>
                        <td>{row.tool}</td>
                        <td className="num">{row.succeeded}</td>
                        <td className="num">{row.failed}</td>
                        <td className="num">{row.skipped}</td>
                        <td><StatusBadge status={row.lastStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section className="card">
              <div className="card-header">
                <h2>Findings awaiting review</h2>
                <Link to="/leaks">Open tracker</Link>
              </div>
              <FindingsList
                findings={data.findings.filter((finding) => finding.status === "unreviewed")}
                emptyMessage="Every finding has been reviewed."
              />
            </section>
          </div>

          <div className={styles.grid2}>
            <section className="card">
              <h2 className="card-header">Recent findings</h2>
              <FindingsList findings={data.findings.slice(0, 4)} emptyMessage="Findings appear here after an investigation runs." />
            </section>
            <section className="card">
              <h2 className="card-header">Recent activity</h2>
              <ActivityTimeline items={data.activity} />
            </section>
          </div>
        </>
      )}
    </div>
  );
}
