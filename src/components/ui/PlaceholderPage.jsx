// Temporary page for features built in later stages.
export default function PlaceholderPage({ title, stage }) {
  return (
    <div>
      <h1>{title}</h1>
      <p className="muted" style={{ marginTop: 4 }}>
        {stage ? `This page is built in ${stage}.` : "This page will be built in a later stage."}
      </p>
    </div>
  );
}
