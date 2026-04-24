import { useMemo } from "react";
import { useStoreSettings } from "../../hooks/useStoreSettings";

export default function FloatingWhatsApp() {
  const { settings } = useStoreSettings();

  const href = useMemo(() => {
    const number = settings?.whatsapp_number || "01112223226";
    const text = encodeURIComponent("مرحبًا، أريد الطلب من سوق المعروف");
    return `https://wa.me/2${number}?text=${text}`;
  }, [settings?.whatsapp_number]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp"
      aria-label="تواصل واتساب"
      title="تواصل واتساب"
    >
      واتساب
    </a>
  );
}
