// src/components/StatusBadge.jsx
export default function StatusBadge({ status }) {
  const map = {
    libre: { label: "Libre", cls: "badge success" },
    occupée: { label: "Occupée", cls: "badge danger" },
    indisponible: { label: "Indisponible", cls: "badge warning" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "badge" };
  return <span className={cls}>{label}</span>;
}
