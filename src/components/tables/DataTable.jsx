import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";

// A reusable table with sorting and pagination.
//
// columns: [{ key, label, sortable, numeric, render(row) }]
//   key      the field name on each row object (used for sorting)
//   render   optional function that returns custom JSX for the cell
// rows:      the array of objects to show
export default function DataTable({
  columns, rows, rowKey = "id", pageSize = 10, defaultSort = null, caption, emptyContent = null,
}) {
  const [sort, setSort] = useState(defaultSort); // { key, direction } or null
  const [page, setPage] = useState(1);

  // useMemo re-sorts only when rows or sort change, not on every render.
  const sortedRows = useMemo(() => {
    if (!sort) return rows;
    const normalize = (value) => (typeof value === "string" ? value.toLowerCase() : value ?? "");
    const copy = [...rows]; // never sort the original array
    copy.sort((a, b) => {
      const first = normalize(a[sort.key]);
      const second = normalize(b[sort.key]);
      let result = 0;
      if (first < second) result = -1;
      if (first > second) result = 1;
      return sort.direction === "asc" ? result : -result;
    });
    return copy;
  }, [rows, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages); // stays valid if rows shrink after filtering
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = sortedRows.slice(startIndex, startIndex + pageSize);

  function handleSort(key) {
    setPage(1);
    setSort((previous) =>
      previous && previous.key === key
        ? { key, direction: previous.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  }

  if (rows.length === 0 && emptyContent) return emptyContent;

  return (
    <div>
      <div className="table-wrap">
        <table className="table">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>
              {columns.map((column) => {
                const isSorted = sort && sort.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={column.numeric ? "num" : ""}
                    aria-sort={isSorted ? (sort.direction === "asc" ? "ascending" : "descending") : "none"}
                  >
                    {column.sortable ? (
                      <button type="button" onClick={() => handleSort(column.key)}>
                        {column.label}
                        {isSorted && (sort.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row[rowKey]}>
                {columns.map((column) => (
                  <td key={column.key} className={column.numeric ? "num" : ""}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedRows.length > pageSize && (
        <div className="row-between" style={{ marginTop: 12 }}>
          <span className="muted small">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedRows.length)} of {sortedRows.length}
          </span>
          <div className="row" style={{ gap: 4 }}>
            <button className="icon-btn" title="Previous page" aria-label="Previous page"
              disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>
              <ChevronLeft size={18} />
            </button>
            <span className="small">Page {currentPage} of {totalPages}</span>
            <button className="icon-btn" title="Next page" aria-label="Next page"
              disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
