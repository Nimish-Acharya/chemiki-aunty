// Title area at the top of every page. "actions" is any buttons to show on the right.
export default function PageHeader({ title, description, actions }) {
  return (
    <div className="row-between" style={{ marginBottom: 20 }}>
      <div>
        <h1>{title}</h1>
        {description && <p className="muted" style={{ marginTop: 4 }}>{description}</p>}
      </div>
      {actions && <div className="row">{actions}</div>}
    </div>
  );
}
