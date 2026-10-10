import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Archive, Copy, ExternalLink, FolderSearch, Pencil, Trash2 } from "lucide-react";
import DataTable from "../../components/tables/DataTable";
import SearchInput from "../../components/forms/SearchInput";
import { FilterBar, SelectFilter } from "../../components/forms/FilterBar";
import StatusBadge from "../../components/ui/StatusBadge";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useToast } from "../../components/feedback/ToastProvider";
import { STATUS_META, TARGET_TYPE_LABELS } from "../../config/constants";
import { investigationsService } from "../../services/investigationsService";
import { formatDate } from "../../utils/format";

// Searchable, filterable, sortable investigation table used by the Overview page
// ("overview" variant) and the Investigations page ("history" variant).
export default function InvestigationList({ investigations, variant = "history", pageSize = 8, onChanged }) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active"); // "active" = everything except archived
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialog, setDialog] = useState(null);   // { kind: "rename" | "archive" | "delete", item }
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);

  // Apply search and filters. useMemo avoids recalculating on unrelated re-renders.
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return investigations.filter((item) => {
      if (statusFilter === "active" && item.status === "archived") return false;
      if (statusFilter !== "active" && statusFilter !== "all" && item.status !== statusFilter) return false;
      if (typeFilter !== "all" && item.targetType !== typeFilter) return false;
      if (!query) return true;
      const haystack = [item.name, item.primaryTarget, item.caseId, ...(item.tags || [])].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [investigations, search, statusFilter, typeFilter]);

  // Runs a service action, shows feedback, refreshes the data and closes the dialog.
  async function runAction(action, successMessage) {
    setBusy(true);
    try {
      await action();
      showToast(successMessage, "success");
      setDialog(null);
      onChanged();
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setBusy(false);
    }
  }

  function openRename(item) {
    setNewName(item.name);
    setDialog({ kind: "rename", item });
  }

  const actionsColumn = {
    key: "actions", label: "Actions",
    render: (item) => (
      <div className="row" style={{ gap: 0, flexWrap: "nowrap" }}>
        <button className="icon-btn" title="Open investigation" aria-label={`Open ${item.name}`}
          onClick={() => navigate(`/investigations/${item.id}`)}><ExternalLink size={16} /></button>
        <button className="icon-btn" title="Rename" aria-label={`Rename ${item.name}`}
          onClick={() => openRename(item)}><Pencil size={16} /></button>
        {variant === "history" && (
          <button className="icon-btn" title="Duplicate configuration" aria-label={`Duplicate ${item.name}`}
            onClick={() => runAction(() => investigationsService.duplicate(item.id), "Configuration duplicated as a new draft.")}>
            <Copy size={16} />
          </button>
        )}
        <button className="icon-btn" title="Archive" aria-label={`Archive ${item.name}`}
          disabled={item.status === "archived"} onClick={() => setDialog({ kind: "archive", item })}>
          <Archive size={16} />
        </button>
        <button className="icon-btn danger" title="Delete" aria-label={`Delete ${item.name}`}
          onClick={() => setDialog({ kind: "delete", item })}><Trash2 size={16} /></button>
      </div>
    ),
  };

  const nameColumn = {
    key: "name", label: "Investigation", sortable: true,
    render: (item) => (
      <div>
        <button className="btn-ghost" style={{ background: "none", border: "none", color: "var(--text)", font: "inherit", fontWeight: 600, cursor: "pointer", padding: 0, textAlign: "left" }}
          onClick={() => navigate(`/investigations/${item.id}`)}>{item.name}</button>
        {item.isSample && <span className="badge badge-purple" style={{ marginLeft: 8 }}>Sample</span>}
        {item.caseId && <div className="muted small mono">{item.caseId}</div>}
      </div>
    ),
  };
  const targetColumn = { key: "primaryTarget", label: "Primary target", sortable: true,
    render: (item) => <span className="mono">{item.primaryTarget}</span> };
  const typeColumn = { key: "targetType", label: "Target type", sortable: true,
    render: (item) => TARGET_TYPE_LABELS[item.targetType] || item.targetType };
  const statusColumn = { key: "status", label: "Status", sortable: true,
    render: (item) => <StatusBadge status={item.status} /> };

  const columns = variant === "overview"
    ? [
        nameColumn, targetColumn, typeColumn,
        { key: "createdAt", label: "Created", sortable: true, render: (item) => formatDate(item.createdAt) },
        { key: "updatedAt", label: "Updated", sortable: true, render: (item) => formatDate(item.updatedAt) },
        { key: "entityCount", label: "Entities", sortable: true, numeric: true },
        statusColumn, actionsColumn,
      ]
    : [
        nameColumn, targetColumn, typeColumn,
        { key: "createdAt", label: "Created", sortable: true, render: (item) => formatDate(item.createdAt) },
        { key: "lastRunAt", label: "Last run", sortable: true, render: (item) => formatDate(item.lastRunAt) },
        statusColumn,
        { key: "entityCount", label: "Entities", sortable: true, numeric: true },
        { key: "evidenceCount", label: "Evidence", sortable: true, numeric: true },
        { key: "exposureCount", label: "Exposures", sortable: true, numeric: true },
        actionsColumn,
      ];

  const statusOptions = [
    { value: "active", label: "All (not archived)" },
    ...Object.entries(STATUS_META).map(([value, meta]) => ({ value, label: meta.label })),
  ];
  const typeOptions = [
    { value: "all", label: "All types" },
    ...Object.entries(TARGET_TYPE_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const hasFilters = search || statusFilter !== "active" || typeFilter !== "all";

  return (
    <div>
      <FilterBar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search name, target, case ID or tag" label="Search investigations" />
        <SelectFilter label="Status" value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
        <SelectFilter label="Type" value={typeFilter} onChange={setTypeFilter} options={typeOptions} />
      </FilterBar>

      <DataTable
        columns={columns}
        rows={filtered}
        pageSize={pageSize}
        defaultSort={{ key: variant === "overview" ? "updatedAt" : "createdAt", direction: "desc" }}
        caption="Investigations"
        emptyContent={
          <EmptyState
            icon={FolderSearch}
            title={hasFilters ? "No investigations match these filters" : "No investigations yet"}
            message={hasFilters ? "Clear the search or change the filters." : "Create an investigation to start collecting findings."}
            action={hasFilters
              ? <button className="btn" onClick={() => { setSearch(""); setStatusFilter("active"); setTypeFilter("all"); }}>Clear filters</button>
              : <button className="btn btn-primary" onClick={() => navigate("/new")}>New investigation</button>}
          />
        }
      />

      {/* Rename dialog */}
      <Modal
        open={dialog?.kind === "rename"} title="Rename investigation" onClose={() => setDialog(null)}
        footer={
          <>
            <button className="btn" onClick={() => setDialog(null)} disabled={busy}>Cancel</button>
            <button className="btn btn-primary" disabled={busy || !newName.trim()}
              onClick={() => runAction(() => investigationsService.rename(dialog.item.id, newName.trim()), "Investigation renamed.")}>
              Save name
            </button>
          </>
        }
      >
        <label className="field">
          <span className="field-label">Name</span>
          <input className="input" value={newName} onChange={(event) => setNewName(event.target.value)} maxLength={140} autoFocus />
        </label>
      </Modal>

      <ConfirmDialog
        open={dialog?.kind === "archive"} title="Archive investigation?" confirmLabel="Archive" busy={busy}
        message={`"${dialog?.item?.name}" will be hidden from the default list. You can find it again with the Archived status filter.`}
        onCancel={() => setDialog(null)}
        onConfirm={() => runAction(() => investigationsService.archive(dialog.item.id), "Investigation archived.")}
      />

      <ConfirmDialog
        open={dialog?.kind === "delete"} title="Delete investigation?" confirmLabel="Delete investigation" danger busy={busy}
        message={
          <>
            <p>"{dialog?.item?.name}" will be permanently removed.</p>
            <p className="muted" style={{ marginTop: 8 }}>
              Only the investigation record is deleted. Entities and evidence that other investigations
              reference are kept.
            </p>
          </>
        }
        onCancel={() => setDialog(null)}
        onConfirm={() => runAction(() => investigationsService.remove(dialog.item.id), "Investigation deleted.")}
      />
    </div>
  );
}
