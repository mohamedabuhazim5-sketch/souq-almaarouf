export default function PageLoader({ text = "جاري التحميل..." }) {
  return (
    <div className="page-loader">
      <div className="loader-dot" />
      <p>{text}</p>
    </div>
  );
}
