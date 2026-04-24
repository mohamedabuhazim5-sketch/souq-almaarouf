import { useEffect, useState } from "react";
import { getStoreSettings } from "../services/settings";

const fallbackSettings = {
  store_name: "سوق المعروف",
  whatsapp_number: "01112223226",
  facebook_group_url: "https://www.facebook.com/almaroufmarket",
  facebook_page_url: "https://www.facebook.com/almaroufmarket",
  instagram_url: "",
  support_text: "أهلاً بك في سوق المعروف",
};

export function useStoreSettings() {
  const [settings, setSettings] = useState(fallbackSettings);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getStoreSettings();
        if (data) setSettings({ ...fallbackSettings, ...data });
      } catch {
        // keep fallback
      }
    }
    loadSettings();
  }, []);

  return { settings };
}
