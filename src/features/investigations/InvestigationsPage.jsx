import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/ui/PageHeader";
import Skeleton from "../../components/ui/Skeleton";
import ErrorState from "../../components/ui/ErrorState";
import { useAsync } from "../../hooks/useAsync";
import { investigationsService } from "../../services/investigationsService";
import InvestigationList from "./InvestigationList";

// "Investigations" page: the full searchable history.
export default function InvestigationsPage() {
  const { data, loading, error, reload } = useAsync(investigationsService.list);

  return (
    <div>
      <PageHeader
        title="Investigations"
        description="Search, filter and manage every investigation."
        actions={<Link className="btn btn-primary" to="/new"><Plus size={16} /> New investigation</Link>}
      />
      {error && <ErrorState message={error.message} onRetry={reload} />}
      {!error && loading && !data && <Skeleton height={44} count={6} />}
      {!error && data && (
        <InvestigationList investigations={data} variant="history" pageSize={8} onChanged={reload} />
      )}
    </div>
  );
}
