import { useEffect } from "react";
import { useStoreSettings } from "../../hooks/useStoreSettings";

export default function SeoMeta({ title, description }) {
  const { settings } = useStoreSettings();

  useEffect(() => {
    const finalTitle =
      title || settings.seo_home_title || `${settings.store_name || "سوق المعروف"} | خضار وفاكهة طازجة`;

    const finalDescription =
      description ||
      settings.seo_home_description ||
      settings.support_text ||
      "متجر خضار وفاكهة ومنتجات طازجة";

    document.title = finalTitle;

    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }

    meta.setAttribute("content", finalDescription);
  }, [title, description, settings]);

  return null;
}
