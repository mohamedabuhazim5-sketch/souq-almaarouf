const statusMap = {
  new: "جديد",
  confirmed: "تم التأكيد",
  preparing: "جاري التجهيز",
  delivering: "خرج للتوصيل",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export default function StatusBadge({ status }) {
  return <span className={`status-badge status-${status}`}>{statusMap[status] || status}</span>;
}
